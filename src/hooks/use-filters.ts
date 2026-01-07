import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { filterService } from '@/services/filter-service';
import type { UpdateFilterData, FilterReplacement } from '@/types';

interface UseFiltersReturn {
  updateFilter: (purifierId: string, filterId: string, data: UpdateFilterData) => Promise<void>;
  replaceFilter: (purifierId: string, filterId: string, replacedAt: Date, notes?: string) => Promise<void>;
  getReplacementHistory: (filterId: string) => Promise<FilterReplacement[]>;
}

export function useFilters(): UseFiltersReturn {
  const { user } = useAuth();

  const updateFilter = useCallback(
    async (purifierId: string, filterId: string, data: UpdateFilterData) => {
      await filterService.update(purifierId, filterId, data);
    },
    []
  );

  const replaceFilter = useCallback(
    async (purifierId: string, filterId: string, replacedAt: Date, notes?: string) => {
      if (!user) throw new Error('User not authenticated');
      await filterService.replaceFilter(purifierId, filterId, user.uid, replacedAt, notes);
    },
    [user]
  );

  const getReplacementHistory = useCallback(async (filterId: string) => {
    return filterService.getReplacementHistory(filterId);
  }, []);

  return {
    updateFilter,
    replaceFilter,
    getReplacementHistory,
  };
}
