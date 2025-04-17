import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '@/components/Layout/DefaultLayout/Header/Header.module.scss';
import { AppBar, Toolbar, Button, IconButton, Box, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import images from '@/assets/images';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Autocomplete, InputAdornment } from '@mui/material';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';


const cx = classNames.bind(styles);
const options = ['Option 1', 'Option 2'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <Button component={Link} to="/">
                        <img src={images.logo} alt="Logo" className={cx('logo')} />
                    </Button>

                    <Autocomplete
                        id="custom-input-demo"
                        options={options}
                        sx={{
                            display: 'inline-block',
                            width: 300,
                            '& .MuiInputBase-root': {
                                bgcolor: 'rgb(49,51,61,0.6)',
                                color: 'white',
                                height: 36,
                                paddingLeft: '8px',
                                borderRadius: '4px',
                                transition: 'border 0.2s ease-in-out',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid var(--white)', // Viền trắng khi focus
                            },
                            '& input::placeholder': {
                                color: 'white',
                                opacity: 1,
                                fontSize: '12px',
                            },
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'white', fontSize: '18px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        )}
                    />

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
                </Box>

                <div className={cx('header-actions')}>
                    <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon sx={{ fontSize: '20px' }} />
                        </Badge>
                    </IconButton>
                    <Button size="large" className={cx('buy-package-btn')}>
                        Mua gói
                    </Button>
                    {isAuthenticated ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    ) : (
                        <Button size="large" color="inherit" className={cx('login-btn')} component={Link} to="/login">
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
