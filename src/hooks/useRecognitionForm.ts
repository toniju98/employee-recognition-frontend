import { useState, useMemo } from 'react';
import axios from '@/lib/utils/axios';
import { useUsers } from '@/hooks/useUsers';
import { useSnackbar } from 'notistack';
import { getCurrentUserId } from '@/lib/auth/keycloak';

interface RecognitionFormData {
  recipient: string;
  message: string;
  category: 'TEAMWORK' | 'INNOVATION' | 'EXCELLENCE' | 'CUSTOMER_SERVICE';
  points?: number;
}


export function useRecognitionForm(onSuccess: () => void) {
  const { enqueueSnackbar } = useSnackbar();
  const { users, loading: usersLoading } = useUsers();
  const currentUserId = getCurrentUserId();
  
  // Filter out the current user from the recipients list
  const availableUsers = useMemo(() => {
    if (!users || !currentUserId) return users || [];
    const filtered = users.filter(user => user.keycloakId !== currentUserId);
    // Debug logging removed for security
    return filtered;
  }, [users, currentUserId]);
  
  const [formData, setFormData] = useState<RecognitionFormData>({
    recipient: '',
    message: '',
    category: 'TEAMWORK',
    points: 5
  });

  const resetForm = () => {
    setFormData({
      recipient: '',
      message: '',
      category: 'TEAMWORK',
      points: 5
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Input validation
    if (!formData.recipient || !formData.message || !formData.category) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }
    
    // Sanitize message input
    const sanitizedMessage = formData.message.trim().substring(0, 1000); // Limit length
    
    try {
      await axios.post('/recognition', {
        ...formData,
        message: sanitizedMessage
      });
      enqueueSnackbar('Recognition created successfully!', { variant: 'success' });
      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error('Failed to create recognition:', error);
      // Removed detailed error logging for security
      
      // Extract error message from backend response
      let errorMessage = 'Failed to create recognition';
      
      if (error?.response?.data) {
        // Handle structured error responses
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.details) {
          errorMessage = error.response.data.details;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.statusText) {
        errorMessage = error.response.statusText;
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    resetForm,
    users: availableUsers,
    usersLoading
  };
}
