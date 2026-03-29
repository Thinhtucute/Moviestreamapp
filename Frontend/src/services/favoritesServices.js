import request from '@/utils/request';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toApiMediaType = (mediaType) => {
    const raw = String(mediaType || '').trim().toLowerCase();
    if (raw === 'movie') {
        return 'movie';
    }
    if (raw === 'tv') {
        return 'tv';
    }
    return 'movie';
};

const buildRequestConfig = (token) => {
    if (!token) {
        return undefined;
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const retryRequest = async (requestFunc, retries = 3, delay = 1000) => {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await requestFunc();
        } catch (error) {
            const status = error?.response?.status;
            const isNetworkError = !error?.response;
            const isTimeout = error?.code === 'ECONNABORTED';
            const isServerError = status >= 500 && status < 600;
            const shouldRetry = isNetworkError || isTimeout || isServerError;

            if (!shouldRetry || attempt === retries) {
                throw error;
            }

            await sleep(delay * (attempt + 1));
        }
    }
};

export const getFavoriteStatus = async (mediaId, mediaType, token) => {
    const response = await retryRequest(() =>
        request.get(`/api/favorites/status/${mediaId}`, {
            ...buildRequestConfig(token),
            params: { mediaType: toApiMediaType(mediaType) },
        }),
    );

    return response.data?.result;
};

export const toggleFavorite = async (mediaId, mediaType, token) => {
    const response = await retryRequest(() =>
        request.post(`/api/favorites/${mediaId}`, {}, {
            ...buildRequestConfig(token),
            params: { mediaType: toApiMediaType(mediaType) },
        }),
    );

    return response.data;
};

export const getFavorites = async (mediaType, token) => {
    const response = await retryRequest(() =>
        request.get('/api/favorites', {
            ...buildRequestConfig(token),
            params: { mediaType: toApiMediaType(mediaType) },
        }),
    );

    return response.data?.result || [];
};
