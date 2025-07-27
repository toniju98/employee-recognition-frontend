export interface Reward {
  _id: string;
  name: string;
  description: string;
  pointsCost: number;
  image?: string;
  category: 'GIFT_CARD' | 'EXPERIENCE' | 'MERCHANDISE';
  isActive: boolean;
  createdAt: string;
}
