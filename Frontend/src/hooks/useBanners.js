import { useState, useEffect } from 'react';
import { getMedia } from '@/services/bannerServices';

let bannersCache = null;

export const useBanners = () => {
    const [state, setState] = useState({
        banners: bannersCache || [],
        loading: !bannersCache,
        error: null,
    });

    useEffect(() => {
        if (bannersCache) {
            setState({
                banners: bannersCache,
                loading: false,
                error: null,
            });
            return;
        }

        let isMounted = true; // Flag to ensure state updates only when component is mounted

        async function fetchBanners() {
            try {
                const data = await getMedia();
                const banners = data?.result?.content || [];
                bannersCache = banners;
                if (isMounted) {
                    setState({
                        banners,
                        loading: false,
                        error: null,
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setState({
                        banners: [],
                        loading: false,
                        error: 'Unable to load banner data',
                    });
                }
            }
        }

        fetchBanners();

        return () => {
            isMounted = false; // Cleanup when component unmounts
        };
    }, []);

    return state;
};
