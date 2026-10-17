import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Actor, Filter, CreateFilterData, UpdateFilterData } from '@/types';
import { activityLogService } from './activity-log-service';

const PURIFIERS_COLLECTION = 'purifiers';
const FILTERS_SUBCOLLECTION = 'filters';

// Access to filters follows the parent purifier, so members query them without a userId filter.
function filtersQuery(purifierId: string) {
  return query(
    collection(db, PURIFIERS_COLLECTION, purifierId, FILTERS_SUBCOLLECTION),
    orderBy('position', 'asc')
  );
}

export const filterService = {
  async getByPurifierId(purifierId: string): Promise<Filter[]> {
    const snapshot = await getDocs(filtersQuery(purifierId));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Filter[];
  },

  async getById(purifierId: string, filterId: string): Promise<Filter | null> {
    const docRef = doc(db, PURIFIERS_COLLECTION, purifierId, FILTERS_SUBCOLLECTION, filterId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Filter;
  },

  async create(data: CreateFilterData): Promise<string> {
    const now = Timestamp.now();

    const filterData = {
      purifierId: data.purifierId,
      userId: data.userId,
      position: data.position,
      name: data.name,
      intervalMonths: data.intervalMonths,
      lastReplacedAt: Timestamp.fromDate(data.lastReplacedAt),
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(
      collection(db, PURIFIERS_COLLECTION, data.purifierId, FILTERS_SUBCOLLECTION),
      filterData
    );

    return docRef.id;
  },

  async update(purifierId: string, filterId: string, data: UpdateFilterData): Promise<void> {
    const docRef = doc(db, PURIFIERS_COLLECTION, purifierId, FILTERS_SUBCOLLECTION, filterId);

    const updateData: { updatedAt: Timestamp; intervalMonths?: number; lastReplacedAt?: Timestamp } = {
      updatedAt: Timestamp.now(),
    };

    if (data.intervalMonths !== undefined) {
      updateData.intervalMonths = data.intervalMonths;
    }

    if (data.lastReplacedAt !== undefined) {
      updateData.lastReplacedAt = Timestamp.fromDate(data.lastReplacedAt);
    }

    await updateDoc(docRef, updateData);
  },

  async replaceFilter(
    purifierId: string,
    filterId: string,
    replacedAt: Date,
    actor: Actor,
    details: { purifierName: string; filterName?: string; filterPosition?: number; notes?: string }
  ): Promise<void> {
    await this.update(purifierId, filterId, { lastReplacedAt: replacedAt });

    await activityLogService.add(purifierId, {
      type: 'filter_replaced',
      timestamp: replacedAt,
      purifierName: details.purifierName,
      filterId,
      filterName: details.filterName,
      filterPosition: details.filterPosition,
      notes: details.notes,
      actor,
    });
  },

  subscribeByPurifierId(purifierId: string, callback: (filters: Filter[]) => void): () => void {
    return onSnapshot(
      filtersQuery(purifierId),
      (snapshot) => {
        const filters = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Filter[];
        callback(filters);
      },
      // Losing access to a shared purifier ends with no filters rather than an uncaught error.
      () => callback([])
    );
  },
};
