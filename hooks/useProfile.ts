import { useState, useEffect } from 'react';
import { UserProfile, RewardPreference, Achievement } from '@/lib/types/user';
import { Recognition } from '@/lib/types/recognition';
import { Reward } from '@/lib/types/reward';
import axios from '@/lib/utils/axios';
import { usePoints } from './usePoints';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [receivedRecognitions, setReceivedRecognitions] = useState<Recognition[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { updatePoints, fetchPoints } = usePoints();

  //TODO: fix profile image logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, recognitionsResponse] = await Promise.all([
          axios.get("/users/profile"),
          axios.get("/recognition/user-data")
        ]);

        const profileData = {
          ...profileResponse.data,
          avatar: profileResponse.data.profileImage 
            ? `http://localhost:5000/uploads/profiles/${profileResponse.data.profileImage}` 
            : null
        };

        setProfile(profileData);
        updatePoints(profileResponse.data.points, profileResponse.data.allocationPoints);
        setRedeemedRewards(profileResponse.data.redeemedRewards);
        setReceivedRecognitions(recognitionsResponse.data.receivedRecognitions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile data'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePreferences = async (preferences: RewardPreference[]) => {
    try {
      const { data } = await axios.patch(`/users/preferences`, { preferences });
      setProfile(prev => prev ? { ...prev, rewardPreferences: data.rewardPreferences } : null);
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/users/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = data.profileImage
        ? await axios
            .get(`/uploads/profiles/${data.profileImage}`, {
              responseType: "blob",
            })
            .then((response) => URL.createObjectURL(response.data))
        : null;
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              avatar: data.profileImage
                ? `http://localhost:5000/uploads/profiles/${data.profileImage}`
                : undefined,
            }
          : null
      );
      return true;
    } catch (error) {
      console.error('Failed to update avatar:', error);
      return false;
    }
  };

  return {
    profile,
    achievements,
    receivedRecognitions,
    redeemedRewards,
    loading,
    error,
    updatePreferences,
    updateAvatar
  };
}
