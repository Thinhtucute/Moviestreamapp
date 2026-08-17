import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import styles from './MediaStream.module.scss';

const PLAYER_ORIGIN = 'https://www.vidking.net';
const WATCH_PROGRESS_PREFIX = 'watchProgress';

const parsePlayerMessage = (rawData) => {
    if (typeof rawData === 'string') {
        try {
            return JSON.parse(rawData);
        } catch {
            return null;
        }
    }

    if (typeof rawData === 'object' && rawData !== null) {
        return rawData;
    }

    return null;
};

const buildEmbedUrl = (baseUrl, options) => {
    if (!baseUrl) {
        return '';
    }

    try {
        const url = new URL(baseUrl);

        if (typeof options.autoPlay === 'boolean') {
            url.searchParams.set('autoPlay', String(options.autoPlay));
        }

        if (Number.isFinite(options.progress) && options.progress > 0) {
            url.searchParams.set('progress', String(Math.floor(options.progress)));
        }

        return url.toString();
    } catch {
        return baseUrl;
    }
};

const normalizeMediaType = (mediaType) => {
    const raw = String(mediaType || '').trim().toLowerCase();
    if (raw === 'movie') return 'movie';
    if (raw === 'tv') return 'tv';
    return null;
};

export default function MediaStream() {
    const { mediaId, episodeId, season, episodeNumber } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [streamUrl, setStreamUrl] = useState(null);
    const [error, setError] = useState(null);
    const [resumeProgress, setResumeProgress] = useState(0);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const urlParams = new URLSearchParams(location.search);
    const mediaTypeParam = normalizeMediaType(urlParams.get('mediaType'));
    const resolvedMediaType = mediaTypeParam || (episodeId || season || episodeNumber ? 'tv' : 'movie');
    const resolvedSeason = season;
    const resolvedEpisodeNumber = episodeNumber;
    const progressStorageKey = `${WATCH_PROGRESS_PREFIX}:${mediaId}`;

    const iframeSrc = useMemo(
        () =>
            buildEmbedUrl(streamUrl, {
                autoPlay: true,
                progress: resumeProgress,
            }),
        [streamUrl, resumeProgress],
    );

    useEffect(() => {
        const storedProgress = Number(localStorage.getItem(progressStorageKey));
        if (Number.isFinite(storedProgress) && storedProgress > 0) {
            setResumeProgress(storedProgress);
        }
    }, [progressStorageKey]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: location.pathname + location.search } });
            return;
        }

        const fetchStreamData = async () => {
            try {
                setLoading(true);
                let response;

                if (resolvedMediaType === 'tv') {
                    if (resolvedSeason && resolvedEpisodeNumber) {
                        response = await axios.get(
                            `${apiUrl}/api/stream/${mediaId}/season/${encodeURIComponent(resolvedSeason)}/episode/${resolvedEpisodeNumber}`,
                            {
                                params: {
                                    mediaType: 'tv',
                                },
                                headers: { Authorization: `Bearer ${token}` },
                            },
                        );
                    } else if (episodeId) {
                        response = await axios.get(`${apiUrl}/api/stream/${mediaId}/episode/${episodeId}`, {
                            params: {
                                mediaType: 'tv',
                            },
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    } else {
                        throw new Error('Missing season/episodeNumber or episodeId for tv streaming route');
                    }
                } else {
                    response = await axios.get(`${apiUrl}/api/stream/${mediaId}`, {
                        params: {
                            mediaType: 'movie',
                        },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }

                setStreamUrl(response.data.streamURL);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stream data:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login', { state: { from: location.pathname + location.search } });
                } else {
                    setError(err.response?.data?.message || 'Failed to load video');
                }
                setLoading(false);
            }
        };

        fetchStreamData();
    }, [
        mediaId,
        resolvedMediaType,
        resolvedSeason,
        resolvedEpisodeNumber,
        episodeId,
        apiUrl,
        navigate,
        location.pathname,
        location.search,
    ]);

    useEffect(() => {
        const onPlayerMessage = (event) => {
            if (event.origin !== PLAYER_ORIGIN) {
                return;
            }

            const message = parsePlayerMessage(event.data);
            if (!message || message.type !== 'PLAYER_EVENT' || !message.data) {
                return;
            }

            const { currentTime, id } = message.data;
            if (!Number.isFinite(currentTime) || currentTime < 0) {
                return;
            }

            if (id && String(id) !== String(mediaId)) {
                return;
            }

            localStorage.setItem(progressStorageKey, String(Math.floor(currentTime)));
        };

        window.addEventListener('message', onPlayerMessage);
        return () => window.removeEventListener('message', onPlayerMessage);
    }, [mediaId, progressStorageKey]);

    const handleBack = () => {
        if (resolvedMediaType) {
            navigate(`/media/${mediaId}?mediaType=${resolvedMediaType}`);
            return;
        }
        navigate(`/media/${mediaId}`);
    };

    if (loading) {
        return (
            <Container maxWidth={false} sx={{ py: 8, minHeight: '100vh', width: '95%', mx: 'auto' }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh',
                    background: 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)'
                }}>
                    <CircularProgress size={60} sx={{ color: 'var(--primary)' }} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth={false} sx={{ pt: '50%', minHeight: '100vh', width: '95%', mx: 'auto' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        mb: 2,
                        color: 'white',
                        borderColor: 'var(--primary)',
                        '&:hover': {
                            borderColor: 'var(--primary)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    Back to Details
                </Button>
                <Box sx={{
                    p: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)',
                    borderRadius: 2
                }}>
                    <Box sx={{ color: 'white', mb: 2 }}>
                        {error}
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: { xs: 9, sm: 10, md: 12 }, px: { xs: 2, sm: 3 }, minHeight: '100vh', width: { xs: '100%', md: '97%' }, mx: 'auto' }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{
                    mb: 3,
                    color: 'white',
                    borderColor: 'var(--primary)',
                    '&:hover': {
                        borderColor: 'var(--primary)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                Back to Details
            </Button>

            {resolvedMediaType === 'tv' && season && episodeNumber && (
                <Box sx={{ color: 'white', mb: 2, opacity: 0.85 }}>
                    Media {mediaId} - Season {season} Episode {episodeNumber}
                </Box>
            )}

            {streamUrl && (
                <Box sx={{
                    width: '100%',
                    bgcolor: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    position: 'relative',
                    paddingTop: '56.25%' // 16:9
                }}>
                    <iframe
                        src={iframeSrc}
                        title={`Media Player ${mediaId}`}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        allowFullScreen
                        className={styles.videoPlayer}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                        }}
                    />
                </Box>
            )}
        </Container>
    );
}