import { Timestamp } from 'firebase/firestore';
import { activityLogService } from './activity-log-service';
import type { ActivityLog } from '@/types';

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

export const historyService = {
  /**
   * Get history events for a user
   * Now uses the unified activityLogs collection - single query, no joins!
   */
  async getHistory(userId: string, limit = 50): Promise<HistoryEvent[]> {
    const logs = await activityLogService.getByUserId(userId, limit);

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
