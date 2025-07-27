import { useState, useEffect } from 'react';
import { Reward } from '@/lib/types/reward';
import { fetchRewards } from '@/lib/utils/api';

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRewards = async () => {
      try {
        const data = await fetchRewards();
        setRewards(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch rewards'));
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  return { rewards, loading, error };
}
