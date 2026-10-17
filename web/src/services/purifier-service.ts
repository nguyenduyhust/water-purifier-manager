import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
  type DocumentReference,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Actor, Purifier, CreatePurifierData, UpdatePurifierData, Filter } from '@/types';
import { filterService } from './filter-service';
import { activityLogService } from './activity-log-service';

const COLLECTION_NAME = 'purifiers';
// Firestore batches hold at most 500 writes.
const BATCH_LIMIT = 450;

// Owned purifiers are found by userId, shared ones by memberIds; each needs its own query.
function ownedQuery(userId: string) {
  return query(collection(db, COLLECTION_NAME), where('userId', '==', userId), orderBy('createdAt', 'desc'));
}

function sharedQuery(userId: string) {
  return query(
    collection(db, COLLECTION_NAME),
    where('memberIds', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
}

function toPurifiers(snapshot: QuerySnapshot): Purifier[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Purifier);
}

function newestFirst(purifiers: Purifier[]): Purifier[] {
  return [...purifiers].sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
}

async function deleteInBatches(refs: DocumentReference[]): Promise<void> {
  for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    refs.slice(i, i + BATCH_LIMIT).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

export const purifierService = {
  async getAll(userId: string): Promise<Purifier[]> {
    const [owned, shared] = await Promise.all([getDocs(ownedQuery(userId)), getDocs(sharedQuery(userId))]);
    return newestFirst([...toPurifiers(owned), ...toPurifiers(shared)]);
  },

  async getById(id: string): Promise<Purifier | null> {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    if (!docSnap.exists()) {
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Purifier;
  },

  async create(
    data: CreatePurifierData,
    filterTemplates: { position: number; name: string; intervalMonths: number }[],
    actor: Actor
  ): Promise<string> {
    const now = Timestamp.now();
    const installedAt = Timestamp.fromDate(data.installationDate);
    const purifierRef = doc(collection(db, COLLECTION_NAME));

    // One batch so a purifier never exists without its filters.
    const batch = writeBatch(db);
    batch.set(purifierRef, {
      userId: data.userId,
      typeId: data.typeId,
      typeName: data.typeName || '',
      name: data.name,
      location: data.location || '',
      installationDate: installedAt,
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now,
    });

    const filtersCollection = collection(db, COLLECTION_NAME, purifierRef.id, 'filters');
    for (const template of filterTemplates) {
      batch.set(doc(filtersCollection), {
        purifierId: purifierRef.id,
        userId: data.userId,
        position: template.position,
        name: template.name,
        intervalMonths: template.intervalMonths,
        lastReplacedAt: installedAt,
        createdAt: now,
        updatedAt: now,
      });
    }
    await batch.commit();

    await activityLogService.add(purifierRef.id, {
      type: 'purifier_created',
      timestamp: data.installationDate,
      purifierName: data.name,
      actor,
    });

    return purifierRef.id;
  },

  async update(id: string, data: UpdatePurifierData): Promise<void> {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  /**
   * Owner only: removes the purifier with its filters, history and pending invites
   */
  async delete(id: string, userId: string): Promise<void> {
    const [filters, logs, invites] = await Promise.all([
      getDocs(collection(db, COLLECTION_NAME, id, 'filters')),
      getDocs(collection(db, COLLECTION_NAME, id, 'logs')),
      getDocs(query(collection(db, 'invites'), where('createdBy', '==', userId), where('purifierId', '==', id))),
    ]);

    await deleteInBatches([...filters.docs, ...logs.docs, ...invites.docs].map((d) => d.ref));
    // Last, so the purifier's rules still apply while its children are deleted.
    await deleteInBatches([doc(db, COLLECTION_NAME, id)]);
  },

  subscribeToAll(userId: string, callback: (purifiers: Purifier[]) => void): () => void {
    let owned: Purifier[] | null = null;
    let shared: Purifier[] | null = null;
    const emit = () => {
      if (owned && shared) callback(newestFirst([...owned, ...shared]));
    };

    const unsubscribeOwned = onSnapshot(ownedQuery(userId), (snapshot) => {
      owned = toPurifiers(snapshot);
      emit();
    });
    const unsubscribeShared = onSnapshot(
      sharedQuery(userId),
      (snapshot) => {
        shared = toPurifiers(snapshot);
        emit();
      },
      (error) => {
        // Keep owned purifiers visible even if the shared query fails (e.g. index still building).
        console.error('Shared purifiers subscription error:', error);
        shared = [];
        emit();
      }
    );

    return () => {
      unsubscribeOwned();
      unsubscribeShared();
    };
  },

  subscribeToOne(id: string, callback: (purifier: Purifier | null) => void): () => void {
    return onSnapshot(
      doc(db, COLLECTION_NAME, id),
      (snapshot) => {
        callback(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Purifier) : null);
      },
      // Losing access (removed from a shared purifier) reads like a missing purifier.
      () => callback(null)
    );
  },

  async getFilters(purifierId: string): Promise<Filter[]> {
    return filterService.getByPurifierId(purifierId);
  },

  subscribeToFilters(purifierId: string, callback: (filters: Filter[]) => void): () => void {
    return filterService.subscribeByPurifierId(purifierId, callback);
  },
};
