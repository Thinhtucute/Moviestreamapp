import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '@/components/Layout/DefaultLayout/Header/Header.module.scss';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import images from '@/assets/images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <AppBar
            position="fixed"
            className={cx('header', { transparent: !isScrolled, scrolled: isScrolled })}
            sx={{ boxShadow: 'none' }}
        >
            <Toolbar className={cx('header-toolbar')}>
                <img src={images.logo} alt="Logo" className={cx('logo')} />

                {/* Menu chính */}
                <div className={cx('menu-items')}>
                    <Button color="inherit" className={cx('menu-item')} component={Link} to="/">
                        Trang chủ
                    </Button>
                    <Button color="inherit" className={cx('menu-item')} component={Link} to="/phim-moi">
                        Phim mới
                    </Button>
                    <Button color="inherit" className={cx('menu-item')} component={Link} to="/phim-bo">
                        Phim bộ
                    </Button>
                    <Button color="inherit" className={cx('menu-item')} component={Link} to="/phim-le">
                        Phim lẻ
                    </Button>
                    <Button color="inherit" className={cx('menu-item')} component={Link} to="/anime">
                        Anime
                    </Button>
                </div>
                <div className={cx('header-actions')}>
                    <IconButton color="inherit" className={cx('search-btn')}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton color="inherit" className={cx('notification-btn')}>
                        <NotificationsNoneIcon />
                    </IconButton>
                    <Button className={cx('buy-package-btn')}>Mua gói</Button>
                    <Button color="inherit" className={cx('login-btn')} component={Link} to="/login">
                        Đăng nhập
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
