import request from '@/utils/request';
import {
    getFavoriteStatus,
    getFavorites,
    toggleFavorite,
} from '@/services/favoritesServices';

jest.mock('@/utils/request', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('favoritesServices retry and auth behavior', () => {
    let setTimeoutSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
            callback();
            return 0;
        });
    });

    afterEach(() => {
        setTimeoutSpy.mockRestore();
    });

    it('retries getFavorites on 5xx and eventually returns data', async () => {
        request.get
            .mockRejectedValueOnce({ response: { status: 503 } })
            .mockRejectedValueOnce({ response: { status: 500 } })
            .mockResolvedValueOnce({ data: { result: [{ mediaId: 1 }] } });

        const result = await getFavorites('movie');

        expect(result).toEqual([{ mediaId: 1 }]);
        expect(request.get).toHaveBeenCalledTimes(3);
        expect(request.get).toHaveBeenCalledWith('/api/favorites', {
            params: {
                mediaType: 'movie',
            },
        });
    });

    it('does not retry getFavorites on 401', async () => {
        const authError = { response: { status: 401 } };
        request.get.mockRejectedValueOnce(authError);

        await expect(getFavorites('tv')).rejects.toEqual(authError);
        expect(request.get).toHaveBeenCalledTimes(1);
    });

    it('passes explicit token override in toggleFavorite request headers', async () => {
        request.post.mockResolvedValueOnce({ data: { code: 1000 } });

        await toggleFavorite(42, 'tv', 'manual-token');

        expect(request.post).toHaveBeenCalledWith('/api/favorites/42', {}, {
            params: {
                mediaType: 'tv',
            },
            headers: {
                Authorization: 'Bearer manual-token',
            },
        });
    });

    it('returns favorite status result for a media id', async () => {
        request.get.mockResolvedValueOnce({ data: { result: true } });

        const result = await getFavoriteStatus(9, 'movie');

        expect(result).toBe(true);
        expect(request.get).toHaveBeenCalledWith('/api/favorites/status/9', {
            params: {
                mediaType: 'movie',
            },
        });
    });
});
