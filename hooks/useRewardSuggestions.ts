import { useState, useEffect } from 'react';
import axios from '@/lib/utils/axios';

interface RewardSuggestion {
  _id: string;
  name: string;
  description: string;
  suggestedBy: {
    _id: string;
    name: string;
  };
  votes: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  suggestedPointsCost: number;
  category: 'LOCAL_PERK' | 'GIFT_CARD' | 'EXPERIENCE' | 'MERCHANDISE';
}

export function useRewardSuggestions() {
  const [suggestions, setSuggestions] = useState<RewardSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSuggestions = async () => {
    try {
      const { data } = await axios.get('/reward-suggestions/organization/suggestions');
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
    } finally {
      setLoading(false);
    }
  };

  const createSuggestion = async (suggestion: { name: string; description: string }) => {
    try {
      await axios.post('/reward-suggestions/organization/suggestions', suggestion);
      await fetchSuggestions();
      return true;
    } catch (error) {
      console.error('Failed to create suggestion:', error);
      return false;
    }
  };

  const toggleVote = async (suggestionId: string) => {
    try {
      await axios.post(`/reward-suggestions/suggestions/${suggestionId}/vote`);
      await fetchSuggestions();
      return true;
    } catch (error) {
      console.error('Failed to toggle vote:', error);
      return false;
    }
  };

  const reviewSuggestion = async (suggestionId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await axios.patch(`/reward-suggestions/suggestions/${suggestionId}/review`, { status });
      await fetchSuggestions();
      return true;
    } catch (error) {
      console.error('Failed to review suggestion:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return {
    suggestions,
    loading,
    error,
    createSuggestion,
    toggleVote,
    reviewSuggestion,
  };
}