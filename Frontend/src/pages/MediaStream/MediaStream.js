import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import styles from './MediaStream.module.scss';

export default function MediaStream() {
    const { mediaId } = useParams();
    const [loading, setLoading] = useState(true);
    const [streamData, setStreamData] = useState(null);
    const [mediaDetails, setMediaDetails] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const fetchStreamData = async () => {
            try {
                setLoading(true);
                // Get auth token from localStorage
                const token = localStorage.getItem('token');
                
                // Fetch media details
                const mediaResponse = await axios.get(`${apiUrl}/api/media/${mediaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Fetch streaming URL
                const streamResponse = await axios.get(`${apiUrl}/api/stream/${mediaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setMediaDetails(mediaResponse.data);
                setStreamData(streamResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stream data:', err);
                setError(err.response?.data?.message || 'Failed to load video');
                setLoading(false);
            }
        };
        
        fetchStreamData();
    }, [mediaId, apiUrl]);

    const handleBack = () => {
        navigate(`/media/${mediaId}`);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, minHeight: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                    <CircularProgress size={60} sx={{ color: 'var(--primary)' }} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, minHeight: '100vh'}}>
                <Button 
                    variant="outlined" 
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 2, color: 'white', borderColor: 'gray' }}
                >
                    Back to Details
                </Button>
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                        Unable to Play Video
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
            <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 2, color: 'white', borderColor: 'gray' }}
            >
                Back to Details
            </Button>
            
            {mediaDetails && streamData && (
                <>
                    <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>
                        {mediaDetails.title}
                    </Typography>
                    
                    <Box sx={{ width: '100%', bgcolor: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        <video
                            controls
                            width="100%"
                            poster={mediaDetails.posterURL}
                            style={{ maxHeight: '80vh' }}
                            autoPlay
                            className={styles.videoPlayer}
                        >
                            <source src={streamData.streamURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Box>
                    
                    {/* Optional: Add more media information below the player */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {mediaDetails.description}
                        </Typography>
                    </Box>
                </>
            )}
        </Container>
    );
}