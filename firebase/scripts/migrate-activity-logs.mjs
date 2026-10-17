// One-time migration: copy legacy top-level `activityLogs` into
// `purifiers/{purifierId}/logs` so everyone a purifier is shared with sees its history.
//
//   node scripts/migrate-activity-logs.mjs            # audit only (default): reads and reports
//   node scripts/migrate-activity-logs.mjs --apply    # writes the copies
//   node scripts/migrate-activity-logs.mjs --rollback [--apply]  # list [delete] the copies this script made
//   add --emulator to run against the local emulators (demo-water-purifier)
//
// Safety:
// - Never overwrites: each write requires that the target document does not exist yet.
// - Never deletes: `activityLogs` stays as it is.
// - Idempotent: copies keep the original document id, so re-running skips what exists.
// - Skips and reports logs whose purifier is gone or owned by someone else.
//
// Authenticates as the Firebase CLI's logged-in account (`firebase login`), which
// talks to Firestore with IAM permissions and therefore bypasses security rules.

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const auth = require('firebase-tools/lib/auth');

const EMULATOR = process.argv.includes('--emulator');
const PROJECT = EMULATOR
  ? 'demo-water-purifier'
  : (process.argv.find((a) => a.startsWith('--project='))?.split('=')[1] ?? 'water-purifier-manager');
const APPLY = process.argv.includes('--apply');
const ROLLBACK = process.argv.includes('--rollback');
const FIRESTORE_HOST = EMULATOR ? 'http://127.0.0.1:8080' : 'https://firestore.googleapis.com';
const IDENTITY_HOST = EMULATOR ? 'http://127.0.0.1:9099/identitytoolkit.googleapis.com' : 'https://identitytoolkit.googleapis.com';
const BASE = `${FIRESTORE_HOST}/v1/projects/${PROJECT}/databases/(default)/documents`;
const DOC_PREFIX = `projects/${PROJECT}/databases/(default)/documents/`;
const COMMIT_BATCH = 400;
const KNOWN_TYPES = new Set(['purifier_created', 'filter_replaced']);

// The emulators accept `owner` as an admin token.
const account = EMULATOR ? { user: { email: 'emulator admin' } } : auth.getGlobalDefaultAccount();
if (!account) throw new Error('Run `firebase login` first.');
const token = EMULATOR ? 'owner' : (await auth.getAccessToken(account.tokens.refresh_token, [])).access_token;

