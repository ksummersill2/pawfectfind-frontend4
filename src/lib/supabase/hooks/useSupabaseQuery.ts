import { useState, useEffect } from 'react';
import { fetchWithRetry } from '../client';
import { useOfflineSync } from './useOfflineSync';

interface UseSupabaseQueryOptions<T> {
  queryFn: () => Promise<{ data: T | null; error: any }>;
  offlineKey?: string;
  allowOffline?: boolean;
  dependencies?: any[];
}

export const useSupabaseQuery = <T>({
  queryFn,
  offlineKey,
  allowOffline = true,
  dependencies = []
}: UseSupabaseQueryOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline } = useOfflineSync();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchWithRetry(queryFn, {
          offlineKey,
          allowOffline
        });

        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [...dependencies, isOnline]);

  return { data, loading, error, isOnline };
};

export default useSupabaseQuery;