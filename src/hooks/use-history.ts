import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { historyService, type HistoryEvent } from '@/services/history-service';

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

  const fetchHistory = async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await historyService.getHistory(user.uid);
      setEvents(data);
    } catch (err) {
      console.error('History fetch error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch history'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  return {
    events,
    loading,
    error,
    refresh: fetchHistory,
  };
}
