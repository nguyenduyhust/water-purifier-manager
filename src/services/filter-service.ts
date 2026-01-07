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
import type { Filter, CreateFilterData, UpdateFilterData, FilterReplacement, CreateFilterReplacementData } from '@/types';

const PURIFIERS_COLLECTION = 'purifiers';
const FILTERS_SUBCOLLECTION = 'filters';
const REPLACEMENTS_COLLECTION = 'filterReplacements';

export const filterService = {
  async getByPurifierId(purifierId: string): Promise<Filter[]> {
    const q = query(
      collection(db, PURIFIERS_COLLECTION, purifierId, FILTERS_SUBCOLLECTION),
      orderBy('position', 'asc')
    );
    const snapshot = await getDocs(q);
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
    userId: string,
    replacedAt: Date,
    notes?: string
  ): Promise<void> {
    // Update filter's lastReplacedAt
    await this.update(purifierId, filterId, { lastReplacedAt: replacedAt });

    // Add replacement history record
    await this.addReplacementHistory({
      filterId,
      userId,
      replacedAt,
      notes,
    });
  },

  subscribeByPurifierId(
    purifierId: string,
    callback: (filters: Filter[]) => void
  ): () => void {
    const q = query(
      collection(db, PURIFIERS_COLLECTION, purifierId, FILTERS_SUBCOLLECTION),
      orderBy('position', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const filters = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Filter[];
      callback(filters);
    });
  },

  // Replacement history methods
  async addReplacementHistory(data: CreateFilterReplacementData): Promise<string> {
    const now = Timestamp.now();

    const replacementData = {
      filterId: data.filterId,
      userId: data.userId,
      replacedAt: Timestamp.fromDate(data.replacedAt),
      notes: data.notes || '',
      createdAt: now,
    };

    const docRef = await addDoc(collection(db, REPLACEMENTS_COLLECTION), replacementData);
    return docRef.id;
  },

  async getReplacementHistory(filterId: string): Promise<FilterReplacement[]> {
    const q = query(
      collection(db, REPLACEMENTS_COLLECTION),
      orderBy('replacedAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return (snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FilterReplacement[])
      .filter((r) => r.filterId === filterId);
  },
};
