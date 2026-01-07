import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { purifierService } from '@/services/purifier-service';
import type { Purifier, CreatePurifierData, UpdatePurifierData } from '@/types';
import type { FilterTemplate } from '@/types';

interface UsePurifiersReturn {
  purifiers: Purifier[];
  loading: boolean;
  error: Error | null;
  addPurifier: (data: Omit<CreatePurifierData, 'userId'>, filterTemplates: FilterTemplate[]) => Promise<string>;
  updatePurifier: (id: string, data: UpdatePurifierData) => Promise<void>;
  deletePurifier: (id: string) => Promise<void>;
  refresh: () => void;
}

export function usePurifiers(): UsePurifiersReturn {
  const { user } = useAuth();
  const [purifiers, setPurifiers] = useState<Purifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setPurifiers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = purifierService.subscribeToAll(user.uid, (data) => {
      setPurifiers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addPurifier = useCallback(
    async (data: Omit<CreatePurifierData, 'userId'>, filterTemplates: FilterTemplate[]) => {
      if (!user) throw new Error('User not authenticated');

      const fullData: CreatePurifierData = {
        ...data,
        userId: user.uid,
      };

      const templates = filterTemplates.map((t) => ({
        position: t.position,
        name: t.name,
        intervalMonths: t.defaultIntervalMonths,
      }));

      return purifierService.create(fullData, templates);
    },
    [user]
  );

  const updatePurifier = useCallback(async (id: string, data: UpdatePurifierData) => {
    await purifierService.update(id, data);
  }, []);

  const deletePurifier = useCallback(async (id: string) => {
    await purifierService.delete(id);
  }, []);

  const refresh = useCallback(() => {
    if (!user) return;
    setLoading(true);
    purifierService.getAll(user.uid).then((data) => {
      setPurifiers(data);
      setLoading(false);
    });
  }, [user]);

  return {
    purifiers,
    loading,
    error,
    addPurifier,
    updatePurifier,
    deletePurifier,
    refresh,
  };
}
