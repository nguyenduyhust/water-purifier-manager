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

const LEGACY_COLLECTION = 'activityLogs';
const HISTORY_LIMIT = 50;

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
  actorId?: string;
  actorName?: string;
}

function logsCollection(purifierId: string) {
  return collection(db, 'purifiers', purifierId, 'logs');
}

function toHistoryEvent(log: ActivityLog): HistoryEvent {
  return {
    id: log.id,
    type: log.type as HistoryEvent['type'],
    timestamp: log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date(log.timestamp),
    purifierId: log.purifierId,
    purifierName: log.purifierName,
    filterId: log.filterId ?? undefined,
    filterName: log.filterName ?? undefined,
    filterPosition: log.filterPosition ?? undefined,
    notes: log.notes ?? undefined,
    actorId: log.actorId,
    actorName: log.actorName,
  };
}

export const activityLogService = {
  /**
   * Add a history entry to the purifier's log, visible to everyone it is shared with
   */
  async add(purifierId: string, data: CreateActivityLogData): Promise<string> {
    const docRef = await addDoc(logsCollection(purifierId), {
      type: data.type,
      timestamp: Timestamp.fromDate(data.timestamp),
      purifierId,
      purifierName: data.purifierName,
      filterId: data.filterId || null,
      filterName: data.filterName || null,
      filterPosition: data.filterPosition || null,
      notes: data.notes?.trim() || null,
      actorId: data.actor.id,
      actorName: data.actor.name,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  /**
   * Recent history across the given purifiers plus the user's legacy entries
   */
  async getHistory(userId: string, purifierIds: string[]): Promise<HistoryEvent[]> {
    const legacyQuery = query(
      collection(db, LEGACY_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(HISTORY_LIMIT)
    );
    const purifierQueries = purifierIds.map((id) =>
      query(logsCollection(id), orderBy('timestamp', 'desc'), limit(HISTORY_LIMIT))
    );

    const snapshots = await Promise.all([legacyQuery, ...purifierQueries].map((q) => getDocs(q)));
    const logs = snapshots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ActivityLog)
    );

    return logs
      .map(toHistoryEvent)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, HISTORY_LIMIT);
  },
};
