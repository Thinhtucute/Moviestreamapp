import request from '../utils/request';
const apiBase = process.env.REACT_APP_API_URL || '';

const toApiMediaType = (mediaType) => {
  const raw = String(mediaType || '').trim().toLowerCase();
  if (raw === 'movie') return 'movie';
  if (raw === 'tv') return 'tv';
  return 'movie';
};

export const addViewBackend = (mediaId, mediaType) =>
  request.post(`${apiBase}/api/history/view/${mediaId}`, null, {
    params: {
      mediaType: toApiMediaType(mediaType),
    },
  });

export const fetchHistoryBackend = () =>
  request.get(`${apiBase}/api/history`).then(res => res.data);

export const removeHistoryItemBackend = (mediaId, mediaType) =>
  request.delete(`${apiBase}/api/history/${mediaId}`, {
    params: {
      mediaType: toApiMediaType(mediaType),
    },
  });

export const clearHistoryBackend = () =>
  request.delete(`${apiBase}/api/history/clear`);