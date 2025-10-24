import { useState, useEffect, useCallback, useMemo } from 'react';
import { Recognition } from '@/lib/types/recognition';
import { fetchRecognitions as apiFetchRecognitions } from '@/lib/utils/api';
import axios from '@/lib/utils/axios';
import { useUsers } from './useUsers';

export function useRecognitions() {
  const [rawRecognitions, setRawRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { users } = useUsers();

  // Function to populate recognition data with user information
  const populateRecognitions = useCallback((rawRecognitions: Recognition[]): Recognition[] => {
    if (!users || users.length === 0) {
      return rawRecognitions;
    }
    
    return rawRecognitions.map(recognition => {
      const senderUser = users.find(user => user.keycloakId === recognition.sender);
      const recipientUser = users.find(user => user.keycloakId === recognition.recipient);
      
      return {
        ...recognition,
        sender: senderUser ? {
          name: `${senderUser.firstName} ${senderUser.lastName}`,
          profileImage: senderUser.profileImage || senderUser.profileImageUrl
        } : recognition.sender,
        recipient: recipientUser ? {
          name: `${recipientUser.firstName} ${recipientUser.lastName}`
        } : recognition.recipient
      };
    });
  }, [users]);

  // Memoized populated recognitions
  const recognitions = useMemo(() => {
    return populateRecognitions(rawRecognitions);
  }, [rawRecognitions, populateRecognitions]);

  const refreshRecognitions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/recognition");
      // Handle paginated response format
      const recognitionsData = data?.data || data;
      const rawRecognitions = Array.isArray(recognitionsData) ? recognitionsData : [];
      // Store raw recognitions
      setRawRecognitions(rawRecognitions);
    } catch (err: any) {
      console.error('Error fetching recognitions:', err);
      console.error('Error details:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message
      });
      setError(err instanceof Error ? err : new Error("Failed to fetch recognitions"));
      setRawRecognitions([]); // Ensure recognitions is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRecognitions();
  }, [refreshRecognitions]);

  return { recognitions, loading, error, refreshRecognitions };
}
