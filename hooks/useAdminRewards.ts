import { useState, useEffect } from "react";
import { Reward } from "@/lib/types/reward";
import axios from "@/lib/utils/axios";

export function useAdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRewards = async () => {
    try {
      const { data } = await axios.get("/admin/rewards");
      setRewards(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch rewards")
      );
    } finally {
      setLoading(false);
    }
  };

  const createReward = async (newReward: Omit<Reward, "_id" | "createdAt">) => {
    try {
      const { data } = await axios.post("/admin/rewards", newReward);
      setRewards([...rewards, data]);
      return true;
    } catch (error) {
      console.error("Failed to create reward:", error);
      return false;
    }
  };

  const updateReward = async (id: string, updates: Partial<Reward>) => {
    try {
      const { data } = await axios.patch(`/admin/rewards/${id}`, updates);
      setRewards(rewards.map((reward) => (reward._id === id ? data : reward)));
      return true;
    } catch (error) {
      console.error("Failed to update reward:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return {
    rewards,
    loading,
    error,
    createReward,
    updateReward,
    refreshRewards: fetchRewards,
  };
}
