import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import styles from './MediaStream.module.scss';

export default function MediaStream() {
    const { mediaId } = useParams();
    const [loading, setLoading] = useState(true);
    const [streamUrl, setStreamUrl] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: `/stream/${mediaId}` } });
            return;
        }

        const fetchStreamData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/api/stream/${mediaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStreamUrl(response.data.streamURL);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stream data:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login', { state: { from: `/stream/${mediaId}` } });
                } else {
                    setError(err.response?.data?.message || 'Failed to load video');
                }
                setLoading(false);
            }
        };

        fetchStreamData();
    }, [mediaId, apiUrl, navigate]);

    const handleBack = () => {
        navigate(`/media/${mediaId}`);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, minHeight: '100vh' }}>
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
            <Container maxWidth="lg" sx={{ pt: '50%', minHeight: '100vh' }}>
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
        <Container maxWidth="lg" sx={{ py: 12, minHeight: '100vh' }}>
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
                    <video
                        controls
                        controlsList="nodownload"
                        className={styles.videoPlayer}
                        autoPlay
                        playsInline
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    >
                        <source src={streamUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Box>
            )}
        </Container>
    );
}
