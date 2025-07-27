import { useEffect } from 'react';
import axios from '@/lib/utils/axios';
import { useUserPoints } from './useUserPoints';

export function useInitialPoints() {
  const setPoints = useUserPoints(state => state.setPoints);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const { data } = await axios.get('/users/points');
        console.log("dataPoints", data);
        setPoints(data.points);
      } catch (error) {
        console.error('Failed to fetch points:', error);
      }
    };
    fetchPoints();
  }, [setPoints]);
} 