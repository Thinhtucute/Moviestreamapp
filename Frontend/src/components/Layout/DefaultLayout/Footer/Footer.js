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

                {/* Quick Links */}
                <Box className={cx('footer-links')}>
                    <Typography variant="h6" className={cx('footer-title')}>
                        Quick Links
                    </Typography>
                    <Link href="#" className={cx('footer-link')}>
                        Home
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        TV Shows
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        Movies
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        V-League
                    </Link>
                    <Link href="#" className={cx('footer-link')}>
                        Anime
                    </Link>
                </Box>

                {/* Contact Information */}
                <Box className={cx('footer-contact')}>
                    <Typography variant="h6" className={cx('footer-title')}>
                        Contact
                    </Typography>
                    <Typography className={cx('footer-text')}>Email: support@fptplay.vn</Typography>
                    <Typography className={cx('footer-text')}>Phone: 1900 1234</Typography>
                    <Typography className={cx('footer-text')}>Address: 123 FPT Street, District 1, HCMC</Typography>
                </Box>
            </Box>

            {/* Copyright */}
            <Box className={cx('footer-copyright')}>
                <Typography className={cx('footer-text')}>© 2025 FPT Play. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}

export default Footer;
