import { useState, useEffect } from 'react';
import { getMedia } from '@/services/bannerServices';

export const useBanners = () => {
    const [state, setState] = useState({
        banners: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true; // Flag to ensure state updates only when component is mounted

        async function fetchBanners() {
            try {
                const data = await getMedia();
                if (isMounted) {
                    setState({
                        banners: data?.result?.content || [],
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

        if (state.banners.length === 0 && state.loading) {
            fetchBanners();
        }

        return () => {
            isMounted = false; // Cleanup when component unmounts
        };
    }, [state.banners.length, state.loading]); // Dependency array includes states to re-run when they change

    return state;
};
