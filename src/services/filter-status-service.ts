import { addMonths, differenceInDays } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import type { Filter, FilterStatus, FilterWithStatus, DashboardStats } from '@/types';

const WARNING_THRESHOLD_DAYS = 30;

export const filterStatusService = {
  calculateStatus(filter: Filter): FilterWithStatus {
    const lastReplacedDate = filter.lastReplacedAt instanceof Timestamp
      ? filter.lastReplacedAt.toDate()
      : new Date(filter.lastReplacedAt);

    const nextReplacementAt = addMonths(lastReplacedDate, filter.intervalMonths);
    const today = new Date();
    const daysUntilReplacement = differenceInDays(nextReplacementAt, today);

    let status: FilterStatus;

    if (daysUntilReplacement <= 0) {
      status = 'expired';
    } else if (daysUntilReplacement <= WARNING_THRESHOLD_DAYS) {
      status = 'warning';
    } else {
      status = 'ok';
    }

    return {
      ...filter,
      status,
      nextReplacementAt,
      daysUntilReplacement,
    };
  },

  calculateAllStatuses(filters: Filter[]): FilterWithStatus[] {
    return filters.map((filter) => this.calculateStatus(filter));
  },

  calculateDashboardStats(filters: Filter[]): DashboardStats {
    const filtersWithStatus = this.calculateAllStatuses(filters);

    return {
      totalPurifiers: 0, // This should be set by the caller
      totalFilters: filters.length,
      expiredFilters: filtersWithStatus.filter((f) => f.status === 'expired').length,
      warningFilters: filtersWithStatus.filter((f) => f.status === 'warning').length,
      okFilters: filtersWithStatus.filter((f) => f.status === 'ok').length,
    };
  },

  sortByUrgency(filters: FilterWithStatus[]): FilterWithStatus[] {
    return [...filters].sort((a, b) => {
      // Sort by status priority (expired > warning > ok)
      const statusPriority = { expired: 0, warning: 1, ok: 2 };
      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Within same status, sort by days until replacement
      return a.daysUntilReplacement - b.daysUntilReplacement;
    });
  },

  getStatusColor(status: FilterStatus): string {
    switch (status) {
      case 'expired':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'ok':
        return 'success';
      default:
        return 'secondary';
    }
  },
};
