import { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';

export function usePoints() {
  const [points, setPoints] = useState<number>(0);
  const [allocationPoints, setAllocationPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPoints = async (): Promise<void> => {
    try {
      const { data } = await axios.get('/users/points');
      setPoints(data.personal);
      setAllocationPoints(data.allocation);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch points'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const updatePoints = (personalPoints: number, allocPoints?: number) => {
    setPoints(personalPoints);
    if (allocPoints !== undefined) {
      setAllocationPoints(allocPoints);
    }
  };

  return {
    points,
    allocationPoints,
    loading,
    error,
    updatePoints,
    fetchPoints
  };
} 