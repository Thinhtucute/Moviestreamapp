import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '@/components/Layout/DefaultLayout/Header/Header.module.scss';
import { AppBar, Toolbar, Button, IconButton, Box, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import images from '@/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Autocomplete, InputAdornment } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { logout } from '@/redux/features/auth/authSlice';
import avatar from '@/assets/images/avatar.jpg';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
const cx = classNames.bind(styles);
const options = ['Option 1', 'Option 2'];
 const settings = [
     { text: 'Favorite', icon: <FavoriteBorderIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
     { text: 'Playlist', icon: <LibraryBooksIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
     { text: 'Keep watching', icon: <VisibilityIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
     { text: 'Profile', icon: <PersonOutlineIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
     { text: 'Logout', icon: <ExitToAppIcon sx={{ fontSize: '20px', color: 'var(--primary)' }} /> },
 ];
function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, loading, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuItemClick = async (setting) => {
        handleCloseUserMenu();
        if (setting === 'Logout') {
            try {
                await dispatch(logout(token)).unwrap();
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
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
                                border: '1px solid var(--white)',
                            },
                            '& input::placeholder': {
                                color: 'white',
                                opacity: 1,
                                fontSize: '12px',
                            },
                            '& .MuiAutocomplete-endAdornment': {
                                display: 'none', // Ẩn mũi tên xuống
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
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : isAuthenticated ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Button size="large" className={cx('buy-package-btn')}>
                                Mua gói
                            </Button>
                            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon sx={{ fontSize: '20px' }} />
                                </Badge>
                            </IconButton>
                            <Tooltip>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User" src={avatar} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{
                                    mt: '45px',
                                    '& .MuiPaper-root': {
                                        backgroundColor: 'var(--black)',
                                        borderRadius: '10px',
                                        minWidth: '200px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                                    },
                                }}
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
                                {/* Header with user greeting */}
                                <MenuItem
                                    sx={{
                                        backgroundColor: 'var(--black)',
                                        justifyContent: 'center',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                        pointerEvents: 'none', // Disable clicking on header
                                    }}
                                >
                                    <Typography sx={{ color: 'var(--white)', fontWeight: 'bold' }}>
                                        Chào, thinhnocode
                                    </Typography>
                                </MenuItem>

                                {/* Menu items */}
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting.text}
                                        onClick={() => handleMenuItemClick(setting.text)}
                                        sx={{
                                            backgroundColor: 'var(--black)',
                                            color: 'var(--white)',
                                            padding: '10px 20px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                            display: 'flex',
                                            gap: '10px', // Space between icon and text
                                        }}
                                    >
                                        {setting.icon}
                                        <Typography sx={{ color: 'var(--white)', fontSize: '16px' }}>
                                            {setting.text}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    ) : (
                        <Button size="large" className={cx('login-btn')} component={Link} to="/login">
                            LOGIN NOW
                        </Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
