import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '@/assets/images';
import { Box, Typography, Link } from '@mui/material';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <Box component="footer" className={cx('footer')}>
            <Box className={cx('footer-container')}>
                {/* Logo */}
                <Box className={cx('footer-logo')}>
                    <img src={images.logo} alt="FPT Play Logo" className={cx('logo')} />
                </Box>

                {/* Liên kết nhanh */}
                <Box className={cx('footer-links')}>
                    <Typography variant="h6" className={cx('footer-title')}>
                        Liên kết nhanh
                    </Typography>
                    <Link href="#" className={cx('footer-link')}>
                        Trang chủ
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        Truyền hình
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        Phim bộ
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        V-League
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        Anime
                    </Link>
                </Box>

                {/* Thông tin liên hệ */}
                <Box className={cx('footer-contact')}>
                    <Typography variant="h6" className={cx('footer-title')}>
                        Liên hệ
                    </Typography>
                    <Typography className={cx('footer-text')}>Email: support@fptplay.vn</Typography>
                    <Typography className={cx('footer-text')}>Số điện thoại: 1900 1234</Typography>
                    <Typography className={cx('footer-text')}>Địa chỉ: 123 Đường FPT, Quận 1, TP.HCM</Typography>
                </Box>
            </Box>

            {/* Bản quyền */}
            <Box className={cx('footer-copyright')}>
                <Typography className={cx('footer-text')}>© 2025 FPT Play. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}

export default Footer;
