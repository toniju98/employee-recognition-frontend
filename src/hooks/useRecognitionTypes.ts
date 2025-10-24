import { useState, useEffect } from 'react';
import { RecognitionType } from '@/lib/types/admin';
import axios from '@/lib/utils/axios';

export function useRecognitionTypes() {
  const [types, setTypes] = useState<RecognitionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTypes = async (): Promise<void> => {
    try {
      const { data } = await axios.get('/admin/recognition-types');
      setTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recognition types'));
    } finally {
      setLoading(false);
    }
  };

  const createType = async (newType: Omit<RecognitionType, '_id' | 'createdAt'>): Promise<boolean> => {
    try {
      const { data } = await axios.post('/admin/recognition-types', newType);
      setTypes([...types, data]);
      return true;
    } catch (error) {
      console.error('Failed to create recognition type:', error);
      return false;
    }
  };

  const updateType = async (id: string, updates: Partial<RecognitionType>): Promise<boolean> => {
    try {
      const { data } = await axios.patch(`/admin/recognition-types/${id}`, updates);
      setTypes(types.map(type => type._id === id ? data : type));
      return true;
    } catch (error) {
      console.error('Failed to update recognition type:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return {
    types,
    loading,
    error,
    createType,
    updateType,
    refreshTypes: fetchTypes
  };
}
