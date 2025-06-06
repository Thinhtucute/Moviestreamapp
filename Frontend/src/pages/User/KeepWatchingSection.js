import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    LinearProgress,
    IconButton,
    Button,
    Card,
    CardContent,
    Avatar,
    Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';

function KeepWatchingSection() {
    const [watchHistory, setWatchHistory] = useState([]);
    const navigate = useNavigate();

    // Mock data - replace with actual API call
    useEffect(() => {
        setWatchHistory([
            {
                mediaId: 1,
                title: 'The Dark Knight',
                posterURL: '/placeholder-movie.jpg',
                progress: 65,
                lastWatched: '2024-01-15',
                duration: 152,
                watchedTime: 99,
            },
            {
                mediaId: 2,
                title: 'Breaking Bad',
                posterURL: '/placeholder-movie.jpg',
                progress: 30,
                lastWatched: '2024-01-14',
                episode: 'S01E03',
                watchedTime: 15,
            },
        ]);
    }, []);

    const handleContinueWatching = (mediaId) => {
        navigate(`/media/${mediaId}`);
    };

    const handleRemoveFromHistory = (mediaId) => {
        setWatchHistory((prev) => prev.filter((item) => item.mediaId !== mediaId));
    };

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
                    <VisibilityIcon sx={{ color: '#ff9800', fontSize: '2rem' }} />
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            margin: 0,
                        }}
                    >
                        Keep Watching
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    Continue where you left off
                </Typography>
            </Box>

            {watchHistory.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        padding: '60px 20px',
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: '4rem', color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            marginBottom: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        No viewing history
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        Start watching something to see your progress here
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {watchHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={6} lg={4} key={item.mediaId}>
                            <Card
                                sx={{
                                    background:
                                        'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                                    border: '1px solid rgba(255, 165, 0, 0.2)',
                                    borderRadius: 1.5,
                                    padding: 2.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                                        borderColor: '#ff9800',
                                    },
                                }}
                            >
                                <CardContent sx={{ padding: 0 }}>
                                    {/* Card Header */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            alignItems: 'flex-start',
                                            marginBottom: 2,
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            src={item.posterURL}
                                            sx={{
                                                width: 60,
                                                height: 90,
                                                border: '1px solid rgba(255, 165, 0, 0.3)',
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    marginBottom: 0.5,
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                            {item.episode && (
                                                <Chip
                                                    label={item.episode}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(255, 165, 0, 0.2)',
                                                        color: '#ff9800',
                                                        fontWeight: 'bold',
                                                        marginBottom: 0.5,
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    fontSize: '0.85rem',
                                                }}
                                            >
                                                Last watched: {new Date(item.lastWatched).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleRemoveFromHistory(item.mediaId)}
                                            size="small"
                                            sx={{
                                                color: 'rgba(244, 67, 54, 0.8)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                                    color: '#f44336',
                                                },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    {/* Progress Section */}
                                    <Box sx={{ marginBottom: 2 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.progress}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#ff9800',
                                                    borderRadius: 3,
                                                },
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                fontSize: '0.8rem',
                                                marginTop: 0.5,
                                                textAlign: 'right',
                                            }}
                                        >
                                            {item.progress}% complete
                                        </Typography>
                                    </Box>

                                    {/* Continue Button */}
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleContinueWatching(item.mediaId)}
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            padding: 1.25,
                                            '&:hover': {
                                                backgroundColor: '#e68900',
                                            },
                                        }}
                                    >
                                        Continue Watching
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default KeepWatchingSection;
