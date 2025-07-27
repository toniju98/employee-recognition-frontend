import { Recognition } from '../types/recognition';
import { Reward } from '../types/reward';
import axios from './axios';

export async function fetchRecognitions(): Promise<Recognition[]> {
  const { data } = await axios.get('/recognition');
  return data;
}

export async function fetchRewards(): Promise<Reward[]> {
  const { data } = await axios.get('/rewards/organization');
  return data;
}

export async function createRecognition(data: Partial<Recognition>): Promise<Recognition> {
  const { data: response } = await axios.post('/recognition', data);
  return response;
}
