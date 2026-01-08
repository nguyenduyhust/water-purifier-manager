import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { filterService } from '@/services/filter-service';
import type { UpdateFilterData } from '@/types';

interface ReplaceFilterOptions {
  purifierName?: string;
  filterName?: string;
  filterPosition?: number;
}

interface UseFiltersReturn {
  updateFilter: (purifierId: string, filterId: string, data: UpdateFilterData) => Promise<void>;
  replaceFilter: (purifierId: string, filterId: string, replacedAt: Date, notes?: string, options?: ReplaceFilterOptions) => Promise<void>;
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
    async (purifierId: string, filterId: string, replacedAt: Date, notes?: string, options?: ReplaceFilterOptions) => {
      if (!user) throw new Error('User not authenticated');
      await filterService.replaceFilter(
        purifierId,
        filterId,
        user.uid,
        replacedAt,
        notes,
        options?.purifierName,
        options?.filterName,
        options?.filterPosition
      );
    },
    [user]
  );

  return {
    updateFilter,
    replaceFilter,
  };
}
