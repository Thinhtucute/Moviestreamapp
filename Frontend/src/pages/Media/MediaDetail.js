import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkToken } from '@/redux/features/auth/authSlice';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './MediaDetail.module.scss';
import {
    Box,
    Typography,
    Button,
    Chip,
    Rating,
    CircularProgress,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import {
    PlayArrow,
    Add,
    CalendarToday,
    AccessTime,
    Language,
    ErrorOutline,
    ArrowBack,
    Share,
    Lock,
    Login,
} from '@mui/icons-material';

// Import EpisodesSection component
import EpisodesSection from '@/pages/Media/EpisodesSection';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import useNotification from '@/hooks/useNotification';

const cx = classNames.bind(styles);

function MediaDetail() {
    const { mediaId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state - chỉ khai báo 1 lần
    const { isAuthenticated, loading: authLoading, user } = useSelector((state) => state.auth);

    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const { showNotification } = useNotification();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        // Check token when component mounts
        dispatch(checkToken());

        const fetchMediaDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/api/media/${mediaId}`);

                if (response.data && response.data.result) {
                    setMedia(response.data.result);
                } else {
                    throw new Error('Invalid response format');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching media details:', err);
                setError('Failed to load media details. Please try again later.');
                setLoading(false);
            }
        };

        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchMediaDetails();
    }, [mediaId, dispatch, apiUrl]); // ← Chỉ 1 closing bracket

    // Check if the current media is in favorites
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!isAuthenticated || !mediaId) return;

            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`${apiUrl}/api/favorites/status/${mediaId}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.result !== undefined) {
                    setIsFavorite(response.data.result);
                }
            } catch (err) {
                console.error('Failed to check favorite status:', err);
            }
        };

        checkFavoriteStatus();
    }, [mediaId, isAuthenticated, apiUrl]);

    // Fetch recommendations based on user favorites
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!isAuthenticated) return;

            try {
                setLoadingRecommendations(true);
                // Get auth token from localStorage
                const token = localStorage.getItem('token');

                const response = await axios.get(`${apiUrl}/api/favorites/recommendations`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`, // Add authorization header
                    },
                });

                if (response.data && response.data.result) {
                    setRecommendations(response.data.result);
                }

                // Move the console.log statements inside the try block
                console.log('Authenticated:', isAuthenticated);
                console.log('API response for recommendations:', response.data);
                console.log('Processed recommendations:', response.data.result); // Use response.data.result instead

                setLoadingRecommendations(false);
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
                setLoadingRecommendations(false);

                // Still log authentication status in case of error
                console.log('Authenticated:', isAuthenticated);
                console.log('Failed to get recommendations data');
            }
        };

        fetchRecommendations();
    }, [isAuthenticated, apiUrl]);

    // Function to create YouTube embed URL from trailer link
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0` : null;
    };

    // Enhanced handleWatchNow with authentication check
    const handleWatchNow = () => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }

        // Check media access level
        // if (media.accessLevel === 'PREMIUM' && (!user || user.subscription === 'FREE')) {
        //     // Show premium required dialog
        //     setShowPremiumDialog(true);
        //     return;
        // }

        // User is authenticated and has access - navigate to watch page
        console.log('Navigating to watch page for media:', mediaId);
        // navigate(`/watch/${mediaId}`); // Uncomment when watch page is ready

        // For now, just show success message
        navigate(`/watch/${mediaId}`);
    };

    const handleLoginRedirect = () => {
        setShowLoginDialog(false);
        // Save current page to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
    };

    // Handle toggling favorites
    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            showNotification('Please login to add to favorites', 'warning');
            navigate('/login');
            return;
        }

        try {
            // Get auth token from localStorage
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${apiUrl}/api/favorites/${mediaId}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`, // Add authorization header
                    },
                },
            );

            if (response.data) {
                setIsFavorite(!isFavorite);
                showNotification(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
            }
        } catch (err) {
            console.error('Failed to update favorites:', err);
            showNotification('Failed to update favorites', 'error');
        }
    };

    const handleAddToList = () => {
        if (!isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }

        setIsFavorite(!isFavorite);
        // This is for the secondary Add button - you can implement watchlist functionality here
        console.log('Add to list clicked');
        // Implement add to list functionality
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: media.title,
                text: media.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleGenreClick = (genreName) => {
        const formattedGenre = genreName
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
        navigate(`/genre/${formattedGenre}`);
    };

    // Add this function here
    const handleLoginRequired = () => {
        setShowLoginDialog(true);
    };

    // Login Required Dialog Component
    const LoginRequiredDialog = () => (
        <Dialog
            open={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--black)',
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    borderRadius: '12px',
                    minWidth: '400px',
                },
            }}
        >
            <DialogTitle
                sx={{
                    color: 'white',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                }}
            >
                <Lock sx={{ color: 'var(--primary)' }} />
                Login Required
            </DialogTitle>
            <DialogContent>
                <Alert
                    severity="info"
                    sx={{
                        backgroundColor: 'rgba(255, 165, 0, 0.1)',
                        border: '1px solid rgba(255, 165, 0, 0.3)',
                        color: 'white',
                        mb: 2,
                        '& .MuiAlert-icon': {
                            color: 'var(--primary)',
                        },
                    }}
                >
                    You need to be logged in to watch movies and add them to your list.
                </Alert>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    Please log in to continue watching <strong>{media?.title}</strong>
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    onClick={() => setShowLoginDialog(false)}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Login />}
                    onClick={handleLoginRedirect}
                    sx={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        fontWeight: 'bold',
                        px: 3,
                        '&:hover': {
                            backgroundColor: '#e55b00',
                        },
                    }}
                >
                    Login Now
                </Button>
            </DialogActions>
        </Dialog>
    );

    if (loading || authLoading) {
        return (
            <Box className={cx('loading-container')}>
                <CircularProgress size={60} sx={{ color: 'var(--primary)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Loading media details...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={cx('error-container')}>
                <ErrorOutline sx={{ fontSize: 48, color: 'var(--primary)', mb: 2 }} />
                <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                    Something went wrong
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => window.location.reload()}
                    sx={{
                        backgroundColor: 'var(--primary)',
                        '&:hover': { backgroundColor: '#e55b00' },
                    }}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    if (!media) {
        return (
            <Box className={cx('not-found-container')}>
                <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                    Media Not Found
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                    The requested media item could not be found.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    sx={{
                        color: 'white',
                        borderColor: 'var(--primary)',
                        '&:hover': {
                            borderColor: '#e55b00',
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                        },
                    }}
                >
                    Back to Home
                </Button>
            </Box>
        );
    }

    const youtubeEmbedUrl = getYouTubeEmbedUrl(media.trailerURL);

    return (
        <Box className={cx('media-detail-container')}>
            {/* Hero section with backdrop */}
            <Box className={cx('backdrop')} style={{ backgroundImage: `url(${media.posterURL})` }}>
                <Box className={cx('backdrop-overlay')}></Box>

                <Box className={cx('hero-content')}>
                    <Box className={cx('poster')}>
                        <img src={media.posterURL} alt={media.title} />

                        {/* Media Type Badge */}
                        <Chip
                            label={media.mediaType?.toUpperCase() || 'MEDIA'}
                            sx={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                backgroundColor:
                                    media.mediaType === 'Movie'
                                        ? '#2563eb'
                                        : media.mediaType === 'Series'
                                        ? '#7c3aed'
                                        : '#ec4899',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                            }}
                        />
                    </Box>

                    <Box className={cx('info')}>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                color: 'white',
                                mb: 2,
                            }}
                        >
                            {media.title}
                        </Typography>

                        {/* Rating */}
                        {media.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating
                                    value={media.rating / 2}
                                    precision={0.1}
                                    readOnly
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#ffd700',
                                        },
                                        mr: 1,
                                    }}
                                />
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {media.rating.toFixed(1)} / 10
                                </Typography>
                            </Box>
                        )}

                        {/* Meta Information */}
                        <Box sx={{ display: 'flex', gap: '10px', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <CalendarToday fontSize="medium" sx={{ color: 'var(--primary)' }} />
                                <Typography variant="h5" sx={{ color: 'var(--white)' }}>
                                    {media.releaseYear}
                                </Typography>
                            </Box>

                            {/* Hiển thị Duration cho Movie hoặc Total Episodes cho Series */}
                            {media.mediaType === 'Movie' && media.duration ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <AccessTime fontSize="medium" sx={{ color: 'var(--primary)' }} />
                                    <Typography variant="h5" sx={{ color: 'var(--white)' }}>
                                        {media.duration} min
                                    </Typography>
                                </Box>
                            ) : media.mediaType === 'Series' && media.episodes ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <AccessTime fontSize="medium" sx={{ color: 'var(--primary)' }} />
                                    <Typography variant="h5" sx={{ color: 'var(--white)' }}>
                                        {media.episodes.length} episodes
                                    </Typography>
                                </Box>
                            ) : null}

                            {media.language && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Language fontSize="medium" sx={{ color: 'var(--primary)' }} />
                                    <Typography variant="h5" sx={{ color: 'var(--white)' }}>
                                        {media.language.toUpperCase()}
                                    </Typography>
                                </Box>
                            )}

                            {media.ageRating && (
                                <Chip
                                    label={media.ageRating}
                                    sx={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                    }}
                                />
                            )}
                        </Box>

                        {/* Description */}
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'var(--white)',
                                width: { xs: '100%', md: '70%' },
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                mb: 3,
                                lineHeight: 1.6,
                            }}
                        >
                            {media.description}
                        </Typography>

                        {/* Genres */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 3 }}>
                            {media.genres &&
                                media.genres.map((genre) => (
                                    <Button
                                        key={genre.genreId}
                                        variant="outlined"
                                        onClick={() => handleGenreClick(genre.genreName)}
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

                        {/* Action Buttons - Enhanced with authentication check */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 1, mb: 4 }}>
                            <Button
                                variant="contained"
                                startIcon={isAuthenticated ? <PlayArrow /> : <Lock />}
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
                                {isAuthenticated ? 'Watch Now' : 'Login to Watch'}
                            </Button>
                            <Button
                                onClick={handleToggleFavorite}
                                sx={{
                                    color: 'white',
                                    backgroundColor: isFavorite ? 'rgba(255, 165, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    minWidth: '48px',
                                    height: '48px',
                                    '&:hover': {
                                        backgroundColor: isFavorite
                                            ? 'rgba(255, 165, 0, 0.4)'
                                            : 'rgba(255, 255, 255, 0.3)',
                                    },
                                }}
                            >
                                {isFavorite ? <Favorite fontSize="large" /> : <FavoriteBorder fontSize="large" />}
                            </Button>
                            <Button
                                onClick={handleAddToList}
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    minWidth: '48px',
                                    height: '48px',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                                }}
                            >
                                <Add fontSize="large" />
                            </Button>
                        </Box>

                        {/* Authentication Status Indicator */}
                        {!isAuthenticated && (
                            <Alert
                                severity="info"
                                sx={{
                                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                    border: '1px solid rgba(255, 165, 0, 0.3)',
                                    width: '36%',
                                    color: 'white',
                                    mb: 3,
                                    '& .MuiAlert-icon': {
                                        color: 'var(--primary)',
                                    },
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                Please{' '}
                                <Button
                                    variant="text"
                                    onClick={() => setShowLoginDialog(true)}
                                    sx={{
                                        color: 'var(--primary)',
                                        textDecoration: 'underline',
                                        p: 0,
                                        minWidth: 'auto',
                                    }}
                                >
                                    login
                                </Button>{' '}
                                to watch this content and add it to your list.
                            </Alert>
                        )}

                        {/* Additional Info */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {media.country && (
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Country
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {media.country}
                                    </Typography>
                                </Box>
                            )}

                            {media.accessLevel && (
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Access Level
                                    </Typography>
                                    <Chip
                                        label={media.accessLevel}
                                        size="small"
                                        sx={{
                                            backgroundColor: media.accessLevel === 'FREE' ? '#4caf50' : '#ff9800',
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Login Required Dialog */}
            <LoginRequiredDialog />

            {/* Recommendations section */}
            {isAuthenticated && (
                <Container maxWidth={false} className={cx('recommendations-section')}>
                    <Typography variant="h4" component="h2" className={cx('section-title')}>
                        Recommended For You
                    </Typography>

                    {loadingRecommendations ? (
                        <Box className={cx('recommendations-loading')}>
                            <Box className={cx('loading-content')}>
                                <CircularProgress
                                    size={50}
                                    sx={{
                                        color: 'var(--primary)',
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round',
                                        },
                                    }}
                                />
                                <Typography variant="body1" className={cx('loading-text')}>
                                    Finding perfect recommendations for you...
                                </Typography>
                            </Box>
                        </Box>
                    ) : recommendations.length > 0 ? (
                        <Box className={cx('recommendations-grid')}>
                            {recommendations.slice(0, 6).map((item) => (
                                <Box
                                    key={item.mediaId}
                                    className={cx('recommendation-card')}
                                    onClick={() => navigate(`/media/${item.mediaId}`)}
                                >
                                    <Box className={cx('movie-image')}>
                                        <img
                                            src={
                                                item.posterURL ||
                                                'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image'
                                            }
                                            alt={item.title}
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image';
                                            }}
                                        />
                                    </Box>
                                    <Box className={cx('movie-info')}>
                                        <Typography variant="subtitle1" component="h4">
                                            {item.title}
                                        </Typography>
                                        {item.releaseYear && (
                                            <Typography variant="body2" className={cx('year')}>
                                                {item.releaseYear}
                                            </Typography>
                                        )}
                                        {item.rating && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    mt: 0.5,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#ffd700',
                                                        fontSize: 'calc(var(--current-font-size) * 0.75)',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    ⭐ {item.rating.toFixed(1)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box className={cx('recommendations-empty')}>
                            <Box className={cx('empty-icon')}>🎬</Box>
                            <Typography variant="h6" className={cx('empty-title')}>
                                No Recommendations Yet
                            </Typography>
                            <Typography variant="body2" className={cx('empty-description')}>
                                Add some movies to your favorites to get personalized recommendations!
                            </Typography>
                        </Box>
                    )}

                    {/* View More Button */}
                    {recommendations.length > 6 && (
                        <Box
                            sx={{
                                textAlign: 'center',
                                mt: 4,
                                pt: 3,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/recommendations')}
                                sx={{
                                    color: 'white',
                                    borderColor: 'var(--primary)',
                                    borderWidth: '2px',
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: 'calc(var(--current-font-size) * 0.9)',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    background:
                                        'linear-gradient(45deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
                                    '&:hover': {
                                        borderColor: '#e55b00',
                                        backgroundColor: 'rgba(255, 165, 0, 0.15)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(255, 165, 0, 0.3)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                View All Recommendations
                            </Button>
                        </Box>
                    )}
                </Container>
            )}

            {/* Trailer section */}
            {youtubeEmbedUrl && (
                <Container maxWidth={false} className={cx('trailer-section')}>
                    <Typography variant="h4" component="h2" className={cx('section-title')}>
                        Trailer
                    </Typography>
                    <Box className={cx('trailer-container')}>
                        <iframe
                            src={youtubeEmbedUrl}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </Box>
                </Container>
            )}

            {/* Cast section */}
            {media.actors && media.actors.length > 0 && (
                <Container maxWidth={false} className={cx('cast-section')}>
                    <Typography variant="h4" component="h2" className={cx('section-title')}>
                        Cast
                    </Typography>
                    <Box className={cx('cast-grid')}>
                        {media.actors.slice(0, 12).map((actor) => (
                            <Box key={actor.actorId} className={cx('cast-card')}>
                                <Box className={cx('actor-image')}>
                                    <img
                                        src={
                                            actor.profileImageURL ||
                                            'https://via.placeholder.com/150x200/333/fff?text=No+Image'
                                        }
                                        alt={actor.actorName}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150x200/333/fff?text=No+Image';
                                        }}
                                    />
                                </Box>
                                <Box className={cx('actor-info')}>
                                    <Typography
                                        variant="subtitle1"
                                        component="h4"
                                        sx={{ color: 'white', fontWeight: 'bold' }}
                                    >
                                        {actor.actorName}
                                    </Typography>
                                    {actor.character && (
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {actor.character}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Container>
            )}

            {media.directors && media.directors.length > 0 && (
                <Container maxWidth={false} className={cx('directors-section')}>
                    <Typography variant="h4" component="h2" className={cx('section-title')}>
                        Director{media.directors.length > 1 ? 's' : ''}
                    </Typography>
                    <Box className={cx('directors-grid')}>
                        {media.directors.map((director) => (
                            <Box key={director.directorId} className={cx('director-card')}>
                                <Typography variant="h6" component="h4" sx={{ color: 'white' }}>
                                    {director.directorName}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            )}

            {/* Episodes section for Series - sử dụng component riêng */}
            {media.mediaType === 'Series' && media.episodes && media.episodes.length > 0 && (
                <EpisodesSection
                    episodes={media.episodes}
                    mediaId={mediaId}
                    isAuthenticated={isAuthenticated}
                    onLoginRequired={handleLoginRequired}
                    maxEpisodesToShow={12}
                />
            )}
        </Box>
    );
}

export default MediaDetail;
