import { useState } from 'react';
import axios from '@/lib/utils/axios';
import { useUsers } from '@/hooks/useUsers';
import { useSnackbar } from 'notistack';

interface RecognitionFormData {
  recipient: string;
  message: string;
  category: 'TEAMWORK' | 'INNOVATION' | 'EXCELLENCE' | 'CUSTOMER_SERVICE';
  points?: number;
}


export function useRecognitionForm(onSuccess: () => void) {
  const { enqueueSnackbar } = useSnackbar();
  const { users, loading: usersLoading } = useUsers();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/recognition', formData);
      enqueueSnackbar('Recognition created successfully!', { variant: 'success' });
      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Failed to create recognition:', error);
      enqueueSnackbar('Failed to create recognition', { variant: 'error' });
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    resetForm,
    users,
    usersLoading
  };
}
