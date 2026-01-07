import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Purifier, FilterReplacement, Filter } from '@/types';

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
  async getHistory(userId: string): Promise<HistoryEvent[]> {
    const events: HistoryEvent[] = [];

    // Get all purifiers for this user (no orderBy to avoid composite index)
    const purifiersQuery = query(
      collection(db, 'purifiers'),
      where('userId', '==', userId)
    );
    const purifiersSnapshot = await getDocs(purifiersQuery);
    const purifiers = purifiersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purifier[];

    // Create a map of purifier IDs to names
    const purifierMap = new Map<string, Purifier>();
    purifiers.forEach((p) => purifierMap.set(p.id, p));

    // Add purifier creation events (use installationDate, not createdAt)
    for (const purifier of purifiers) {
      const installationDate = purifier.installationDate instanceof Timestamp
        ? purifier.installationDate.toDate()
        : new Date(purifier.installationDate);

      events.push({
        id: `purifier-${purifier.id}`,
        type: 'purifier_created',
        timestamp: installationDate,
        purifierId: purifier.id,
        purifierName: purifier.name,
      });
    }

    // Get all filter replacements for this user (no orderBy to avoid composite index)
    const replacementsQuery = query(
      collection(db, 'filterReplacements'),
      where('userId', '==', userId)
    );
    const replacementsSnapshot = await getDocs(replacementsQuery);
    const replacements = replacementsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FilterReplacement[];

    // Get all filters to map filterId to filter info
    const filterMap = new Map<string, { filter: Filter; purifierId: string }>();
    for (const purifier of purifiers) {
      const filtersSnapshot = await getDocs(
        collection(db, 'purifiers', purifier.id, 'filters')
      );
      filtersSnapshot.docs.forEach((doc) => {
        const filter = { id: doc.id, ...doc.data() } as Filter;
        filterMap.set(filter.id, { filter, purifierId: purifier.id });
      });
    }

    // Add filter replacement events
    for (const replacement of replacements) {
      const filterInfo = filterMap.get(replacement.filterId);
      if (!filterInfo) continue;

      const purifier = purifierMap.get(filterInfo.purifierId);
      if (!purifier) continue;

      const replacedAt = replacement.replacedAt instanceof Timestamp
        ? replacement.replacedAt.toDate()
        : new Date(replacement.replacedAt);

      events.push({
        id: `replacement-${replacement.id}`,
        type: 'filter_replaced',
        timestamp: replacedAt,
        purifierId: filterInfo.purifierId,
        purifierName: purifier.name,
        filterId: replacement.filterId,
        filterName: filterInfo.filter.name,
        filterPosition: filterInfo.filter.position,
        notes: replacement.notes,
      });
    }

    // Sort by timestamp descending (done in JS to avoid composite index)
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return events;
  },
};
