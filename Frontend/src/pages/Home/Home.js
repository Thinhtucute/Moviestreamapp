import BannerSlider from '@/components/Movie/BannerSlider/BannerSlider';
import classNames from 'classnames/bind';
import { Box } from '@mui/material';
import VerticalMovieSections from '@/components/Movie/VerticalMovieCarousel/VerticalMovieSections'
import MoviesCategorySlider from '@/components/Movie/MoviesHome1/MoviesCategorySlider'

function Home() {
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