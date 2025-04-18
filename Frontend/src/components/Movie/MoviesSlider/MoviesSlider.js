// src/components/MoviesSlider/MoviesSlider.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import classNames from 'classnames/bind';
import styles from './MoviesSlider.module.scss';

const cx = classNames.bind(styles);

// Mock data
const mockData = [
    {
        image: 'https://image.phunuonline.com.vn/fckeditor/upload/2023/20230919/images/tac-gia-thiet-ke-poster-phim-_161695124133.jpg',
        title: 'Mắt Biếc',
        description: '2019 • T13 • Việt Nam',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        title: 'Naruto Shippuden',
        description: '2007 • T13 • 500/500 tập • Nhật Bản',
    },
    {
        image: 'https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2024/1/8/385544047-381849924250089-5746515858023972788-n-1-1704696010134123316828.jpg',
        title: 'Học Viện Anh Hùng Phần 5',
        description: '2021 • T13 • 27/27 tập • Nhật Bản',
    },
    {
        image: 'https://image.phunuonline.com.vn/fckeditor/upload/2023/20230919/images/tac-gia-thiet-ke-poster-phim-_161695124133.jpg',
        title: 'Mắt Biếc',
        description: '2019 • T13 • Việt Nam',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        title: 'Naruto Shippuden',
        description: '2007 • T13 • 500/500 tập • Nhật Bản',
    },
    {
        image: 'https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2024/1/8/385544047-381849924250089-5746515858023972788-n-1-1704696010134123316828.jpg',
        title: 'Học Viện Anh Hùng Phần 5',
        description: '2021 • T13 • 27/27 tập • Nhật Bản',
    },
    {
        image: 'https://image.phunuonline.com.vn/fckeditor/upload/2023/20230919/images/tac-gia-thiet-ke-poster-phim-_161695124133.jpg',
        title: 'Mắt Biếc',
        description: '2019 • T13 • Việt Nam',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        title: 'Naruto Shippuden',
        description: '2007 • T13 • 500/500 tập • Nhật Bản',
    },
    {
        image: 'https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2024/1/8/385544047-381849924250089-5746515858023972788-n-1-1704696010134123316828.jpg',
        title: 'Học Viện Anh Hùng Phần 5',
        description: '2021 • T13 • 27/27 tập • Nhật Bản',
    },
    {
        image: 'https://image.phunuonline.com.vn/fckeditor/upload/2023/20230919/images/tac-gia-thiet-ke-poster-phim-_161695124133.jpg',
        title: 'Mắt Biếc',
        description: '2019 • T13 • Việt Nam',
    },
    {
        image: 'https://trustmedia.com.vn/wp-content/uploads/2023/09/mat-biec-1_1607937967.jpg',
        title: 'Naruto Shippuden',
        description: '2007 • T13 • 500/500 tập • Nhật Bản',
    },
    {
        image: 'https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2024/1/8/385544047-381849924250089-5746515858023972788-n-1-1704696010134123316828.jpg',
        title: 'Học Viện Anh Hùng Phần 5',
        description: '2021 • T13 • 27/27 tập • Nhật Bản',
    },
    // Add more items if needed
];

function MoviesSlider({ movies = mockData, size = 'large', orientation = 'portrait', title = '' }) {
    const scrollRef = React.useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);

    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const checkScrollPosition = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    React.useEffect(() => {
        checkScrollPosition();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkScrollPosition);
        return () => el.removeEventListener('scroll', checkScrollPosition);
    }, []);

    const scrollLeftHandler = () => {
        if (scrollRef.current) {
            const posterWidth = scrollRef.current.firstChild.offsetWidth + 16;
            scrollRef.current.scrollBy({ left: -posterWidth * 4, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    const scrollRightHandler = () => {
        if (scrollRef.current) {
            const posterWidth = scrollRef.current.firstChild.offsetWidth + 16;
            scrollRef.current.scrollBy({ left: posterWidth * 4, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    if (!movies || movies.length === 0) {
        return (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6">Không có phim để hiển thị</Typography>
            </Box>
        );
    }

    return (
        <Box className={cx('movie-slider')} sx={{ position: 'relative', overflow: 'hidden' }}>
                {title && (
                    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                        {title}
                    </Typography>
                )}
            <Box className={cx('slider-container')} sx={{ position: 'relative' }}>
                {canScrollLeft && (
                    <Box
                        onClick={scrollLeftHandler}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '10px',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            cursor: 'pointer',
                            zIndex: 1,
                        }}
                    >
                        <ArrowBackIosIcon sx={{ fontSize: '40px', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                    </Box>
                )}

                <Box
                    ref={scrollRef}
                    className={cx('movie-list', size, { landscape: orientation === 'landscape' })}
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        gap: '16px',
                        padding: '10px 0',
                        position: 'relative',
                        maskImage:
                            'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.8))',
                        WebkitMaskImage:
                            'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.8))',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                >
                    {movies.map((movie, index) => (
                        <Box
                            key={index}
                            className={cx('movie-item', size, { landscape: orientation === 'landscape' })}
                            sx={{
                                flex: '0 0 auto',
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <img
                                src={movie.image}
                                alt={movie.title}
                                onDragStart={(e) => e.preventDefault()}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                                    padding: '10px',
                                    color: 'white',
                                }}
                            >
                                <Typography variant={size === 'large' ? 'h6' : 'body2'} sx={{ fontWeight: 'bold' }}>
                                    {movie.title}
                                </Typography>
                                <Typography
                                    variant={size === 'large' ? 'body2' : 'caption'}
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                >
                                    {movie.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {canScrollRight && (
                    <Box
                        onClick={scrollRightHandler}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            cursor: 'pointer',
                            zIndex: 1,
                        }}
                    >
                        <ArrowForwardIosIcon sx={{ fontSize: '40px', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default MoviesSlider;
