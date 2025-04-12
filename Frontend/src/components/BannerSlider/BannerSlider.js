// src/components/BannerSlider/BannerSlider.js
import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';
import { PlayArrow, FavoriteBorder, Share } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import classNames from 'classnames/bind';
import styles from './BannerSlider.module.scss';
import { useBanners } from '@/hooks/useBanners';

const cx = classNames.bind(styles);

// Variants cho animation
const sliderVariants = {
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

// Khởi tạo trạng thái ban đầu cho slider
const initialState = {
    currentIndex: 0,
    direction: 0,
    isPlaying: true,
};

// Reducer để xử lý trạng thái slider
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

    // Memoize các hàm xử lý sự kiện để tránh tạo lại
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

    const handleDotClick = useCallback((index) => {
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
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length, state.isPlaying, handleNext]);

    // Xử lý sự kiện kéo thả chuột
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

    // Tính toán dots hiển thị
    const maxDots = 5;
    const visibleDots = Math.min(banners.length, maxDots);
    const dotIndices = Array.from({ length: visibleDots }, (_, i) => i);

    // Log dữ liệu để kiểm tra
    console.log('Giá trị banners trước khi render:', banners);

    // Xử lý trạng thái loading, error, hoặc không có dữ liệu
    if (loading) return <Box>Đang tải...</Box>;
    if (error) return <Box>{error}</Box>;
    if (!banners || banners.length === 0) return <Box>Không có dữ liệu banner</Box>;

    const currentBanner = banners[state.currentIndex];

    return (
        <Box className={cx('banner-slider')}>
            <Box
                ref={sliderRef}
                className={cx('slider-container')}
                sx={{ position: 'relative', overflow: 'hidden', height: '100%', cursor: 'grab' }}
            >
                <AnimatePresence initial={false} custom={state.direction}>
                    <motion.img
                        key={state.currentIndex}
                        src={currentBanner.posterURL || ''}
                        alt={currentBanner.title || 'Banner'}
                        custom={state.direction}
                        variants={sliderVariants}
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

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '160%',
                        height: '90%',
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {currentBanner.title || 'Không có tiêu đề'}
                        </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {currentBanner.releaseYear} •{' '}
                        {currentBanner.duration > 0 ? `${currentBanner.duration} phút` : 'Không xác định'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
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
                            Xem ngay
                        </Button>
                        <Button
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                minWidth: '48px',
                                height: '48px',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                            }}
                        >
                            <FavoriteBorder fontSize="large" />
                        </Button>
                        <Button
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                minWidth: '48px',
                                height: '48px',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                            }}
                        >
                            <Share fontSize="large" />
                        </Button>
                    </Box>
                </Box>

                <Box
                    onClick={handlePrev}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <ArrowBackIosIcon sx={{ fontSize: '40px', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                </Box>
                <Box
                    onClick={handleNext}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <ArrowForwardIosIcon sx={{ fontSize: '40px', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '20px',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    {dotIndices.map((index) => (
                        <Box
                            key={index}
                            onClick={() => handleDotClick(index)}
                            sx={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor:
                                    state.currentIndex === index ? 'var(--primary)' : 'rgba(255, 255, 255, 0.5)',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default BannerSlider;
