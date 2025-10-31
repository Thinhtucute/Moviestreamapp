import request from '@/utils/request';

export const getMedia = async () => {
  try {
    const response = await request.get('/api/media/search?releaseYear=2025');
    return response.data;
  } catch (error) {
    console.error('Error fetchingmedia:', error);
    throw error;
  }
};