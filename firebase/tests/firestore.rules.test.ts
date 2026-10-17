import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';

// alice owns p1, bob is an editor, carol a viewer; dave and erin are outsiders.
const users = {
  alice: { email: 'alice@example.com', email_verified: true },
  bob: { email: 'bob@example.com', email_verified: true },
  carol: { email: 'carol@example.com', email_verified: true },
  dave: { email: 'dave@example.com', email_verified: true },
  erin: { email: 'erin@example.com', email_verified: true },
};
type UserId = keyof typeof users;

const DAY = 24 * 60 * 60 * 1000;
const inDays = (days: number) => Timestamp.fromMillis(Date.now() + days * DAY);

let env: RulesTestEnvironment;

function db(user: UserId, tokenOverrides: Record<string, unknown> = {}): Firestore {
  return env.authenticatedContext(user, { ...users[user], ...tokenOverrides }).firestore() as unknown as Firestore;
}

function invite(overrides: Record<string, unknown> = {}) {
  return {
    purifierId: 'p1',
    purifierName: 'Kitchen',
    role: 'editor',
    email: null,
    status: 'pending',
    createdBy: 'alice',
    createdByName: 'Alice',
    createdAt: Timestamp.now(),
    expiresAt: inDays(7),
    ...overrides,
  };
}

function profile(name: string) {
  return { name, email: `${name.toLowerCase()}@example.com`, joinedAt: Timestamp.now() };
}

/** The batch a client sends to accept an invite. */
function acceptBatch(firestore: Firestore, user: UserId, inviteId: string, role: string) {
  const batch = writeBatch(firestore);
  batch.update(doc(firestore, 'purifiers/p1'), {
    memberIds: arrayUnion(user),
    [`roles.${user}`]: role,
    [`memberProfiles.${user}`]: profile(user),
    lastInviteId: inviteId,
  });
  batch.update(doc(firestore, `invites/${inviteId}`), {
    status: 'accepted',
    acceptedBy: user,
    acceptedAt: serverTimestamp(),
  });
  return batch;
}

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-water-purifier',
    firestore: {
      rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const admin = context.firestore() as unknown as Firestore;
    await setDoc(doc(admin, 'purifiers/p1'), {
      userId: 'alice',
      name: 'Kitchen',
      location: '',
      notes: '',
      memberIds: ['bob', 'carol'],
      roles: { bob: 'editor', carol: 'viewer' },
      memberProfiles: { bob: profile('Bob'), carol: profile('Carol') },
    });
    await setDoc(doc(admin, 'purifiers/p1/filters/f1'), {
      purifierId: 'p1',
      userId: 'alice',
      position: 1,
      name: 'PP',
      intervalMonths: 3,
      lastReplacedAt: Timestamp.now(),
    });
    await setDoc(doc(admin, 'purifiers/p1/logs/l1'), {
      type: 'purifier_created',
      actorId: 'alice',
      actorName: 'Alice',
      timestamp: Timestamp.now(),
    });
    await setDoc(doc(admin, 'purifiers/legacy'), { userId: 'alice', name: 'Old purifier' });
    await setDoc(doc(admin, 'invites/link'), invite());
    await setDoc(doc(admin, 'invites/email'), invite({ email: 'erin@example.com', role: 'viewer' }));
    await setDoc(doc(admin, 'invites/expired'), invite({ expiresAt: inDays(-1) }));
    await setDoc(doc(admin, 'invites/used'), invite({ status: 'accepted', acceptedBy: 'carol' }));
    await setDoc(doc(admin, 'invites/usedByDave'), invite({ status: 'accepted', acceptedBy: 'dave' }));
    await setDoc(doc(admin, 'activityLogs/old'), { userId: 'alice', type: 'filter_replaced' });
  });
});

describe('purifiers: read', () => {
  it('lets the owner and members read', async () => {
    await assertSucceeds(getDoc(doc(db('alice'), 'purifiers/p1')));
    await assertSucceeds(getDoc(doc(db('bob'), 'purifiers/p1')));
    await assertSucceeds(getDoc(doc(db('carol'), 'purifiers/p1')));
  });

  it('hides purifiers from outsiders', async () => {
    await assertFails(getDoc(doc(db('dave'), 'purifiers/p1')));
  });

  it('allows the owner query and the shared query', async () => {
    await assertSucceeds(getDocs(query(collection(db('alice'), 'purifiers'), where('userId', '==', 'alice'))));
    await assertSucceeds(getDocs(query(collection(db('bob'), 'purifiers'), where('memberIds', 'array-contains', 'bob'))));
  });

  it('rejects querying someone else\'s purifiers', async () => {
    await assertFails(getDocs(query(collection(db('dave'), 'purifiers'), where('userId', '==', 'alice'))));
  });

  it('still serves purifiers created before sharing existed', async () => {
    await assertSucceeds(getDoc(doc(db('alice'), 'purifiers/legacy')));
  });
});

