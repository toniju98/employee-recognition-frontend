import { create } from 'zustand';

interface UserPointsStore {
  points: number;
  setPoints: (points: number) => void;
}

export const useUserPoints = create<UserPointsStore>((set) => ({
  points: 0,
  setPoints: (points) => set({ points }),
})); 