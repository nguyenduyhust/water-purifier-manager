// Seeds the local emulators with a shared purifier for manual testing and the
// iOS UI tests. Run with the emulators started:
//   node scripts/seed-sharing.mjs
// alice@example.com owns "Kitchen purifier"; bob is an editor, carol a viewer,
// and dave can join with the invite id `daveInviteLink000001`. Password: secret123.

const PROJECT = 'demo-water-purifier';
const AUTH = 'http://127.0.0.1:9099';
const FIRESTORE = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const PASSWORD = 'secret123';
const DAY = 24 * 60 * 60 * 1000;
export const INVITE_ID = 'daveInviteLink000001';

// Firestore REST values; `owner` bypasses security rules in the emulator.
function value(v) {
  if (v === null) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(value) } };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
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
    body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
  });
  const { localId, idToken } = await res.json();
  await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, displayName }),
  });
  return localId;
}

await fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });
await fetch(`${FIRESTORE}`, { method: 'DELETE' });

const [alice, bob, carol] = [
  await createUser('alice@example.com', 'Alice'),
  await createUser('bob@example.com', 'Bob'),
  await createUser('carol@example.com', 'Carol'),
];
await createUser('dave@example.com', 'Dave');

const now = new Date();
await write('purifiers/kitchen', {
  userId: alice,
  ownerName: 'Alice',
  typeId: 'kangaroo-kg102',
  typeName: 'Kangaroo - KG102 (5 filters)',
  name: 'Kitchen purifier',
  location: 'Kitchen',
  notes: '',
  installationDate: new Date(now - 80 * DAY),
  createdAt: now,
  updatedAt: now,
  memberIds: [bob, carol],
  roles: { [bob]: 'editor', [carol]: 'viewer' },
  memberProfiles: {
    [bob]: { name: 'Bob', email: 'bob@example.com', joinedAt: now },
    [carol]: { name: 'Carol', email: 'carol@example.com', joinedAt: now },
  },
});

const filters = [
  ['f1', 1, 'Filter 1 - PP 5µm', 3],
  ['f2', 2, 'Filter 2 - Activated Carbon', 6],
];
for (const [id, position, name, intervalMonths] of filters) {
  await write(`purifiers/kitchen/filters/${id}`, {
    purifierId: 'kitchen',
    userId: alice,
    position,
    name,
    intervalMonths,
    lastReplacedAt: new Date(now - 80 * DAY),
    createdAt: now,
    updatedAt: now,
  });
}

await write('purifiers/kitchen/logs/created', {
  type: 'purifier_created',
  timestamp: new Date(now - 80 * DAY),
  purifierId: 'kitchen',
  purifierName: 'Kitchen purifier',
  filterId: null,
  filterName: null,
  filterPosition: null,
  notes: null,
  actorId: alice,
  actorName: 'Alice',
  createdAt: now,
});

await write(`invites/${INVITE_ID}`, {
  purifierId: 'kitchen',
  purifierName: 'Kitchen purifier',
  role: 'viewer',
  email: null,
  status: 'pending',
  createdBy: alice,
  createdByName: 'Alice',
  createdAt: now,
  expiresAt: new Date(now.getTime() + 7 * DAY),
});

console.log('Seeded: alice (owner), bob (editor), carol (viewer), dave (invite', INVITE_ID + ')');
