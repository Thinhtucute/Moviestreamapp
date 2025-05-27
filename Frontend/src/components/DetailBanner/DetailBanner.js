import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { PlayArrow, FavoriteBorder, Share } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function DetailBanner({ movie, isVisible, position }) {
    const navigate = useNavigate();

    const handleWatchNow = () => {
        if (movie && movie.mediaId) {
            navigate(`/media/${movie.mediaId}`);
            window.scrollTo(0, 0);
        }
    };

    if (!movie || !isVisible) return null;

    // Adjust position to ensure banner stays within viewport
    const adjustedPosition = {
        x: Math.min(position.x, window.innerWidth - 420), // 420 = banner width + padding
        y: Math.max(position.y - 100, 10), // Ensure it doesn't go off top of screen
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                    position: 'fixed',
                    top: adjustedPosition.y,
                    left: adjustedPosition.x,
                    zIndex: 1000,
                    pointerEvents: 'auto',
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
            >
                <Box
                    sx={{
                        width: '400px',
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(25, 27, 36, 0.95))',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Banner Image */}
                    <Box
                        sx={{
                            position: 'relative',
                            height: '200px',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={movie.image}
                            alt={movie.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        {/* Gradient overlay */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '50%',
                                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                            }}
                        />
                    </Box>

                    {/* Content */}
                    <Box sx={{ padding: '20px', color: 'white' }}>
                        {/* Title */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                background: 'linear-gradient(to right, var(--primary), #f59e0b)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {movie.title}
                        </Typography>

                        {/* Year and Duration */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '15px',
                                marginBottom: '12px',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                <EventAvailableIcon fontSize="small" sx={{ color: 'var(--primary)' }} />
                                <Typography variant="body2" sx={{ color: 'var(--white)' }}>
                                    {movie.releaseYear}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                <HourglassEmptyIcon fontSize="small" sx={{ color: 'var(--primary)' }} />
                                <Typography variant="body2" sx={{ color: 'var(--white)' }}>
                                    {movie.duration} phút
                                </Typography>
                            </Box>
                        </Box>

                        {/* Description */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '15px',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.5,
                            }}
                        >
                            {movie.description || 'Không có mô tả'}
                        </Typography>

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    marginBottom: '15px',
                                }}
                            >
                                {movie.genres.slice(0, 3).map((genre, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            background:
                                                'linear-gradient(135deg, rgba(255, 165, 0, 0.3), rgba(255, 140, 0, 0.2))',
                                            border: '1px solid rgba(255, 165, 0, 0.3)',
                                            borderRadius: '12px',
                                            padding: '4px 8px',
                                            backdropFilter: 'blur(5px)',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'white',
                                                fontSize: '10px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {genre.genreName || genre}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<PlayArrow />}
                                onClick={handleWatchNow}
                                sx={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '12px',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    '&:hover': { backgroundColor: '#e55b00' },
                                }}
                            >
                                Watch Now
                            </Button>
                            <Button
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50%',
                                    minWidth: '36px',
                                    height: '36px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                }}
                            >
                                <FavoriteBorder fontSize="small" />
                            </Button>
                            <Button
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50%',
                                    minWidth: '36px',
                                    height: '36px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                }}
                            >
                                <Share fontSize="small" />
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </AnimatePresence>
    );
}

export default DetailBanner;
