import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { activityLogService, type HistoryEvent } from '@/services/activity-log-service';
import { purifierService } from '@/services/purifier-service';

interface UseHistoryReturn {
  events: HistoryEvent[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useHistory(): UseHistoryReturn {
  const { user } = useAuth();
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // History lives under each purifier, including ones shared with the user.
      const purifiers = await purifierService.getAll(user.uid);
      setEvents(await activityLogService.getHistory(user.uid, purifiers.map((p) => p.id)));
    } catch (err) {
      console.error('History fetch error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch history'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    events,
    loading,
    error,
    refresh: fetchHistory,
  };
}
