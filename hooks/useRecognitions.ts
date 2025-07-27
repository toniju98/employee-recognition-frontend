import { useState, useEffect, useCallback } from 'react';
import { Recognition } from '@/lib/types/recognition';
import { fetchRecognitions as apiFetchRecognitions } from '@/lib/utils/api';
import axios from '@/lib/utils/axios';

export function useRecognitions() {
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshRecognitions = async () => {
    try {
      const { data } = await axios.get("/recognition");
      // Transform the data to match the new Recognition type
      
      setRecognitions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch recognitions"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecognitions();
  }, []);

  return { recognitions, loading, error, refreshRecognitions };
}