describe('purifiers: create and delete', () => {
  it('creates a purifier with no members', async () => {
    await assertSucceeds(setDoc(doc(db('alice'), 'purifiers/new'), { userId: 'alice', name: 'New' }));
  });

  it('cannot create a purifier that is already shared or owned by someone else', async () => {
    await assertFails(setDoc(doc(db('alice'), 'purifiers/new'), { userId: 'alice', memberIds: ['bob'], roles: { bob: 'editor' } }));
    await assertFails(setDoc(doc(db('alice'), 'purifiers/new'), { userId: 'bob' }));
  });

  it('only the owner deletes', async () => {
    await assertFails(deleteDoc(doc(db('bob'), 'purifiers/p1')));
    await assertSucceeds(deleteDoc(doc(db('alice'), 'purifiers/p1')));
  });
});

describe('purifiers: editing', () => {
  it('lets editors change details only', async () => {
    await assertSucceeds(updateDoc(doc(db('bob'), 'purifiers/p1'), { name: 'Renamed', updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(db('bob'), 'purifiers/p1'), { 'roles.carol': 'editor' }));
    await assertFails(updateDoc(doc(db('bob'), 'purifiers/p1'), { userId: 'bob' }));
  });

  it('keeps viewers read-only', async () => {
    await assertFails(updateDoc(doc(db('carol'), 'purifiers/p1'), { name: 'Renamed' }));
  });

  it('lets the owner change roles and remove members', async () => {
    await assertSucceeds(updateDoc(doc(db('alice'), 'purifiers/p1'), { 'roles.carol': 'editor' }));
    await assertSucceeds(updateDoc(doc(db('alice'), 'purifiers/p1'), {
      memberIds: arrayRemove('bob'),
      'roles.bob': deleteField(),
      'memberProfiles.bob': deleteField(),
    }));
  });

  it('rejects invalid membership even from the owner', async () => {
    await assertFails(updateDoc(doc(db('alice'), 'purifiers/p1'), { 'roles.carol': 'admin' }));
    await assertFails(updateDoc(doc(db('alice'), 'purifiers/p1'), { memberIds: arrayUnion('alice'), 'roles.alice': 'editor' }));
    await assertFails(updateDoc(doc(db('alice'), 'purifiers/p1'), { memberIds: arrayUnion('dave') }));
  });
});

describe('purifiers: leaving', () => {
  it('lets a member remove themselves', async () => {
    await assertSucceeds(updateDoc(doc(db('carol'), 'purifiers/p1'), {
      memberIds: arrayRemove('carol'),
      'roles.carol': deleteField(),
      'memberProfiles.carol': deleteField(),
    }));
  });

  it('does not let a member remove someone else', async () => {
    await assertFails(updateDoc(doc(db('carol'), 'purifiers/p1'), {
      memberIds: arrayRemove('bob'),
      'roles.bob': deleteField(),
      'memberProfiles.bob': deleteField(),
    }));
  });
});

describe('accepting invites', () => {
  it('joins with a link invite and gets its role', async () => {
    await assertSucceeds(acceptBatch(db('dave'), 'dave', 'link', 'editor').commit());
    await assertSucceeds(getDoc(doc(db('dave'), 'purifiers/p1/filters/f1')));
  });

  it('joins with an email invite sent to the verified email', async () => {
    await assertSucceeds(acceptBatch(db('erin'), 'erin', 'email', 'viewer').commit());
  });

  it('rejects an email invite used by someone else or an unverified email', async () => {
    await assertFails(acceptBatch(db('dave'), 'dave', 'email', 'viewer').commit());
    await assertFails(acceptBatch(db('erin', { email_verified: false }), 'erin', 'email', 'viewer').commit());
  });

  it('rejects taking a higher role than the invite grants', async () => {
    await assertFails(acceptBatch(db('erin'), 'erin', 'email', 'editor').commit());
  });

  it('rejects expired and already used invites', async () => {
    await assertFails(acceptBatch(db('dave'), 'dave', 'expired', 'editor').commit());
    await assertFails(acceptBatch(db('dave'), 'dave', 'used', 'editor').commit());
  });

  it('rejects joining without consuming an invite', async () => {
    await assertFails(updateDoc(doc(db('dave'), 'purifiers/p1'), {
      memberIds: arrayUnion('dave'),
      'roles.dave': 'editor',
      lastInviteId: 'link',
    }));
  });

  it('rejects consuming an invite without joining', async () => {
    await assertFails(updateDoc(doc(db('dave'), 'invites/link'), {
      status: 'accepted',
      acceptedBy: 'dave',
      acceptedAt: serverTimestamp(),
    }));
  });

  it('rejects a removed member rejoining with the invite they already used', async () => {
    await assertFails(updateDoc(doc(db('dave'), 'purifiers/p1'), {
      memberIds: arrayUnion('dave'),
      'roles.dave': 'editor',
      'memberProfiles.dave': profile('Dave'),
      lastInviteId: 'usedByDave',
    }));
  });

  it('rejects the owner joining their own purifier', async () => {
    await assertFails(acceptBatch(db('alice'), 'alice', 'link', 'editor').commit());
  });
});

describe('filters', () => {
  it('are readable by members, including the legacy owner query', async () => {
    await assertSucceeds(getDocs(collection(db('carol'), 'purifiers/p1/filters')));
    await assertSucceeds(getDocs(query(collection(db('alice'), 'purifiers/p1/filters'), where('userId', '==', 'alice'))));
    await assertFails(getDocs(collection(db('dave'), 'purifiers/p1/filters')));
  });

  it('can be replaced by editors but not renamed', async () => {
    await assertSucceeds(updateDoc(doc(db('bob'), 'purifiers/p1/filters/f1'), { lastReplacedAt: Timestamp.now(), updatedAt: Timestamp.now() }));
    await assertFails(updateDoc(doc(db('bob'), 'purifiers/p1/filters/f1'), { name: 'Other' }));
  });

  it('cannot be replaced by viewers', async () => {
    await assertFails(updateDoc(doc(db('carol'), 'purifiers/p1/filters/f1'), { lastReplacedAt: Timestamp.now() }));
  });

  it('are created with a new purifier in one batch, by its owner only', async () => {
    const firestore = db('alice');
    const batch = writeBatch(firestore);
    batch.set(doc(firestore, 'purifiers/p2'), { userId: 'alice', name: 'Office' });
    batch.set(doc(firestore, 'purifiers/p2/filters/f1'), { purifierId: 'p2', userId: 'alice', position: 1 });
    await assertSucceeds(batch.commit());

    await assertFails(setDoc(doc(db('bob'), 'purifiers/p1/filters/f2'), { purifierId: 'p1', userId: 'bob', position: 2 }));
  });

  it('are deleted by the owner only', async () => {
    await assertFails(deleteDoc(doc(db('bob'), 'purifiers/p1/filters/f1')));
    await assertSucceeds(deleteDoc(doc(db('alice'), 'purifiers/p1/filters/f1')));
  });
});

describe('logs', () => {
  it('are readable by every member', async () => {
    await assertSucceeds(getDocs(collection(db('carol'), 'purifiers/p1/logs')));
    await assertFails(getDocs(collection(db('dave'), 'purifiers/p1/logs')));
  });

  it('are written by editors under their own name', async () => {
    const log = { type: 'filter_replaced', actorName: 'Bob', timestamp: Timestamp.now() };
    await assertSucceeds(setDoc(doc(db('bob'), 'purifiers/p1/logs/l2'), { ...log, actorId: 'bob' }));
    await assertFails(setDoc(doc(db('bob'), 'purifiers/p1/logs/l3'), { ...log, actorId: 'alice' }));
    await assertFails(setDoc(doc(db('carol'), 'purifiers/p1/logs/l4'), { ...log, actorId: 'carol' }));
  });

  it('cannot be edited', async () => {
    await assertFails(updateDoc(doc(db('alice'), 'purifiers/p1/logs/l1'), { notes: 'changed' }));
  });
});

describe('invites', () => {
  it('are created by the purifier owner only, within limits', async () => {
    await assertSucceeds(setDoc(doc(db('alice'), 'invites/new'), invite()));
    await assertFails(setDoc(doc(db('bob'), 'invites/new'), invite({ createdBy: 'bob' })));
    await assertFails(setDoc(doc(db('alice'), 'invites/new'), invite({ expiresAt: inDays(30) })));
    await assertFails(setDoc(doc(db('alice'), 'invites/new'), invite({ role: 'owner' })));
    await assertFails(setDoc(doc(db('alice'), 'invites/new'), invite({ email: 'Erin@Example.com' })));
  });

  it('can be opened by anyone signed in who has the link', async () => {
    await assertSucceeds(getDoc(doc(db('dave'), 'invites/link')));
  });

  it('are listed by their creator and by the invited email', async () => {
    await assertSucceeds(getDocs(query(collection(db('alice'), 'invites'), where('createdBy', '==', 'alice'), where('purifierId', '==', 'p1'))));
    await assertSucceeds(getDocs(query(collection(db('erin'), 'invites'), where('email', '==', 'erin@example.com'), where('status', '==', 'pending'))));
    await assertFails(getDocs(query(collection(db('dave'), 'invites'), where('email', '==', 'erin@example.com'))));
  });

  it('can be declined by the invited email only', async () => {
    await assertFails(updateDoc(doc(db('dave'), 'invites/email'), { status: 'declined' }));
    await assertSucceeds(updateDoc(doc(db('erin'), 'invites/email'), { status: 'declined' }));
    await assertFails(updateDoc(doc(db('dave'), 'invites/link'), { status: 'declined' }));
  });

  it('are revoked by their creator only', async () => {
    await assertFails(deleteDoc(doc(db('dave'), 'invites/link')));
    await assertSucceeds(deleteDoc(doc(db('alice'), 'invites/link')));
  });
});

describe('legacy activityLogs', () => {
  it('stay readable by their owner only', async () => {
    await assertSucceeds(getDoc(doc(db('alice'), 'activityLogs/old')));
    await assertFails(getDoc(doc(db('bob'), 'activityLogs/old')));
  });
});
