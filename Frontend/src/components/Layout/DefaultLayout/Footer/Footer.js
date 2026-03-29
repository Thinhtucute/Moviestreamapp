import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Box, Typography, Link } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

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
                        HKTPlay
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <EmailOutlinedIcon sx={{ color: 'var(--primary)', fontSize: 18 }} />
                        <Typography className={cx('footer-text')}>info@dmfpt.gg</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <LocalPhoneOutlinedIcon sx={{ color: 'var(--primary)', fontSize: 18 }} />
                        <Typography className={cx('footer-text')}>1900 480p</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnOutlinedIcon sx={{ color: 'var(--primary)', fontSize: 18, mt: '2px' }} />
                        <Typography className={cx('footer-text')}>
                            Tầng 36, tòa nhà HKT Tower, số 18 Yên Lãng, Hà Nội
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Copyright */}
            <Box className={cx('footer-copyright')}>
                <Typography className={cx('footer-text')}>© 2026 HKTPlay. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}

export default Footer;
