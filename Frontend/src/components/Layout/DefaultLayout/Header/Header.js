import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '@/components/Layout/DefaultLayout/Header/Header.module.scss';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Box,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
    Popper,
    Paper,
    MenuList,
    MenuItem as MuiMenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';

const cx = classNames.bind(styles);

const settings = [
    { text: 'Favorite', icon: <FavoriteBorderIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
    { text: 'Keep watching', icon: <VisibilityIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
    { text: 'Profile', icon: <PersonOutlineIcon sx={{ fontSize: '20px', color: 'var(--white)' }} /> },
    { text: 'Logout', icon: <ExitToAppIcon sx={{ fontSize: '20px', color: 'var(--primary)' }} /> },
];

const genres = [
    'Action & Adventure',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Kids',
    'Music',
    'Mystery',
    'News',
    'Reality',
    'Romance',
    'Sci-Fi & Fantasy',
    'Science Fiction',
    'Soap',
    'Talk',
    'Thriller',
    'TV Movie',
    'War',
    'War & Politics',
    'Western',
];

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, loading, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [genreMenuOpen, setGenreMenuOpen] = useState(false);
    const [genreAnchorEl, setGenreAnchorEl] = useState(null);

    // Search states
    const [searchValue, setSearchValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { text: 'Genres', path: '/the-loai', hasDropdown: true },
        { text: 'New Movies', path: '/new-movies' },
        { text: 'TV Series', path: '/series' },
        { text: 'Movies', path: '/movies' },
        { text: 'Animation', path: '/animation' },
        { text: 'Directors', path: '/daodien' },
    ];

    // Search functionality
    const fetchSearchSuggestions = async (query) => {
        if (!query || query.length < 2) {
            setSearchOptions([]);
            return;
        }

        try {
            setSearchLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/media/search?page=0&size=5&title=${encodeURIComponent(query)}`,
            );

            if (response.data && response.data.result && response.data.result.content) {
                const suggestions = response.data.result.content.map((item) => ({
                    label: item.title,
                    value: item.title,
                    mediaId: item.mediaId,
                    mediaType: item.mediaType,
                    posterURL: item.posterURL,
                    releaseYear: item.releaseYear,
                }));
                setSearchOptions(suggestions);
            } else {
                setSearchOptions([]);
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            setSearchOptions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearchInputChange = (event, newValue, reason) => {
        if (reason === 'input') {
            setSearchValue(newValue);
            fetchSearchSuggestions(newValue);
        }
    };

    const handleSearchSelect = (event, value) => {
        if (value) {
            if (typeof value === 'string') {
                // User typed something and pressed enter
                navigate(`/search?q=${encodeURIComponent(value)}`);
            } else if (value.mediaId) {
                // User selected a suggestion - go directly to media page
                navigate(`/media/${value.mediaId}`);
            }
            setSearchValue('');
            setSearchOptions([]);
        }
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter' && searchValue.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
            setSearchValue('');
            setSearchOptions([]);
        }
    };

    // Existing handlers...
    const handleGenreMouseEnter = (event) => {
        setGenreAnchorEl(event.currentTarget);
        setGenreMenuOpen(true);
    };

    const handleGenreMouseLeave = () => {
        setGenreMenuOpen(false);
        setGenreAnchorEl(null);
    };

    const handleGenreClick = (genre) => {
        setGenreMenuOpen(false);
        setGenreAnchorEl(null);

        const formattedGenre = genre
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        navigate(`/genre/${formattedGenre}`);
    };

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
        } else if (setting === 'Favorite') {
            navigate('/user/profile');
        } else if (setting === 'Keep watching') {
            navigate('/user/profile');
        } else if (setting === 'Profile') {
            navigate('/user/profile');
        }
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Button component={Link} to="/">
                            <img src={images.logo} alt="Logo" className={cx('logo')} />
                        </Button>

                        {!isMobile && (
                            <Autocomplete
                                freeSolo
                                options={searchOptions}
                                inputValue={searchValue}
                                onInputChange={handleSearchInputChange}
                                onChange={handleSearchSelect}
                                loading={searchLoading}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                                renderOption={(props, option) => (
                                    <Box
                                        component="li"
                                        {...props}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 1.5,
                                            borderBottom: '1px solid rgba(255, 165, 0, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 165, 0, 0.15)',
                                                borderLeft: '3px solid var(--primary)',
                                            },
                                            '&:last-child': {
                                                borderBottom: 'none',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                border: '1px solid rgba(255, 165, 0, 0.2)',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                            }}
                                        >
                                            <img
                                                src={option.posterURL || '/placeholder-movie.jpg'}
                                                alt={option.label}
                                                style={{
                                                    width: 40,
                                                    height: 60,
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-movie.jpg';
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    right: 2,
                                                    backgroundColor:
                                                        option.mediaType === 'Movie'
                                                            ? 'rgba(37, 99, 235, 0.9)'
                                                            : 'rgba(124, 58, 237, 0.9)',
                                                    color: 'white',
                                                    fontSize: '8px',
                                                    fontWeight: 'bold',
                                                    padding: '1px 4px',
                                                    borderRadius: '3px',
                                                }}
                                            >
                                                {option.mediaType?.charAt(0) || 'M'}
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {option.label}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: 'var(--primary)',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {option.mediaType}
                                                </Box>
                                                <Box component="span" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                    •
                                                </Box>
                                                <Box component="span">{option.releaseYear}</Box>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                sx={{
                                    display: 'inline-block',
                                    width: 300,
                                    '& .MuiInputBase-root': {
                                        bgcolor: 'rgba(49, 51, 61, 0.8)',
                                        color: 'white',
                                        height: 36,
                                        paddingLeft: '8px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 165, 0, 0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 165, 0, 0.4)',
                                            backgroundColor: 'rgba(49, 51, 61, 0.9)',
                                        },
                                        // Chỉ áp dụng viền cam khi searchValue không rỗng
                                        ...(searchValue && {
                                            '&.Mui-focused': {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 165, 0, 0.2)',
                                            },
                                        }),
                                    },
                                    '& .Mui-focused .MuiInputBase-root': {
                                        // Chỉ áp dụng khi searchValue không rỗng
                                        ...(searchValue && {
                                            borderColor: 'var(--primary)',
                                            boxShadow: '0 0 0 2px rgba(255, 165, 0, 0.2)',
                                        }),
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none !important',
                                        },
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none !important',
                                        },
                                        '&:hover fieldset': {
                                            border: 'none !important',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none !important',
                                        },
                                    },
                                    '& .MuiTextField-root': {
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none !important',
                                            },
                                            '&:hover fieldset': {
                                                border: 'none !important',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none !important',
                                            },
                                        },
                                    },
                                    '& input::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        opacity: 1,
                                        fontSize: '12px',
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                        display: 'none',
                                    },
                                    '& .MuiPaper-root': {
                                        backgroundColor: 'var(--black) !important',
                                        border: '1px solid rgba(255, 165, 0, 0.3)',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                                        marginTop: '4px',
                                        maxHeight: '400px',
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '3px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--primary)',
                                            borderRadius: '3px',
                                            '&:hover': {
                                                backgroundColor: '#e55b00',
                                            },
                                        },
                                    },
                                    '& .MuiAutocomplete-paper': {
                                        backgroundColor: 'var(--black) !important',
                                        border: '1px solid rgba(255, 165, 0, 0.3)',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                                        marginTop: '4px',
                                        maxHeight: '400px',
                                    },
                                    '& .MuiAutocomplete-listbox': {
                                        padding: '8px 0',
                                        backgroundColor: 'var(--black)',
                                    },
                                    '& .MuiAutocomplete-loading': {
                                        color: 'var(--primary)',
                                        padding: '16px',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--black)',
                                    },
                                    '& .MuiAutocomplete-noOptions': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        padding: '16px',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        backgroundColor: 'var(--black)',
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search movies, TV shows..."
                                        onKeyPress={handleSearchKeyPress}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            fontSize: '18px',
                                                            transition: 'color 0.2s ease',
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                    />
                                )}
                            />
                        )}
                    </Box>

                    {!isMobile && (
                        <div className={cx('menu-items')}>
                            {menuItems.map((item) => (
                                <Box
                                    key={item.text}
                                    sx={{ position: 'relative' }}
                                    onMouseEnter={item.hasDropdown ? handleGenreMouseEnter : undefined}
                                    onMouseLeave={item.hasDropdown ? handleGenreMouseLeave : undefined}
                                >
                                    <Button
                                        color="inherit"
                                        className={cx('menu-item')}
                                        component={item.hasDropdown ? 'div' : Link}
                                        to={item.hasDropdown ? undefined : item.path}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {item.text}
                                        {item.hasDropdown && (
                                            <KeyboardArrowDownIcon
                                                sx={{
                                                    fontSize: '16px',
                                                    transform: genreMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.2s ease',
                                                }}
                                            />
                                        )}
                                    </Button>
                                </Box>
                            ))}
                        </div>
                    )}

                    <div className={cx('header-actions')}>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : isAuthenticated ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {!isMobile && (
                                    <Button
                                        size="large"
                                        className={cx('buy-package-btn')}
                                        component={Link}
                                        to="/subscription"
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                                transform: 'translateY(-1px)',
                                                transition: 'all 0.2s ease',
                                            },
                                        }}
                                    >
                                        Buy Package
                                    </Button>
                                )}
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
                                {isMobile && (
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="end"
                                        onClick={handleMobileMenuToggle}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ) : (
                            <Button size="large" className={cx('login-btn')} component={Link} to="/login">
                                LOGIN NOW
                            </Button>
                        )}
                    </div>
                </Box>
            </Toolbar>

            <Popper
                open={genreMenuOpen}
                anchorEl={genreAnchorEl}
                placement="bottom-start"
                sx={{ zIndex: 1300 }}
                onMouseEnter={() => setGenreMenuOpen(true)}
                onMouseLeave={handleGenreMouseLeave}
            >
                <Paper
                    sx={{
                        backgroundColor: 'var(--black)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                        mt: 1,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        minWidth: '250px',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--primary)',
                            borderRadius: '3px',
                        },
                    }}
                >
                    <MenuList>
                        {genres.map((genre) => (
                            <MuiMenuItem
                                key={genre}
                                onClick={() => handleGenreClick(genre)}
                                sx={{
                                    color: 'var(--white)',
                                    padding: '12px 20px',
                                    fontSize: '14px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                        color: 'var(--primary)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {genre}
                            </MuiMenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Popper>

            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleMobileMenuToggle}
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--black)',
                        width: '250px',
                    },
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.path}
                            onClick={handleMobileMenuToggle}
                            sx={{
                                color: 'var(--white)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

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
                <MenuItem
                    sx={{
                        backgroundColor: 'var(--black)',
                        justifyContent: 'center',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        pointerEvents: 'none',
                    }}
                >
                    <Typography sx={{ color: 'var(--white)', fontWeight: 'bold' }}>Welcome to my website ! </Typography>
                </MenuItem>

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
                            gap: '10px',
                        }}
                    >
                        {setting.icon}
                        <Typography sx={{ color: 'var(--white)', fontSize: '16px' }}>{setting.text}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </AppBar>
    );
}

export default Header;
