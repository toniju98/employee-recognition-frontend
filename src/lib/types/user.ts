export type RewardPreference = 'FOOD' | 'TRAVEL' | 'ELECTRONICS' | 'BOOKS' | 'ENTERTAINMENT';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  points: number;
  allocationPoints: number;
  rewardPreferences: RewardPreference[];
  avatar?: string;
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  earnedAt: string;
  type: 'RECOGNITION' | 'POINTS' | 'REWARDS';
  icon?: string;
}
