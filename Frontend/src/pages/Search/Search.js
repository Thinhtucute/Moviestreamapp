import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Pagination, CircularProgress, Container, Button, Chip } from '@mui/material';
import { PlayArrow, Star, Clear } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 15;

    // Get search params from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        if (query) {
            setSearchQuery(query);
            setCurrentPage(0);
            performSearch(query, 0);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.search]);

    const performSearch = async (query, page) => {
        if (!query) return;

        try {
            setLoading(true);
            console.log('Searching for:', query);

            const response = await axios.get(
                `http://localhost:8080/api/media/search?page=${page}&size=${pageSize}&title=${encodeURIComponent(
                    query,
                )}`,
            );

            console.log('Search Response:', response.data);

            if (response.data && response.data.result && response.data.result.content) {
                setSearchResults(response.data.result.content || []);
                setTotalPages(response.data.result.totalPages || 0);
                setTotalElements(response.data.result.totalElements || 0);
            } else {
                setSearchResults([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (error) {
            console.error('Error searching:', error);
            setSearchResults([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
        performSearch(searchQuery, value - 1);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    const handleMovieClick = (mediaId) => {
        navigate(`/media/${mediaId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearSearch = () => {
        navigate('/');
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
                    Search Results
                </Typography>

                {/* Search Query Display */}
                {searchQuery && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: 'var(--current-font-size)',
                            }}
                        >
                            Search for:
                        </Typography>
                        <Chip
                            label={`"${searchQuery}"`}
                            onDelete={clearSearch}
                            deleteIcon={<Clear sx={{ color: 'white !important' }} />}
                            sx={{
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                fontSize: 'var(--current-font-size)',
                                '& .MuiChip-deleteIcon': {
                                    color: 'white',
                                },
                            }}
                        />
                    </Box>
                )}

            </Box>
            {/* Loading State */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : (
                <>
                    {/* Search Results Grid */}
                    {searchResults.length > 0 ? (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <div className="movie-grid">
                                {searchResults.map((item, index) => (
                                    <motion.div variants={itemVariants} key={item.mediaId || index}>
                                        <div className="movie-card" onClick={() => handleMovieClick(item.mediaId)}>
                                            {/* Movie Image */}
                                            <img
                                                src={item.posterURL || '/placeholder-movie.jpg'}
                                                alt={item.title}
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

                                            {/* Media Type Badge */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    background:
                                                        item.mediaType === 'Movie'
                                                            ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                                                            : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '8px',
                                                    fontSize: 'var(--current-badge-font)',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                                }}
                                            >
                                                {item.mediaType?.toUpperCase() || 'MEDIA'}
                                            </Box>

                                            {/* Movie Info Overlay */}
                                            <div className="movie-info-overlay">
                                                {/* Movie Title */}
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: 'var(--current-font-size)',
                                                        lineHeight: 1.2,
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        mb: 1,
                                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>

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
                                                    {item.releaseYear && (
                                                        <div className="movie-badge">
                                                            <span className="movie-badge-text">{item.releaseYear}</span>
                                                        </div>
                                                    )}

                                                    {/* Duration/Episodes Badge */}
                                                    {item.mediaType === 'Movie' && item.duration && (
                                                        <div
                                                            className="movie-badge"
                                                            style={{
                                                                background:
                                                                    'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(245, 158, 11, 0.6))',
                                                            }}
                                                        >
                                                            <span className="movie-badge-text">
                                                                {item.duration} min
                                                            </span>
                                                        </div>
                                                    )}

                                                    {item.mediaType === 'Series' && item.totalEpisodes && (
                                                        <div
                                                            className="movie-badge"
                                                            style={{
                                                                background:
                                                                    'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(245, 158, 11, 0.6))',
                                                            }}
                                                        >
                                                            <span className="movie-badge-text">
                                                                {item.totalEpisodes} eps
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Rating Badge */}
                                                    {item.rating && (
                                                        <div
                                                            className="movie-badge"
                                                            style={{
                                                                background:
                                                                    'linear-gradient(135deg, var(--primary), #e55b00)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '2px',
                                                                border: '1px solid rgba(255, 165, 0, 0.3)',
                                                                boxShadow: '0 2px 8px rgba(255, 165, 0, 0.2)',
                                                            }}
                                                        >
                                                            <Star
                                                                sx={{
                                                                    fontSize: 'var(--current-badge-font)',
                                                                    color: '#ffd700',
                                                                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))',
                                                                }}
                                                            />
                                                            <span className="movie-badge-text">
                                                                {item.rating.toFixed(1)}
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
                    ) : searchQuery && !loading ? (
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
                                alt="No results"
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
                                No results found
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
                                Sorry, we couldn't find any results for "{searchQuery}". Try searching with different
                                keywords.
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
                                    onClick={() => navigate('/movies')}
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
                                    Browse Movies
                                </Button>
                            </Box>
                        </Box>
                    ) : null}

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

export default Search;
