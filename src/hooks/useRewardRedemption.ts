import axios from '@/lib/utils/axios';
import { useSnackbar } from 'notistack';
import { usePoints } from './usePoints';

export function useRewardRedemption() {
  const { enqueueSnackbar } = useSnackbar();
  const { updatePoints } = usePoints();

  const redeemReward = async (rewardId: string): Promise<boolean> => {
    try {
      const { data } = await axios.post(`/rewards/redeem/${rewardId}`);
      updatePoints(data.updatedPoints);
      enqueueSnackbar('Reward redeemed successfully!', { variant: 'success' });
      return true;
    } catch (error) {
      enqueueSnackbar('Failed to redeem reward', { variant: 'error' });
      return false;
    }
  };

  return { redeemReward };
} 