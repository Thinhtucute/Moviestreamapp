import BannerSlider from "@/components/BannerSlider/BannerSlider";
import classNames from 'classnames/bind';
import styles from '@/pages/Home/Home.module.scss';
import { Box } from '@mui/material';
import MoviesSlider from "@/components/MoviesSlider/MoviesSlider";

const cx = classNames.bind(styles);
function Home() {
     return (
         <Box className={cx('home')}>
             {/* Banner Slider */}
             {/* <BannerSlider /> */}
             <MoviesSlider size="large" title="Phim Nổi Bật" />
             <MoviesSlider size="small" title="Phim Đề Xuất" />
             <MoviesSlider size="large" orientation="landscape" title="Phim đang chiếu"></MoviesSlider>
             <MoviesSlider size="small" orientation="landscape" title="Phim đang chiếu"></MoviesSlider>
         </Box>
     );
}

export default Home;