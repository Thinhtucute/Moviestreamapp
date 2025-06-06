import React, { useReducer, useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';
import { PlayArrow, FavoriteBorder, Favorite, Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './BannerSlider.module.scss';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GenreCategory from '@/components/Movie/GenreCategory';
import useNotification from '@/hooks/useNotification';

const cx = classNames.bind(styles);

// Variants for the poster (slide in from the right)
const posterVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

// Variants for the info box (slide in from the left)
const infoVariants = {
    enter: (direction) => ({
        x: direction > 0 ? -500 : 500,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? -500 : 500,
        opacity: 0,
    }),
};

// Initial state for the slider
const initialState = {
    currentIndex: 0,
    direction: 0,
    isPlaying: true,
};

// Reducer to handle slider state
const sliderReducer = (state, action) => {
    switch (action.type) {
        case 'NEXT':
            return {
                ...state,
                currentIndex: state.currentIndex + 1 >= action.payload ? 0 : state.currentIndex + 1,
                direction: 1,
            };
        case 'PREV':
            return {
                ...state,
                currentIndex: state.currentIndex - 1 < 0 ? action.payload - 1 : state.currentIndex - 1,
                direction: -1,
            };
        case 'SET_INDEX':
            return {
                ...state,
                currentIndex: action.payload,
                direction: action.payload > state.currentIndex ? 1 : -1,
            };
        case 'TOGGLE_PLAY':
            return { ...state, isPlaying: !state.isPlaying };
        default:
            return state;
    }
};

function BannerSlider() {
    const [state, dispatch] = useReducer(sliderReducer, initialState);
    const { banners, loading, error } = useBanners();
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    // Redux state - thêm loading check
    const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
    const { showNotification } = useNotification();

    // State cho favorites
    const [favorites, setFavorites] = useState(new Set());
    const [loadingFavorites, setLoadingFavorites] = useState({});
    const [authInitialized, setAuthInitialized] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // Wait for auth to be initialized
    useEffect(() => {
        // Đợi auth loading complete (bao gồm cả verify token)
        if (!authLoading) {
            setAuthInitialized(true);
        }
    }, [authLoading]);

    // Fetch favorite status - chỉ chạy khi auth đã initialized
    useEffect(() => {
        const fetchFavoriteStatuses = async () => {
            // Kiểm tra auth đã initialized và user đã authenticated
            if (!authInitialized || !isAuthenticated || !banners.length) {
                return;
            }

            try {
                const token = localStorage.getItem('token');

                // Double check token exists
                if (!token) {
                    console.warn('No token found, skipping favorites fetch');
                    return;
                }

                const favoritePromises = banners.map(async (banner) => {
                    try {
                        const response = await axios.get(`${apiUrl}/api/favorites/status/${banner.mediaId}`, {
                            withCredentials: true,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        return { mediaId: banner.mediaId, isFavorite: response.data.result };
                    } catch (error) {
                        console.error(`Failed to check favorite status for ${banner.mediaId}:`, error);
                        return { mediaId: banner.mediaId, isFavorite: false };
                    }
                });

                const favoriteResults = await Promise.all(favoritePromises);
                const newFavorites = new Set();

                favoriteResults.forEach(({ mediaId, isFavorite }) => {
                    if (isFavorite) {
                        newFavorites.add(mediaId);
                    }
                });

                setFavorites(newFavorites);
            } catch (error) {
                console.error('Failed to fetch favorite statuses:', error);
            }
        };

        fetchFavoriteStatuses();
    }, [authInitialized, isAuthenticated, banners, apiUrl]);

    // Handle toggle favorite - cải thiện error handling
    const handleToggleFavorite = async (mediaId, event) => {
        event?.stopPropagation();

        // Check auth state
        if (!authInitialized) {
            showNotification('Authentication still initializing, please wait...', 'info');
            return;
        }

        if (!isAuthenticated) {
            showNotification('Please login to add to favorites', 'warning');
            navigate('/login');
            return;
        }

        // Double check token
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Authentication error, please login again', 'error');
            navigate('/login');
            return;
        }

        setLoadingFavorites((prev) => ({ ...prev, [mediaId]: true }));

        try {
            const response = await axios.post(
                `${apiUrl}/api/favorites/${mediaId}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                const newFavorites = new Set(favorites);
                const isFavorite = favorites.has(mediaId);

                if (isFavorite) {
                    newFavorites.delete(mediaId);
                    showNotification('Removed from favorites', 'success');
                } else {
                    newFavorites.add(mediaId);
                    showNotification('Added to favorites', 'success');
                }

                setFavorites(newFavorites);
            }
        } catch (error) {
            console.error('Failed to update favorites:', error);

            // Check if it's an auth error
            if (error.response?.status === 401) {
                showNotification('Session expired, please login again', 'error');
                navigate('/login');
            } else {
                showNotification('Failed to update favorites', 'error');
            }
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [mediaId]: false }));
        }
    };

    const handleWatchNow = useCallback(() => {
        const currentBanner = banners[state.currentIndex];
        if (currentBanner && currentBanner.mediaId) {
            navigate(`/media/${currentBanner.mediaId}`);
        }
    }, [banners, state.currentIndex, navigate]);

    const handleNext = useCallback(() => {
        if (banners.length > 0) {
            dispatch({ type: 'NEXT', payload: banners.length });
        }
    }, [banners.length]);

    const handlePrev = useCallback(() => {
        if (banners.length > 0) {
            dispatch({ type: 'PREV', payload: banners.length });
        }
    }, [banners.length]);

    const handleThumbnailClick = useCallback((index) => {
        dispatch({ type: 'SET_INDEX', payload: index });
    }, []);

    const handleDragEnd = useCallback(
        (event, info) => {
            const threshold = 50;
            if (info.offset.x < -threshold) {
                handleNext();
            } else if (info.offset.x > threshold) {
                handlePrev();
            }
        },
        [handleNext, handlePrev],
    );

    // Auto-play slider
    useEffect(() => {
        if (banners.length > 0 && state.isPlaying) {
            const interval = setInterval(() => {
                handleNext();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [banners.length, state.isPlaying, handleNext]);

    // Handle mouse drag events
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let startX = 0;
        let isDown = false;

        const onMouseDown = (e) => {
            isDown = true;
            startX = e.pageX;
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDown) return;
            const walk = e.pageX - startX;
            if (walk > 50) {
                handlePrev();
                isDown = false;
            } else if (walk < -50) {
                handleNext();
                isDown = false;
            }
        };

        const onMouseUp = () => {
            isDown = false;
        };

        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('mousemove', onMouseMove);
        slider.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('mouseleave', onMouseUp);

        return () => {
            slider.removeEventListener('mousedown', onMouseDown);
            slider.removeEventListener('mousemove', onMouseMove);
            slider.removeEventListener('mouseup', onMouseUp);
            slider.removeEventListener('mouseleave', onMouseUp);
        };
    }, [handleNext, handlePrev]);

    // Render logic
    if (loading) return <Box>Đang tải...</Box>;
    if (error) return <Box>{error}</Box>;
    if (!banners || banners.length === 0) return <Box>Không có dữ liệu banner</Box>;

    const currentBanner = banners[state.currentIndex];
    const isCurrentFavorite = favorites.has(currentBanner?.mediaId);
    const isCurrentLoading = loadingFavorites[currentBanner?.mediaId];

    return (
        <Box className={cx('banner-slider')}>
            {/* Show loading indicator if auth is still initializing */}
            {!authInitialized && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1000,
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: 1,
                        padding: '4px 8px',
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'white' }}>
                        Loading...
                    </Typography>
                </Box>
            )}

            <Box
                ref={sliderRef}
                className={cx('slider-container')}
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: { xs: '100%' },
                    cursor: 'grab',
                    boxShadow: 'inset 0 0 200px 50px #191b24, 0 0 50px #000',
                }}
            >
                <AnimatePresence initial={false} custom={state.direction}>
                    <motion.img
                        key={state.currentIndex}
                        src={currentBanner.posterURL || ''}
                        alt={currentBanner.title || 'Banner'}
                        custom={state.direction}
                        variants={posterVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'grab',
                        }}
                        whileTap={{ cursor: 'grabbing' }}
                    />
                </AnimatePresence>

                {/* Gradient overlay from top to bottom */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', // Adjusted from 160% to 100% for better fit
                        height: '20%',
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)', // Gradient from top to bottom
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '20%',
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '2%',
                        height: '100%',
                        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '2%',
                        height: '100%',
                        background: 'linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent)',
                    }}
                />

                <AnimatePresence initial={false} custom={state.direction}>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '0px',
                            zIndex: 10,
                        }}
                    >
                        <GenreCategory />
                    </Box>
                    <motion.div
                        className={cx('info')}
                        key={state.currentIndex}
                        custom={state.direction}
                        variants={infoVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                        style={{
                            position: 'absolute',
                            left: '40px',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Typography variant="h2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {currentBanner.title || 'No title'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <EventAvailableIcon fontSize="medium" sx={{ color: 'var(--primary)' }} />
                                <Typography variant="h5" sx={{ color: 'var(--white)' }}>
                                    {currentBanner.releaseYear}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <HourglassEmptyIcon fontSize="medium" sx={{ color: 'var(--primary)' }} />
                                <Typography variant="h5" sx={{ color: 'var(--white)' }}>
                                    {currentBanner.duration > 0 ? `${currentBanner.duration} min` : '90 min'}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography
                            variant="h5"
                            sx={{
                                color: 'var(--white)',
                                width: '40%',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {currentBanner.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {currentBanner.genres?.map((genre) => (
                                <Button
                                    key={genre.genreId}
                                    variant="outlined"
                                    color="white"
                                    sx={{
                                        borderColor: 'var(--primary)',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#e55b00',
                                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                        },
                                    }}
                                >
                                    {genre.genreName}
                                </Button>
                            ))}
                        </Box>

                        {/* Updated Action Buttons with Favorite functionality */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 1, mb: 4 }}>
                            <Button
                                variant="contained"
                                startIcon={<PlayArrow />}
                                onClick={handleWatchNow}
                                sx={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    padding: '10px 40px',
                                    '&:hover': { backgroundColor: '#e55b00' },
                                }}
                            >
                                Watch Now
                            </Button>

                            {/* Favorite Button - disable khi auth chưa ready */}
                            <Button
                                onClick={(event) => handleToggleFavorite(currentBanner.mediaId, event)}
                                disabled={isCurrentLoading || !authInitialized}
                                sx={{
                                    color: 'white',
                                    backgroundColor: isCurrentFavorite
                                        ? 'rgba(255, 165, 0, 0.3)'
                                        : 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    minWidth: '48px',
                                    height: '48px',
                                    opacity: isCurrentLoading || !authInitialized ? 0.6 : 1,
                                    '&:hover': {
                                        backgroundColor: isCurrentFavorite
                                            ? 'rgba(255, 165, 0, 0.4)'
                                            : 'rgba(255, 255, 255, 0.3)',
                                    },
                                    '&:disabled': {
                                        color: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {isCurrentLoading ? (
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            '@keyframes spin': {
                                                '0%': { transform: 'rotate(0deg)' },
                                                '100%': { transform: 'rotate(360deg)' },
                                            },
                                        }}
                                    />
                                ) : isCurrentFavorite ? (
                                    <Favorite fontSize="large" />
                                ) : (
                                    <FavoriteBorder fontSize="large" />
                                )}
                            </Button>
                        </Box>
                    </motion.div>
                </AnimatePresence>

                {/* Thumbnails Section với favorite indicators */}
                <Box
                    className={cx('thumbnails')}
                    sx={{
                        position: 'absolute',
                        bottom: '60px',
                        right: '40px',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    {banners.map((banner, index) => (
                        <Box
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            sx={{
                                width: '80px',
                                height: '45px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: state.currentIndex === index ? '2px solid var(--primary)' : 'none',
                                opacity: state.currentIndex === index ? 1 : 0.7,
                                transition: 'opacity 0.3s ease',
                                position: 'relative',
                                '&:hover': {
                                    opacity: 1,
                                },
                            }}
                        >
                            <img
                                src={banner.posterURL || ''}
                                alt={banner.title || 'Thumbnail'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />

                            {/* Favorite indicator on thumbnail */}
                            {favorites.has(banner.mediaId) && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        backgroundColor: 'rgba(255, 165, 0, 0.9)',
                                        borderRadius: '50%',
                                        width: 16,
                                        height: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Favorite sx={{ fontSize: 10, color: 'white' }} />
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default BannerSlider;
