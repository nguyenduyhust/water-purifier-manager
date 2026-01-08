import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { ActivityLog, CreateActivityLogData } from '@/types';

const COLLECTION_NAME = 'activityLogs';

export const activityLogService = {
  /**
   * Add a new activity log entry
   */
  async add(data: CreateActivityLogData): Promise<string> {
    const now = Timestamp.now();

    const logData = {
      userId: data.userId,
      type: data.type,
      timestamp: Timestamp.fromDate(data.timestamp),
      purifierId: data.purifierId,
      purifierName: data.purifierName,
      filterId: data.filterId || null,
      filterName: data.filterName || null,
      filterPosition: data.filterPosition || null,
      notes: data.notes || null,
      createdAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), logData);
    return docRef.id;
  },

  /**
   * Get activity logs for a user with pagination
   * @param userId - User ID
   * @param limitCount - Number of records to fetch (default 50)
   */
  async getByUserId(userId: string, limitCount = 50): Promise<ActivityLog[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityLog[];
  },

  /**
   * Get activity logs for a specific purifier
   */
  async getByPurifierId(purifierId: string, limitCount = 50): Promise<ActivityLog[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('purifierId', '==', purifierId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityLog[];
  },
};