async function api(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${url}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function listAll(path, mask) {
  const docs = [];
  let pageToken;
  do {
    const params = new URLSearchParams({ pageSize: '300' });
    if (pageToken) params.set('pageToken', pageToken);
    for (const field of mask ?? []) params.append('mask.fieldPaths', field);
    const page = await api(`${BASE}/${path}?${params}`);
    docs.push(...(page.documents ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return docs;
}

const idOf = (doc) => doc.name.split('/').pop();
const str = (field) => field?.stringValue;

// ---------------------------------------------------------------------------
// Read everything needed for the audit.
// ---------------------------------------------------------------------------

console.log(`Project: ${PROJECT}   Mode: ${APPLY ? 'APPLY (writes)' : 'AUDIT (read-only)'}   As: ${account.user.email}\n`);

const legacy = await listAll('activityLogs');
const purifierDocs = await listAll('purifiers', ['userId', 'name', 'ownerName']);
const purifiers = new Map(purifierDocs.map((d) => [idOf(d), d.fields ?? {}]));

const existingTargets = new Set();
const migratedCopies = [];
for (const purifierId of purifiers.keys()) {
  for (const doc of await listAll(`purifiers/${purifierId}/logs`, ['type', 'migratedFrom'])) {
    existingTargets.add(`${purifierId}/${idOf(doc)}`);
    if (doc.fields?.migratedFrom) migratedCopies.push(doc.name);
  }
}

// Rollback removes only documents this script created (marked with migratedFrom).
if (ROLLBACK) {
  console.log(`Copies made by this migration: ${migratedCopies.length}`);
  if (!APPLY) {
    console.log('Rollback audit only. Nothing was deleted. Re-run with --rollback --apply to delete them.');
    process.exit(0);
  }
  for (let i = 0; i < migratedCopies.length; i += COMMIT_BATCH) {
    const writes = migratedCopies.slice(i, i + COMMIT_BATCH).map((name) => ({ delete: name }));
    await api(`${BASE}:commit`, { method: 'POST', body: JSON.stringify({ writes }) });
  }
  console.log(`Deleted ${migratedCopies.length} copied log(s). activityLogs was left unchanged.`);
  process.exit(0);
}

// Display names for the actor field, looked up for the owners of legacy logs.
const ownerIds = [...new Set(legacy.map((d) => str(d.fields?.userId)).filter(Boolean))];
const names = new Map();
for (let i = 0; i < ownerIds.length; i += 100) {
  const result = await api(`${IDENTITY_HOST}/v1/projects/${PROJECT}/accounts:lookup`, {
    method: 'POST',
    body: JSON.stringify({ localId: ownerIds.slice(i, i + 100) }),
  });
  for (const user of result.users ?? []) names.set(user.localId, user.displayName || user.email || '');
}

// ---------------------------------------------------------------------------
// Classify each legacy log.
// ---------------------------------------------------------------------------

const buckets = {
  migrate: [],
  alreadyMigrated: [],
  purifierDeleted: [],
  ownerMismatch: [],
  missingFields: [],
  unknownType: [],
};

for (const doc of legacy) {
  const f = doc.fields ?? {};
  const id = idOf(doc);
  const purifierId = str(f.purifierId);
  const userId = str(f.userId);
  const type = str(f.type);

  if (!purifierId || !userId || !f.timestamp?.timestampValue || !type) {
    buckets.missingFields.push(id);
  } else if (!KNOWN_TYPES.has(type)) {
    buckets.unknownType.push(`${id} (${type})`);
  } else if (!purifiers.has(purifierId)) {
    buckets.purifierDeleted.push(id);
  } else if (str(purifiers.get(purifierId).userId) !== userId) {
    buckets.ownerMismatch.push(id);
  } else if (existingTargets.has(`${purifierId}/${id}`)) {
    buckets.alreadyMigrated.push(id);
  } else {
    buckets.migrate.push(doc);
  }
}

function targetFields(doc) {
  const f = doc.fields;
  const userId = str(f.userId);
  const purifier = purifiers.get(str(f.purifierId));
  const nullValue = { nullValue: null };
  return {
    type: f.type,
    timestamp: f.timestamp,
    purifierId: f.purifierId,
    purifierName: f.purifierName ?? purifier.name ?? { stringValue: '' },
    filterId: f.filterId ?? nullValue,
    filterName: f.filterName ?? nullValue,
    filterPosition: f.filterPosition ?? nullValue,
    notes: f.notes ?? nullValue,
    actorId: { stringValue: userId },
    actorName: { stringValue: names.get(userId) ?? str(purifier.ownerName) ?? '' },
    createdAt: f.createdAt ?? f.timestamp,
    migratedFrom: { stringValue: `activityLogs/${idOf(doc)}` },
  };
}

// ---------------------------------------------------------------------------
// Report (counts and ids only; no personal data).
// ---------------------------------------------------------------------------

const byType = {};
for (const doc of legacy) byType[str(doc.fields?.type) ?? '(none)'] = (byType[str(doc.fields?.type) ?? '(none)'] ?? 0) + 1;
const affectedPurifiers = new Set(buckets.migrate.map((d) => str(d.fields.purifierId)));
const unnamed = buckets.migrate.filter((d) => !names.get(str(d.fields.userId)) && !str(purifiers.get(str(d.fields.purifierId)).ownerName));

console.log('Legacy activityLogs:', legacy.length, byType);
console.log('Owners:', ownerIds.length, `(display names found: ${names.size})`);
console.log('Purifiers in database:', purifiers.size, '  existing per-purifier logs:', existingTargets.size);
console.log('');
console.log('To migrate:          ', buckets.migrate.length, `across ${affectedPurifiers.size} purifier(s)`);
console.log('Already migrated:    ', buckets.alreadyMigrated.length);
console.log('Skip, purifier gone: ', buckets.purifierDeleted.length);
console.log('Skip, owner mismatch:', buckets.ownerMismatch.length, buckets.ownerMismatch.slice(0, 10));
console.log('Skip, missing fields:', buckets.missingFields.length, buckets.missingFields.slice(0, 10));
console.log('Skip, unknown type:  ', buckets.unknownType.length, buckets.unknownType.slice(0, 10));
console.log('Copies without an actor name:', unnamed.length);

if (buckets.migrate.length) {
  const sample = targetFields(buckets.migrate[0]);
  const shape = Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, Object.keys(v)[0]]));
  console.log('\nTarget document shape (field → type):', shape);
}

// ---------------------------------------------------------------------------
// Apply.
// ---------------------------------------------------------------------------

if (!APPLY) {
  console.log('\nAudit only. Nothing was written. Re-run with --apply to copy.');
  process.exit(0);
}

let written = 0;
for (let i = 0; i < buckets.migrate.length; i += COMMIT_BATCH) {
  const writes = buckets.migrate.slice(i, i + COMMIT_BATCH).map((doc) => ({
    update: {
      name: `${DOC_PREFIX}purifiers/${str(doc.fields.purifierId)}/logs/${idOf(doc)}`,
      fields: targetFields(doc),
    },
    currentDocument: { exists: false },
  }));
  await api(`${BASE}:commit`, { method: 'POST', body: JSON.stringify({ writes }) });
  written += writes.length;
  console.log(`Committed ${written}/${buckets.migrate.length}`);
}
console.log(`\nDone. Copied ${written} log(s). activityLogs was left unchanged.`);
