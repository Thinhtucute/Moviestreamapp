// src/components/BannerSlider/BannerSlider.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';
import { PlayArrow, FavoriteBorder, Share } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import classNames from 'classnames/bind';
import styles from './BannerSlider.module.scss';

// Updated banner data to match the content in the images
const banners = [
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        alt: 'Thanh Kiếm Của Thợ Săn Quỷ',
        title: 'Thanh Kiếm Của Thợ Săn Quỷ',
        subTitle: 'Kuin Gentosho',
        description: 'Mới • 2025 • T16 • 1/24 tập • Nhật Bản',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        alt: 'Học Viện Anh Hùng Phần 5',
        title: 'Học Viện Anh Hùng',
        subTitle: 'Phần 5',
        description: '2021 • T13 • 27/27 tập • Nhật Bản',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        alt: 'Học Viện Anh Hùng Phần 5',
        title: 'Học Viện Anh Hùng',
        subTitle: 'Phần 5',
        description: '2021 • T13 • 27/27 tập • Nhật Bản',
    },
    {
        image: 'https://insieutoc.vn/wp-content/uploads/2021/02/poster-ngang.jpg',
        alt: 'Banner 4',
        title: 'Banner 4',
        subTitle: 'Phần 4',
        description: '2020 • T12 • 10/10 tập • Nhật Bản',
    },
    {
        image: 'https://d1j8r0kxyu9tj8.cloudfront.net/images/1566809317niNpzY2khA3tzMg.jpg',
        alt: 'Banner 5',
        title: 'Banner 5',
        subTitle: 'Phần 5',
        description: '2019 • T11 • 15/15 tập • Nhật Bản',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        alt: 'Banner 6',
        title: 'Banner 6',
        subTitle: 'Phần 6',
        description: '2018 • T10 • 20/20 tập • Nhật Bản',
    },
];

const cx = classNames.bind(styles);

// Animation variants for the slider
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

function BannerSlider() {
    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
    const sliderRef = useRef(null);

    // Handle next slide
    const handleNext = () => {
        setCurrentIndex([currentIndex + 1 >= banners.length ? 0 : currentIndex + 1, 1]);
    };

    // Handle previous slide
    const handlePrev = () => {
        setCurrentIndex([currentIndex - 1 < 0 ? banners.length - 1 : currentIndex - 1, -1]);
    };

    // Handle dot click
    const handleDotClick = (index) => {
        setCurrentIndex([index, index > currentIndex ? 1 : -1]);
    };

    // Handle drag end to determine swipe direction
    const handleDragEnd = (event, info) => {
        const threshold = 50; // Minimum drag distance to trigger a slide change
        if (info.offset.x < -threshold) {
            handleNext(); // Swipe left to go to the next slide
        } else if (info.offset.x > threshold) {
            handlePrev(); // Swipe right to go to the previous slide
        }
    };

    // Add auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000); // Change banner every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [currentIndex]);

    // Add swipe functionality to navigate banners without dragging the image
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let startX = 0;
        let isDown = false;

        const onMouseDown = (e) => {
            isDown = true;
            startX = e.pageX;
            e.preventDefault(); // Prevent dragging the image
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

    // Limit the number of dots to 5
    const maxDots = 5;
    const visibleDots = Math.min(banners.length, maxDots);
    const dotIndices = Array.from({ length: visibleDots }, (_, i) => i);

    return (
        <Box className={cx('banner-slider')}>
            {/* Slider Container */}
            <Box
                ref={sliderRef}
                className={cx('slider-container')}
                sx={{ position: 'relative', overflow: 'hidden', height: '100%', cursor: 'grab' }}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex}
                        src={banners[currentIndex].image}
                        alt={banners[currentIndex].alt}
                        custom={direction}
                        variants={sliderVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                        drag="x" // Enable dragging on the x-axis
                        dragConstraints={{ left: 0, right: 0 }} // Constrain drag to prevent moving the image out of bounds
                        onDragEnd={handleDragEnd} // Handle swipe gesture
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'grab', // Show grab cursor for dragging
                        }}
                        whileTap={{ cursor: 'grabbing' }} // Change cursor while dragging
                    />
                </AnimatePresence>

                {/* Overlay for gradient effect at the bottom */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '50%', // Cover the bottom half with a gradient
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                        borderRadius: '8px',
                    }}
                />
              

                {/* Banner Content (Title, Description, Buttons) */}
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
                    {/* Title and Subtitle */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {banners[currentIndex].title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                            {banners[currentIndex].subTitle}
                        </Typography>
                    </Box>

                    {/* Description */}
                    <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {banners[currentIndex].description}
                    </Typography>

                    {/* Action Buttons */}
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

                {/* Navigation Arrows (without circular background) */}
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

                {/* Navigation Dots (limited to 5) */}
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
                                backgroundColor: currentIndex === index ? 'var(--primary)' : 'rgba(255, 255, 255, 0.5)',
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
