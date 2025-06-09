import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Box, Typography, Link } from '@mui/material';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <Box component="footer" className={cx('footer')}>
            <Box className={cx('footer-container')}>
                {/* Logo */}
                <Box className={cx('footer-logo')}>
                    <Typography
                        sx={{
                            fontSize: '30px',
                            fontWeight: 'bold',
                            color: 'var(--primary)',
                            textTransform: 'none',
                        }}
                    >
                        JAVA Play
                    </Typography>
                </Box>

                {/* Quick Links */}
                <Box className={cx('footer-links')}>
                    <Typography variant="h6" className={cx('footer-title')}>
                        Quick Links
                    </Typography>
                    <Link href="/" className={cx('footer-link')}>
                        Home
                    </Link>
                    <Link href="/the-loai" className={cx('footer-link')}>
                        Genres
                    </Link>
                    <Link href="/new-movies" className={cx('footer-link')}>
                        New Movies
                    </Link>
                    <Link href="/series" className={cx('footer-link')}>
                        TV Series
                    </Link>
                    <Link href="/movies" className={cx('footer-link')}>
                        Movies
                    </Link>
                    <Link href="/animation" className={cx('footer-link')}>
                        Animation
                    </Link>
                    <Link href="/actor" className={cx('footer-link')}>
                        Actor
                    </Link>
                </Box>

                {/* Contact Information */}
                <Box className={cx('footer-contact')}>
                    <Typography variant="h6" className={cx('footer-title')}>
                        Contact
                    </Typography>
                    <Typography className={cx('footer-text')}>Email: support@javaplay.vn</Typography>
                    <Typography className={cx('footer-text')}>Phone: 1900 1234</Typography>
                    <Typography className={cx('footer-text')}>Address: 123 Java Street, District 1, HCMC</Typography>
                </Box>
            </Box>

            {/* Copyright */}
            <Box className={cx('footer-copyright')}>
                <Typography className={cx('footer-text')}>© 2025 JAVA Play. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}

export default Footer;
