import { useEffect } from 'react';
import BannerSlider from '@/components/Movie/BannerSlider/BannerSlider';
import { Box } from '@mui/material';
import VerticalMovieSections from '@/components/Movie/VerticalMovieCarousel/VerticalMovieSections'
import MoviesCategorySlider from '@/components/Movie/MoviesHome1/MoviesCategorySlider'

const HOME_SCROLL_KEY = 'home:scrollY';

function Home() {
    useEffect(() => {
        const savedPosition = Number(sessionStorage.getItem(HOME_SCROLL_KEY));
        if (Number.isFinite(savedPosition) && savedPosition > 0) {
            window.requestAnimationFrame(() => {
                window.scrollTo(0, savedPosition);
            });
        }
    }, []);

    useEffect(() => {
        const persistScroll = () => {
            sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY));
        };

        window.addEventListener('scroll', persistScroll, { passive: true });

        return () => {
            persistScroll();
            window.removeEventListener('scroll', persistScroll);
        };
    }, []);

    return (
        <Box className={('home')}>
            {/* Banner Slider */}
            <BannerSlider />
            {/* <MoviesSlider size="large" title="Phim Nổi Bật" /> */}
            {/* <MoviesSlider size="small" title="Phim Đề Xuất" /> */}
            {/* <MoviesSlider size="large" orientation="landscape" title="Phim đang chiếu"></MoviesSlider> */}
            {/* <MoviesSlider size="small" orientation="landscape" title="Phim trung quốc mới"></MoviesSlider> */}

            <Box>
               <MoviesCategorySlider/>
            </Box>
            
            <VerticalMovieSections/>
        </Box>
    );
}

export default Home;