import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Button,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import useNotification from '@/hooks/useNotification';

function FavoriteSection() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiUrl}/api/favorites`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.result) {
                setFavorites(response.data.result);
            }
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
            setError('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (mediaId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${apiUrl}/api/favorites/${mediaId}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setFavorites((prev) => prev.filter((item) => item.mediaId !== mediaId));
            showNotification('Removed from favorites', 'success');
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            showNotification('Failed to remove from favorites', 'error');
        }
    };

    const handleWatchNow = (mediaId) => {
        navigate(`/media/${mediaId}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                }}
            >
                <CircularProgress size={60} sx={{ color: '#ff9800' }} />
                <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
                    Loading your favorites...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert
                severity="error"
                sx={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    color: 'white',
                    '& .MuiAlert-icon': {
                        color: '#f44336',
                    },
                }}
            >
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ color: 'white' }}>
            {/* Section Header */}
            <Box
                sx={{
                    marginBottom: 4,
                    paddingBottom: 2.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginBottom: 1,
                    }}
                >
                    <FavoriteIcon sx={{ color: '#ff9800', fontSize: '2rem' }} />
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            margin: 0,
                        }}
                    >
                        My Favorites
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1rem',
                    }}
                >
                    {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your collection
                </Typography>
            </Box>

            {favorites.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        padding: '60px 20px',
                    }}
                >
                    <FavoriteIcon sx={{ fontSize: '4rem', color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            marginBottom: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        No favorites yet
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: 4,
                        }}
                    >
                        Start adding movies and TV shows to your favorites to see them here
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{
                            backgroundColor: '#ff9800',
                            color: 'white',
                            padding: '12px 30px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#e68900',
                            },
                        }}
                    >
                        Browse Content
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {favorites.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.mediaId}>
                            <Card
                                sx={{
                                    background:
                                        'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                                    border: '1px solid rgba(255, 165, 0, 0.2)',
                                    borderRadius: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                                        borderColor: '#ff9800',
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={item.posterURL || '/placeholder-movie.jpg'}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-movie.jpg';
                                    }}
                                    sx={{
                                        objectFit: 'cover',
                                    }}
                                />
                                <CardContent sx={{ padding: 2 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            marginBottom: 1,
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <Chip
                                            label={item.releaseYear}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                                                color: '#ff9800',
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                        <Chip
                                            label={item.mediaType}
                                            size="small"
                                            sx={{
                                                backgroundColor:
                                                    item.mediaType === 'Movie'
                                                        ? 'rgba(37, 99, 235, 0.2)'
                                                        : 'rgba(124, 58, 237, 0.2)',
                                                color: item.mediaType === 'Movie' ? '#2563eb' : '#7c3aed',
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                        {item.rating && (
                                            <Chip
                                                label={`⭐ ${item.rating.toFixed(1)}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                                                    color: '#ffc107',
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ padding: 2, paddingTop: 0 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleWatchNow(item.mediaId)}
                                        sx={{
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            flex: 1,
                                            '&:hover': {
                                                backgroundColor: '#e68900',
                                            },
                                        }}
                                    >
                                        Watch
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleRemoveFavorite(item.mediaId)}
                                        sx={{
                                            borderColor: '#f44336',
                                            color: '#f44336',
                                            '&:hover': {
                                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                                borderColor: '#f44336',
                                            },
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default FavoriteSection;
