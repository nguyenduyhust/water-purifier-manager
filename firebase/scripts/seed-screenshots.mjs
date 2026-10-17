// Seeds the local emulators with realistic data for App Store screenshots.
// Run with the emulators started:
//   node scripts/seed-screenshots.mjs [en|vi]
// Sign in as demo@example.com / secret123. Filter names follow the chosen language,
// as they would for a user creating purifiers in that language.

import { readFileSync } from 'node:fs';

const LANG = process.argv[2] === 'vi' ? 'vi' : 'en';
const PROJECT = 'demo-water-purifier';
const AUTH = 'http://127.0.0.1:9099';
const FIRESTORE = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const DAY = 24 * 60 * 60 * 1000;
const catalog = JSON.parse(readFileSync(new URL('../../shared/purifier-types.json', import.meta.url)));

const text = {
  en: { me: 'Anna', partner: 'Linh', kitchen: 'Kitchen', livingRoom: 'Living room', parents: "Parents' house",
        kitchenLoc: 'Under the sink', livingLoc: 'Next to the TV', parentsLoc: 'Hanoi' },
  vi: { me: 'Minh Anh', partner: 'Linh', kitchen: 'Bếp', livingRoom: 'Phòng khách', parents: 'Nhà bố mẹ',
        kitchenLoc: 'Dưới bồn rửa', livingLoc: 'Cạnh tivi', parentsLoc: 'Hà Nội' },
}[LANG];

function value(v) {
  if (v === null) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(value) } };
  if (typeof v === 'number') return { integerValue: String(v) };
  if (typeof v === 'object') return { mapValue: { fields: fields(v) } };
  return { stringValue: String(v) };
}
function fields(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, value(v)]));
}
async function write(path, data) {
  const res = await fetch(`${FIRESTORE}/${path}`, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: fields(data) }),
  });
  if (!res.ok) throw new Error(`write ${path}: ${res.status} ${await res.text()}`);
}
async function createUser(email, displayName) {
  const res = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'secret123', displayName, returnSecureToken: true }),
  });
  return (await res.json()).localId;
}

await fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' });

const me = await createUser('demo@example.com', text.me);
const partner = await createUser('linh@example.com', text.partner);
const now = Date.now();
const ago = (days) => new Date(now - days * DAY);

// replacedDaysAgo: position → days since that filter was last replaced (default: installation).
async function purifier(id, { owner, ownerName, typeId, name, location, installedDaysAgo, replacedDaysAgo = {}, members = {} }) {
  const type = catalog.find((t) => t.id === typeId);
  const memberIds = Object.keys(members);
  await write(`purifiers/${id}`, {
    userId: owner,
    ownerName,
    typeId,
    typeName: type.name[LANG],
    name,
    location,
    notes: '',
    installationDate: ago(installedDaysAgo),
    createdAt: ago(installedDaysAgo),
    updatedAt: ago(0),
    memberIds,
    roles: Object.fromEntries(memberIds.map((uid) => [uid, members[uid].role])),
    memberProfiles: Object.fromEntries(
      memberIds.map((uid) => [uid, { name: members[uid].name, email: members[uid].email, joinedAt: ago(30) }])
    ),
  });
  for (const t of type.filterTemplates) {
    // Real filter ids are random; keep them unique across purifiers like Firestore does.
    await write(`purifiers/${id}/filters/${id}-f${t.position}`, {
      purifierId: id,
      userId: owner,
      position: t.position,
      name: t.name[LANG],
      intervalMonths: t.defaultIntervalMonths,
      lastReplacedAt: ago(replacedDaysAgo[t.position] ?? installedDaysAgo),
      createdAt: ago(installedDaysAgo),
      updatedAt: ago(0),
    });
  }
  await write(`purifiers/${id}/logs/created`, {
    type: 'purifier_created', timestamp: ago(installedDaysAgo), purifierId: id, purifierName: name,
    filterId: null, filterName: null, filterPosition: null, notes: null,
    actorId: owner, actorName: ownerName, createdAt: ago(installedDaysAgo),
  });
  return type;
}

async function replaced(purifierId, purifierName, type, position, daysAgo, actorId, actorName) {
  await write(`purifiers/${purifierId}/logs/replaced-${position}-${daysAgo}`, {
    type: 'filter_replaced', timestamp: ago(daysAgo), purifierId, purifierName,
    filterId: `${purifierId}-f${position}`, filterName: type.filterTemplates[position - 1].name[LANG], filterPosition: position,
    notes: null, actorId, actorName, createdAt: ago(daysAgo),
  });
}

// Kitchen: PP 5µm overdue, carbon due soon, the rest fine.
const kitchen = await purifier('kitchen', {
  owner: me, ownerName: text.me, typeId: 'kangaroo-kg10a17', name: text.kitchen, location: text.kitchenLoc,
  installedDaysAgo: 200, replacedDaysAgo: { 1: 95, 2: 172, 3: 110 },
  members: { [partner]: { role: 'editor', name: text.partner, email: 'linh@example.com' } },
});
await replaced('kitchen', text.kitchen, kitchen, 3, 110, me, text.me);
await replaced('kitchen', text.kitchen, kitchen, 1, 95, partner, text.partner);
await replaced('kitchen', text.kitchen, kitchen, 2, 172, me, text.me);

// Living room: new, everything OK.
await purifier('living-room', {
  owner: me, ownerName: text.me, typeId: 'karofi-kaq-x18', name: text.livingRoom, location: text.livingLoc,
  installedDaysAgo: 45,
});

// Shared with the demo user as an editor.
const parents = await purifier('parents', {
  owner: partner, ownerName: text.partner, typeId: 'sunhouse-sha76222kl', name: text.parents, location: text.parentsLoc,
  installedDaysAgo: 150, replacedDaysAgo: { 1: 80 },
  members: { [me]: { role: 'editor', name: text.me, email: 'demo@example.com' } },
});
await replaced('parents', text.parents, parents, 1, 80, me, text.me);

console.log(`Seeded screenshot data (${LANG}): sign in as demo@example.com / secret123`);
