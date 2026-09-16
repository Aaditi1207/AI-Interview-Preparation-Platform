import axiosClient from './axiosClient.js';

export async function getHistory(limit = 50) {
  const { data } = await axiosClient.get('/history', { params: { limit } });
  return data;
}
