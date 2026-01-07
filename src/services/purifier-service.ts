import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Purifier, CreatePurifierData, UpdatePurifierData, Filter } from '@/types';
import { filterService } from './filter-service';

const COLLECTION_NAME = 'purifiers';

export const purifierService = {
  async getAll(userId: string): Promise<Purifier[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purifier[];
  },

  async getById(id: string): Promise<Purifier | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Purifier;
  },

  async create(data: CreatePurifierData, filterTemplates: { position: number; name: string; intervalMonths: number }[]): Promise<string> {
    const now = Timestamp.now();

    const purifierData = {
      userId: data.userId,
      typeId: data.typeId,
      typeName: data.typeName || '',
      name: data.name,
      location: data.location || '',
      installationDate: Timestamp.fromDate(data.installationDate),
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), purifierData);

    // Create filters for this purifier
    const batch = writeBatch(db);
    const filtersCollection = collection(db, COLLECTION_NAME, docRef.id, 'filters');

    for (const template of filterTemplates) {
      const filterRef = doc(filtersCollection);
      batch.set(filterRef, {
        purifierId: docRef.id,
        userId: data.userId,
        position: template.position,
        name: template.name,
        intervalMonths: template.intervalMonths,
        lastReplacedAt: Timestamp.fromDate(data.installationDate),
        createdAt: now,
        updatedAt: now,
      });
    }

    await batch.commit();

    return docRef.id;
  },

  async update(id: string, data: UpdatePurifierData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    // First delete all filters in the subcollection
    const filters = await filterService.getByPurifierId(id);
    const batch = writeBatch(db);

    for (const filter of filters) {
      const filterRef = doc(db, COLLECTION_NAME, id, 'filters', filter.id);
      batch.delete(filterRef);
    }

    // Delete the purifier document
    const purifierRef = doc(db, COLLECTION_NAME, id);
    batch.delete(purifierRef);

    await batch.commit();
  },

  subscribeToAll(
    userId: string,
    callback: (purifiers: Purifier[]) => void
  ): () => void {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const purifiers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Purifier[];
      callback(purifiers);
    });
  },

  subscribeToOne(
    id: string,
    callback: (purifier: Purifier | null) => void
  ): () => void {
    const docRef = doc(db, COLLECTION_NAME, id);

    return onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Purifier);
    });
  },

  // Get filters for a purifier
  async getFilters(purifierId: string): Promise<Filter[]> {
    return filterService.getByPurifierId(purifierId);
  },

  subscribeToFilters(
    purifierId: string,
    callback: (filters: Filter[]) => void
  ): () => void {
    return filterService.subscribeByPurifierId(purifierId, callback);
  },
};
