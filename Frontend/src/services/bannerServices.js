 // src/service/bannerService.js
import request from '@/utils/request';

export const getMedia = async () => {
  try {
    const response = await request.get('/api/media');
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu media:', error);
    throw error;
  }
};