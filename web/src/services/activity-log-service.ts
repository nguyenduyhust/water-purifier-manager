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

export interface HistoryEvent {
  id: string;
  type: 'purifier_created' | 'filter_replaced';
  timestamp: Date;
  purifierId: string;
  purifierName: string;
  filterId?: string;
  filterName?: string;
  filterPosition?: number;
  notes?: string;
}

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
   * Get history events for a user (transformed for UI display)
   */
  async getHistory(userId: string, limitCount = 50): Promise<HistoryEvent[]> {
    const logs = await this.getByUserId(userId, limitCount);

    return logs.map((log: ActivityLog) => ({
      id: log.id,
      type: log.type as 'purifier_created' | 'filter_replaced',
      timestamp: log.timestamp instanceof Timestamp
        ? log.timestamp.toDate()
        : new Date(log.timestamp),
      purifierId: log.purifierId,
      purifierName: log.purifierName,
      filterId: log.filterId,
      filterName: log.filterName,
      filterPosition: log.filterPosition,
      notes: log.notes,
    }));
  },
};
