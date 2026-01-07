import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { purifierService } from '@/services/purifier-service';
import { filterStatusService } from '@/services/filter-status-service';
import type { Purifier, Filter, FilterWithStatus, DashboardStats } from '@/types';

interface FilterWithPurifier extends FilterWithStatus {
  purifierName: string;
  purifierLocation?: string;
}

interface UseAllFiltersReturn {
  filters: FilterWithPurifier[];
  stats: DashboardStats;
  loading: boolean;
  expiredFilters: FilterWithPurifier[];
  warningFilters: FilterWithPurifier[];
  okFilters: FilterWithPurifier[];
}

export function useAllFilters(): UseAllFiltersReturn {
  const { user } = useAuth();
  const [purifiers, setPurifiers] = useState<Purifier[]>([]);
  const [allFilters, setAllFilters] = useState<Map<string, Filter[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPurifiers([]);
      setAllFilters(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to purifiers
    const unsubscribePurifiers = purifierService.subscribeToAll(user.uid, (data) => {
      setPurifiers(data);
    });

    return () => {
      unsubscribePurifiers();
    };
  }, [user]);

  // Subscribe to filters for each purifier
  useEffect(() => {
    if (purifiers.length === 0) {
      setAllFilters(new Map());
      setLoading(false);
      return;
    }

    const unsubscribes: (() => void)[] = [];

    purifiers.forEach((purifier) => {
      const unsubscribe = purifierService.subscribeToFilters(purifier.id, (filters) => {
        setAllFilters((prev) => {
          const newMap = new Map(prev);
          newMap.set(purifier.id, filters);
          return newMap;
        });
        setLoading(false);
      });
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [purifiers]);

  const filtersWithPurifier = useMemo(() => {
    const result: FilterWithPurifier[] = [];

    purifiers.forEach((purifier) => {
      const filters = allFilters.get(purifier.id) || [];
      const filtersWithStatus = filterStatusService.calculateAllStatuses(filters);

      filtersWithStatus.forEach((filter) => {
        result.push({
          ...filter,
          purifierName: purifier.name,
          purifierLocation: purifier.location,
        });
      });
    });

    return filterStatusService.sortByUrgency(result) as FilterWithPurifier[];
  }, [purifiers, allFilters]);

  const stats = useMemo((): DashboardStats => {
    const allFiltersList: Filter[] = [];
    allFilters.forEach((filters) => {
      allFiltersList.push(...filters);
    });

    const baseStats = filterStatusService.calculateDashboardStats(allFiltersList);

    return {
      ...baseStats,
      totalPurifiers: purifiers.length,
    };
  }, [purifiers, allFilters]);

  const expiredFilters = useMemo(
    () => filtersWithPurifier.filter((f) => f.status === 'expired'),
    [filtersWithPurifier]
  );

  const warningFilters = useMemo(
    () => filtersWithPurifier.filter((f) => f.status === 'warning'),
    [filtersWithPurifier]
  );

  const okFilters = useMemo(
    () => filtersWithPurifier.filter((f) => f.status === 'ok'),
    [filtersWithPurifier]
  );

  return {
    filters: filtersWithPurifier,
    stats,
    loading,
    expiredFilters,
    warningFilters,
    okFilters,
  };
}
