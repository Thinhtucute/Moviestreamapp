import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Pagination,
} from '@mui/material';
import axios from 'axios';

const ActorsPage = () => {
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 12;

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        fetchActors();
    }, [page]);

    const fetchActors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/actors`, {
                params: {
                    page,
                    size: pageSize,
                },
            });
            if (response.data) {
                setActors(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
            }
        } catch (err) {
            setError('Không thể tải danh sách diễn viên');
            console.error('Error fetching actors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value - 1); // Convert to 0-based index
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--black) 0%, var(--second-black) 100%)',
                paddingTop: '80px',
                paddingBottom: '40px',
            }}
        >
            <Container maxWidth="lg">
                <Box
                sx={{
                    my: 4,
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
                    Top Actors
                </Typography>
            </Box>
                
                <Grid container spacing={3}>
                    {actors.map((actor) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={actor.actorId}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'var(--second-black)',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image={
                                        actor.profileImageURL ||
                                        'https://via.placeholder.com/300x400?text=No+Image'
                                    }
                                    alt={actor.actorName}
                                    sx={{
                                        objectFit: 'cover',
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {actor.actorName}
                                    </Typography>
                                    {actor.bio && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                mt: 1,
                                            }}
                                        >
                                            {actor.bio}
                                        </Typography>
                                    )}
                                    {actor.birthdate && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                mt: 1,
                                            }}
                                        >
                                            Sinh ngày: {new Date(actor.birthdate).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {totalPages > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                            '& .MuiPaginationItem-root': {
                                color: 'white',
                            },
                            '& .MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: 'var(--primary)',
                                '&:hover': {
                                    backgroundColor: 'var(--primary)',
                                },
                            },
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>
                )}

                
            </Container>
        </Box>
    );
};

export default ActorsPage; 