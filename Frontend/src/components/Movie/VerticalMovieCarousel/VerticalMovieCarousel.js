import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { color } from 'framer-motion';
function VerticalMovieCarousel({ movies = [], size = 'large', orientation = 'portrait', title = '' }) {

    const scrollRef = React.useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    const navigate = useNavigate();

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
            const posterWidth = scrollRef.current.firstChild?.offsetWidth || 300;
            scrollRef.current.scrollBy({ left: -posterWidth * 4, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    const scrollRightHandler = () => {
        if (scrollRef.current) {
            const posterWidth = scrollRef.current.firstChild?.offsetWidth || 300;
            scrollRef.current.scrollBy({ left: posterWidth * 4, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 300);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollRef.current) return;
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

    // Styles
    const styles = {
        movieSlider: {   
            margin: 'var(--margin-left-right)',
        },
        sliderContainer: {
            position: 'relative',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
        },
        movieList: {
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
        },
        movieItem: {
            flex: '0 0 auto',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
            width: orientation === 'landscape' ? '300px' : '200px',
            height: orientation === 'landscape' ? '169px' : '300px',
        },
        movieInfo: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
            padding: '10px',
            color: 'white',
            minHeight: '60px', // Đảm bảo đủ chiều cao
        },
        navButton: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            cursor: 'pointer',
            zIndex: 1,
        },
    };

    return (
        <Box sx={styles.movieSlider}>
            {title && (
                <Typography fontWeight={'bold'} variant="body" color='white' fontSize={24}>
                    {title}
                </Typography>
            )}

            <Box sx={styles.sliderContainer}>
                {canScrollLeft && (
                    <Box onClick={scrollLeftHandler} sx={{ ...styles.navButton, left: '10px' }}>
                        <ArrowBackIosIcon sx={{ fontSize: '40px', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                    </Box>
                )}

                <Box
                    ref={scrollRef}
                    sx={styles.movieList}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                >
                    {movies.map((movie, index) => (
                        <Box key={index} sx={styles.movieItem}>
                            <img
                                src={movie.image}
                                alt={movie.title}
                                onDragStart={(e) => e.preventDefault()}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                 onClick={() => navigate(`/media/${movie.mediaId}`)} // Sửa ở đây
                            />
                            <Box sx={styles.movieInfo}>
                                <Typography
                                    variant={size === 'large' ? 'body2' : 'body1'}
                                    sx={{
                                        color: 'var(--primary)',
                                        lineHeight: '1.5',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        padding: '10px',
                                    }}
                                >
                                    {movie.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {canScrollRight && (
                    <Box onClick={scrollRightHandler} sx={{ ...styles.navButton, right: '10px' }}>
                        <ArrowForwardIosIcon sx={{ fontSize: '40px', opacity: 0.7, '&:hover': { opacity: 1 } }} />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default VerticalMovieCarousel;


