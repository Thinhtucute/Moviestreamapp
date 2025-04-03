import classNames from 'classnames/bind'; // Sửa "classnames" thành "classnames/bind"
import styles from '@/components/Layout/DefaultLayout/Header/Header.module.scss';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import images from '@/assets/images';

const cx = classNames.bind(styles);

function Header() {
    return (
        <AppBar position="static" className={cx('header')} sx={{ backgroundColor: 'var(--black)', boxShadow: 'none' }}>
            <Toolbar className={cx('header-toolbar')}>
                <img src={images.logo} alt="Logo" className={cx('logo')} />

                {/* Menu chính */}
                <div className={cx('menu-items')}>
                    <Button color="inherit" className={cx('menu-item')}>
                        Trang chủ
                    </Button>
                    <Button color="inherit" className={cx('menu-item')}>
                        Phim mới
                    </Button>
                    <Button color="inherit" className={cx('menu-item')}>
                        Phim bộ
                    </Button>
                    <Button color="inherit" className={cx('menu-item')}>
                        Phim lẻ
                    </Button>
                    <Button color="inherit" className={cx('menu-item')}>
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
                    <Button color="inherit" className={cx('login-btn')}>
                        Đăng nhập
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
