// src/hooks/useBanners.js
import { useState, useEffect } from 'react';
import { getMedia } from '@/services/bannerServices';

export const useBanners = () => {
    const [state, setState] = useState({
        banners: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Chỉ fetch nếu banners chưa được tải
        if (state.banners.length === 0 && state.loading) {
            async function fetchBanners() {
                try {
                    const data = await getMedia();
                    setState({
                        banners: data?.result?.content || [],
                        loading: false,
                        error: null,
                    });
                } catch (err) {
                    setState({
                        banners: [],
                        loading: false,
                        error: 'Không thể tải dữ liệu banner',
                    });
                }
            }
            fetchBanners();
        }
    }, []); // Dependency array rỗng để chỉ chạy một lần khi mount

    return state;
};
