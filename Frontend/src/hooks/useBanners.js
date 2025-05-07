import { useState, useEffect } from 'react';
import { getMedia } from '@/services/bannerServices';

export const useBanners = () => {
    const [state, setState] = useState({
        banners: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true; // Biến cờ để đảm bảo chỉ cập nhật state khi component còn tồn tại

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
                        error: 'Không thể tải dữ liệu banner',
                    });
                }
            }
        }

        if (state.banners.length === 0 && state.loading) {
            fetchBanners();
        }

        return () => {
            isMounted = false; // Cleanup khi component unmount
        };
    }, [state.banners.length, state.loading]); // Dependency array bao gồm các trạng thái để chạy lại khi chúng thay đổi

    return state;
};
