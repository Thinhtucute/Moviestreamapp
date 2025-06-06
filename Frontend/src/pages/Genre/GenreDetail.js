import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Pagination, CircularProgress, Container, Button } from '@mui/material';
import { PlayArrow, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

function GenreDetail() {
    const { genreName } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 15;

    // Convert URL format back to original genre name for API
    const getOriginalGenreName = (urlGenre) => {
        const genreMap = {
            'action-and-adventure': 'Action & Adventure',
            action: 'Action',
            adventure: 'Adventure',
            animation: 'Animation',
            comedy: 'Comedy',
            crime: 'Crime',
            documentary: 'Documentary',
            drama: 'Drama',
            family: 'Family',
            fantasy: 'Fantasy',
            history: 'History',
            horror: 'Horror',
            kids: 'Kids',
            music: 'Music',
            mystery: 'Mystery',
            news: 'News',
            reality: 'Reality',
            romance: 'Romance',
            'sci-fi-and-fantasy': 'Sci-Fi & Fantasy',
            'science-fiction': 'Science Fiction',
            soap: 'Soap',
            talk: 'Talk',
            thriller: 'Thriller',
            'tv-movie': 'TV Movie',
            war: 'War',
            'war-and-politics': 'War & Politics',
            western: 'Western',
        };
        return genreMap[urlGenre] || genreMap[urlGenre.toLowerCase()] || urlGenre;
    };

    const originalGenreName = getOriginalGenreName(genreName);
    const displayGenreName = originalGenreName;

    console.log('URL genreName:', genreName);
    console.log('Original genre name for API:', originalGenreName);

    // Reset page and scroll to top when genre changes
    useEffect(() => {
        setCurrentPage(0);
        // Scroll to top immediately when genre changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [genreName]);

    useEffect(() => {
        fetchMoviesByGenre(currentPage);
    }, [genreName, currentPage]);

    const fetchMoviesByGenre = async (page) => {
        try {
            setLoading(true);
            console.log('Fetching movies with genre:', originalGenreName);

            const response = await axios.get(
                `http://localhost:8080/api/media/search?page=${page}&size=${pageSize}&genreName=${encodeURIComponent(
                    originalGenreName,
                )}`,
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
            console.error('Error fetching movies by genre:', error);
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
        window.scrollTo({ top: 200, behavior: 'smooth' }); // 200px để tránh header
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
            {/* Header Section - Fixed positioning to ensure visibility */}
            <Box
                sx={{
                    mb: 6,
                    mx: 8,
                    // Ensure header is always visible
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
                    {displayGenreName}
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
                                                    Xem ngay
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
                                There are currently no movies in the "{displayGenreName}" genre. Try exploring other genres!
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
                                    Return to Home
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/genres')}
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
                                    Xem các thể loại khác
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

export default GenreDetail;
