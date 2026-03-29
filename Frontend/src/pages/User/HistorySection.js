import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
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
import { useSelector } from 'react-redux';
import { getLocalHistory, removeLocalView, clearLocalHistory } from '../../utils/historyLocal';
import { fetchHistoryBackend, removeHistoryItemBackend, clearHistoryBackend } from '../../services/historyServices';
import { getPosterImage, sanitizeMediaList } from '@/utils/mediaImage';

const normalizeMediaType = (mediaType) => {
    const raw = String(mediaType || '').trim().toLowerCase();
    if (raw === 'movie') return 'movie';
    if (raw === 'tv') return 'tv';
    return 'movie';
};

function HistorySection() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((s) => s.auth && s.auth.isAuthenticated);

    // Load history from backend if logged in, otherwise localStorage
    useEffect(() => {
        let mounted = true;
        if (isAuthenticated) {
            fetchHistoryBackend()
                .then((data) => {
                    if (!mounted) return;
                    setHistory(sanitizeMediaList(data));
                })
                .catch(() => {
                    if (!mounted) return;
                    setHistory(getLocalHistory());
                });
        } else {
            setHistory(getLocalHistory());
        }
        return () => {
            mounted = false;
        };
    }, [isAuthenticated]);

    // Remove item from history
    const handleRemoveFromHistory = async (mediaId, mediaType) => {
        if (isAuthenticated) {
            try {
                // try server-side delete (if implemented)
                await removeHistoryItemBackend(mediaId, mediaType);
                // refresh list from backend
                const updated = await fetchHistoryBackend();
                setHistory(sanitizeMediaList(updated));
            } catch (e) {
                // fallback: optimistic UI removal
                setHistory((prev) => prev.filter((item) => item.mediaId !== mediaId));
            }
        } else {
            const updatedHistory = removeLocalView(mediaId);
            setHistory(updatedHistory);
        }
    };

    // Clear all history
    const handleClearHistory = async () => {
        if (isAuthenticated) {
            try {
                await clearHistoryBackend();
                setHistory([]);
            } catch {
                // ignore
            }
        } else {
            clearLocalHistory();
            setHistory([]);
        }
    };

    // Continue watching (navigate to media)
    const handleContinueWatching = (mediaId, mediaType) => {
        navigate(`/media/${mediaId}?mediaType=${normalizeMediaType(mediaType)}`);
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
                        History
                    </Typography>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Button
                            onClick={handleClearHistory}
                            size="small"
                            sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    All movies and media you have viewed
                </Typography>
            </Box>

            {history.length === 0 ? (
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
                        No history yet
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                        }}
                    >
                        Start watching something to see it here
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {sanitizeMediaList(history).map((item) => (
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
                                            src={getPosterImage(item)}
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
                                                Last viewed:{' '}
                                                {item.lastViewed
                                                    ? new Date(item.lastViewed).toLocaleString()
                                                    : 'N/A'}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleRemoveFromHistory(item.mediaId, item.mediaType)}
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

                                    {/* Continue Button */}
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleContinueWatching(item.mediaId, item.mediaType)}
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
                                        View Again
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

export default HistorySection;