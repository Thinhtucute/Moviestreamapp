import request from '../utils/request';
const apiBase = process.env.REACT_APP_API_URL || '';

export const addViewBackend = (mediaId) =>
  request.post(`${apiBase}/api/history/view/${mediaId}`);

export const fetchHistoryBackend = () =>
  request.get(`${apiBase}/api/history`).then(res => res.data);

export const removeHistoryItemBackend = (mediaId) =>
  request.delete(`${apiBase}/api/history/${mediaId}`);

export const clearHistoryBackend = () =>
  request.delete(`${apiBase}/api/history/clear`);