import { useState, useEffect } from "react";
import { Reward } from "@/lib/types/reward";
import axios from "@/lib/utils/axios";


interface CreateRewardPayload {
  name: string;
  description: string;
  pointsCost: number;
  category: "LOCAL_PERK" | "GIFT_CARD" | "EXPERIENCE" | "MERCHANDISE";
  quantity: number;
  createdBy: string;
  imageName?: string;
  image?: File;
}

export function useOrganizationRewards() {
  const [orgRewards, setOrgRewards] = useState<Reward[]>([]);
  const [globalRewards, setGlobalRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrgRewards = async () => {
    try {
      const { data } = await axios.get(
        `/rewards/organization`
      );
      setOrgRewards(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch organization rewards")
      );
    }
  };

  const fetchGlobalRewards = async () => {
    try {
      const { data } = await axios.get("/rewards/global");
      setGlobalRewards(data);
    } catch (err) {
      setError( 
        err instanceof Error ? err : new Error("Failed to fetch global rewards")
      );
    }
  };

  const addToOrganization = async (rewardId: string) => {
    try {
      await axios.post(`/rewards/organization/add/${rewardId}`);
      await fetchOrgRewards(); // Refresh org rewards after adding
      return true;
    } catch (error) {
      console.error("Failed to add reward to organization:", error);
      return false;
    }
  };

  const createCustomReward = async (reward: CreateRewardPayload) => {
    try {
      const formData = new FormData();
      Object.keys(reward).forEach(key => {
        if (key === 'image' && reward.image) {
          formData.append('image', reward.image);
        } else {
          formData.append(key, String(reward[key as keyof CreateRewardPayload]));
        }
      });

      await axios.post(`/rewards/organization`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchOrgRewards();
      return true;
    } catch (error) {
      console.error("Failed to create custom reward:", error);
      return false;
    }
  };

  // TODO: implement whole setting available functionality
  const updateReward = async (id: string, updates: Partial<Reward>) => {
    console.log("updates", updates);
    try {
      const { data } = await axios.patch(
        `/rewards/organization/${id}/status`,
        updates
      );
      console.log("data", data);
      setOrgRewards(
          orgRewards.map((reward) => (reward._id === id ? data : reward))
      );
      //await fetchOrgRewards();
      return true;
    } catch (error) {
      console.error("Failed to update reward:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchOrgRewards(), fetchGlobalRewards()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    orgRewards,
    globalRewards,
    loading,
    error,
    addToOrganization,
    createCustomReward,
    updateReward,
    refreshOrgRewards: fetchOrgRewards,
  };
}
