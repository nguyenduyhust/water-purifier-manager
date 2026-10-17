import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { purifierService } from '@/services/purifier-service';
import { filterStatusService } from '@/services/filter-status-service';
import { getAccessRole } from '@/lib/sharing';
import type { AccessRole, Purifier, Filter, FilterWithStatus } from '@/types';

interface UsePurifierReturn {
  purifier: Purifier | null;
  filters: FilterWithStatus[];
  /** The signed-in user's access, null while loading or without access */
  role: AccessRole | null;
  loading: boolean;
  error: Error | null;
}

export function usePurifier(purifierId: string | undefined): UsePurifierReturn {
  const { user } = useAuth();
  const [purifier, setPurifier] = useState<Purifier | null>(null);
  const [filters, setFilters] = useState<FilterWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!purifierId || !user) {
      setPurifier(null);
      setFilters([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to purifier
    const unsubscribePurifier = purifierService.subscribeToOne(purifierId, (data) => {
      setPurifier(data);
      if (!data) {
        setLoading(false);
      }
    });

    // Subscribe to filters
    const unsubscribeFilters = purifierService.subscribeToFilters(purifierId, (data: Filter[]) => {
      const filtersWithStatus = filterStatusService.calculateAllStatuses(data);
      setFilters(filterStatusService.sortByUrgency(filtersWithStatus));
      setLoading(false);
    });

    return () => {
      unsubscribePurifier();
      unsubscribeFilters();
    };
  }, [purifierId, user]);

  return {
    purifier,
    filters,
    role: purifier ? getAccessRole(purifier, user?.uid) : null,
    loading,
    error,
  };
}
