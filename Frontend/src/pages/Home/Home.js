import BannerSlider from '@/components/Movie/BannerSlider/BannerSlider';
import classNames from 'classnames/bind';
import styles from '@/pages/Home/Home.module.scss';
import { Box } from '@mui/material';
import MoviesSlider from '@/components/Movie/MoviesSlider/MoviesSlider';

const cx = classNames.bind(styles);
function Home() {
    return (
        <Box className={cx('home')}>
            {/* Banner Slider */}
            <BannerSlider />
            {/* <MoviesSlider size="large" title="Phim Nổi Bật" /> */}
            {/* <MoviesSlider size="small" title="Phim Đề Xuất" /> */}
            {/* <MoviesSlider size="large" orientation="landscape" title="Phim đang chiếu"></MoviesSlider> */}
            <Box>
                <Box
                    sx={{
                        margin: '40px',
                        // padding: '40px',
                        // background: 'linear-gradient(to bottom, var(--second-black), var(--black))', // Gradient từ var(--second-black) xuống var(--black)
                        // borderRadius: '20px',
                    }}
                >
                    <MoviesSlider size="small" orientation="landscape" title="Phim hàn quốc mới"></MoviesSlider>
                    <MoviesSlider size="small" orientation="landscape" title="Phim trung quốc mới"></MoviesSlider>
                    <MoviesSlider size="small" orientation="landscape" title="Phim US-UK mới"></MoviesSlider>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
