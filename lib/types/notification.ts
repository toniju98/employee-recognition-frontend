export interface Notification {
  _id: string;
  userId: string;
  type: 'RECOGNITION' | 'REWARD' | 'ACHIEVEMENT' | 'POINTS';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    recognitionId?: string;
    rewardId?: string;
    achievementId?: string;
    points?: number;
  };
}
