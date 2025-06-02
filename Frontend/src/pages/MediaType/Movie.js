import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Pagination, CircularProgress, Container, Button } from '@mui/material';
import { PlayArrow, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

function Movie() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 15;

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchMovies(0);
    }, []);

    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage]);

    const fetchMovies = async (page) => {
        try {
            setLoading(true);
            console.log('Fetching movies...');

            const response = await axios.get(
                `http://localhost:8080/api/media/search?page=${page}&size=${pageSize}&mediaType=Movie`,
            );

            console.log('API Response:', response.data);

            if (response.data && response.data.result && response.data.result.content) {
                setMovies(response.data.result.content || []);
                setTotalPages(response.data.result.totalPages || 0);
                setTotalElements(response.data.result.totalElements || 0);
            } else {
                console.log('No movies found or unexpected response structure');
                setMovies([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
        // Scroll to top of the grid when changing pages
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    const handleMovieClick = (mediaId) => {
        navigate(`/media/${mediaId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                px: 'var(--current-container-padding)',
                py: 12,
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    mb: 6,
                    mx: 8,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Typography
                    fontWeight={'bold'}
                    variant="h3"
                    color="white"
                    sx={{
                        fontSize: {
                            xs: '1.5rem',
                            sm: '2rem',
                            md: '2.5rem',
                            lg: '3rem',
                        },
                    }}
                >
                    Movies
                </Typography>
            </Box>

            {/* Loading State */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : (
                <>
                    {/* Movies Grid */}
                    {movies.length > 0 ? (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <div className="movie-grid">
                                {movies.map((movie, index) => (
                                    <motion.div variants={itemVariants} key={movie.mediaId || index}>
                                        <div className="movie-card" onClick={() => handleMovieClick(movie.mediaId)}>
                                            {/* Movie Image */}
                                            <img
                                                src={movie.posterURL || '/placeholder-movie.jpg'}
                                                alt={movie.title}
                                                onDragStart={(e) => e.preventDefault()}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-movie.jpg';
                                                }}
                                            />

                                            {/* Movie Type Badge */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '8px',
                                                    fontSize: 'var(--current-badge-font)',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                                }}
                                            >
                                                MOVIE
                                            </Box>

                                            {/* Movie Info Overlay */}
                                            <div className="movie-info-overlay">
                                                {/* Movie Details */}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 'calc(var(--current-grid-gap) / 3)',
                                                        alignItems: 'center',
                                                        marginTop: '4px',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    {/* Release Year Badge */}
                                                    {movie.releaseYear && (
                                                        <div className="movie-badge">
                                                            <span className="movie-badge-text">
                                                                {movie.releaseYear}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Duration Badge */}
                                                    {movie.duration && (
                                                        <div
                                                            className="movie-badge"
                                                            style={{
                                                                background:
                                                                    'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(245, 158, 11, 0.6))',
                                                            }}
                                                        >
                                                            <span className="movie-badge-text">
                                                                {movie.duration} min
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Rating Badge */}
                                                    {movie.rating && (
                                                        <div
                                                            className="movie-badge"
                                                            style={{
                                                                background:
                                                                    'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.6))',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '2px',
                                                            }}
                                                        >
                                                            <Star
                                                                sx={{
                                                                    fontSize: 'var(--current-badge-font)',
                                                                    color: '#ffd700',
                                                                }}
                                                            />
                                                            <span className="movie-badge-text">
                                                                {movie.rating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Box>
                                            </div>

                                            {/* Hover Play Button */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'rgba(0, 0, 0, 0.5)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    '&:hover': { opacity: 1 },
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    startIcon={<PlayArrow />}
                                                    sx={{
                                                        backgroundColor: 'var(--primary)',
                                                        color: 'white',
                                                        fontSize: 'var(--current-font-size)',
                                                        px: 'calc(var(--current-container-padding) / 2)',
                                                        py: 'calc(var(--current-container-padding) / 4)',
                                                        '&:hover': { backgroundColor: '#e55b00' },
                                                        backdropFilter: 'blur(8px)',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                                    }}
                                                >
                                                    Watch Now
                                                </Button>
                                            </Box>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        // Empty State
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '400px',
                                textAlign: 'center',
                                py: 4,
                                px: 'var(--current-container-padding)',
                            }}
                        >
                            <img
                                src="/no-movies.png"
                                alt="No movies"
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                    marginBottom: '16px',
                                    opacity: 0.8,
                                }}
                            />
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'white',
                                    mb: 2,
                                    fontSize: 'calc(var(--current-font-size) * 1.5)',
                                }}
                            >
                                No movies found
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    mb: 3,
                                    maxWidth: '600px',
                                    fontSize: 'var(--current-font-size)',
                                }}
                            >
                                There are currently no movies in the system. Please check back later!
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/')}
                                    sx={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        fontSize: 'var(--current-font-size)',
                                        '&:hover': { backgroundColor: '#e55b00' },
                                    }}
                                >
                                    Back to Home
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/tv-series')}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'var(--primary)',
                                        fontSize: 'var(--current-font-size)',
                                        '&:hover': {
                                            borderColor: '#e55b00',
                                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                        },
                                    }}
                                >
                                    Watch TV Series
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage + 1}
                                onChange={handlePageChange}
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'white',
                                        fontSize: 'var(--current-font-size)',
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                            borderColor: 'var(--primary)',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            '&:hover': { backgroundColor: '#e55b00' },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}

export default Movie;
