// src/components/MoviesSection/MoviesSection.jsx
import React, { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Skeleton } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import VerticalMovieCarousel from '../VerticalMovieCarousel/VerticalMovieCarousel';
import useFetch from '@/hooks/useFetch';

function VerticalMovieSections({ onLoad }) {
    // Add onLoad to props
    const dramaMovies = useFetch(`${process.env.REACT_APP_API_URL}/api/media/search?genreName=Drama`);
    const documentaryMovies = useFetch(`${process.env.REACT_APP_API_URL}/api/media/search?genreName=Documentary`);
    const historyMovies = useFetch(`${process.env.REACT_APP_API_URL}/api/media/search?genreName=History`);

    // Function to map API data to MoviesHome format
    const mapMovies = (data) => {
        if (!data || !data.result || !Array.isArray(data.result.content)) {
            console.warn('Invalid API data:', data);
            return [];
        }

        return data.result.content.map((item) => ({
            mediaId: item.mediaId,
            image: item.posterURL || 'https://via.placeholder.com/300x169',
            title: item.title || 'No title',
            releaseYear: item.releaseYear || 'N/A',
            duration: item.duration || 'N/A',
            rating: item.rating || null,
            mediaType: item.mediaType || 'Movie',
        }));
    };

    // Check loading state and call onLoad callback
    useEffect(() => {
        const allLoaded = !dramaMovies.loading && !documentaryMovies.loading && !historyMovies.loading;
        if (allLoaded && onLoad) {
            onLoad();
        }
    }, [dramaMovies.loading, documentaryMovies.loading, historyMovies.loading, onLoad]);

    // Map data for each list
    const dramaMoviesList = mapMovies(dramaMovies.data);
    const documentaryMoviesList = mapMovies(documentaryMovies.data);
    const historyMoviesList = mapMovies(historyMovies.data);

    // Loading skeleton component - similar to MoviesCategorySlider
    const LoadingSkeleton = () => (
        <Box sx={{ marginBottom: '40px' }}>
            <Skeleton
                variant="text"
                width={300}
                height={60}
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mb: 3,
                }}
            />
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
                {[...Array(6)].map((_, index) => (
                    <Box key={index} sx={{ minWidth: 200, flexShrink: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            width={200}
                            height={300}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                mb: 1,
                            }}
                        />
                        <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                    </Box>
                ))}
            </Box>
        </Box>
    );

    // Error component - similar to MoviesCategorySlider
    const ErrorComponent = ({ error, onRetry, categoryName }) => (
        <Box
            sx={{
                textAlign: 'center',
                py: 4,
                px: 2,
                mb: 4,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 0, 0, 0.2)',
            }}
        >
            <ErrorOutline
                sx={{
                    fontSize: 48,
                    color: '#ff4444',
                    mb: 2,
                }}
            />
            <Typography
                variant="h6"
                sx={{
                    color: 'white',
                    mb: 1,
                    fontWeight: 'bold',
                }}
            >
                Unable to load {categoryName}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 3,
                }}
            >
                {error?.message || 'An error occurred while loading data'}
            </Typography>
            <Button
                variant="contained"
                onClick={onRetry}
                sx={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#e55b00',
                    },
                }}
            >
                Try Again
            </Button>
        </Box>
    );

    // Main loading state - if all are loading (similar to MoviesCategorySlider)
    const isAllLoading = dramaMovies.loading && documentaryMovies.loading && historyMovies.loading;

    if (isAllLoading) {
        return (
            <Box
                sx={{
                    margin: '40px 40px 0 40px',
                    padding: '40px',
                    background: 'linear-gradient(to bottom, var(--second-black), var(--black))',
                    borderRadius: '20px',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                    <CircularProgress
                        size={60}
                        sx={{
                            color: 'var(--primary)',
                            mr: 2,
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontSize: 'calc(var(--current-font-size) * 1.2)',
                        }}
                    >
                        Loading more content...
                    </Typography>
                </Box>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                marginTop: '40px',
            }}
        >
            {/* Drama Section */}
            <Box sx={{ marginBottom: '40px' }}>
                {dramaMovies.loading ? (
                    <LoadingSkeleton />
                ) : dramaMovies.error ? (
                    <ErrorComponent
                        error={dramaMovies.error}
                        onRetry={() => window.location.reload()}
                        categoryName="drama movies"
                    />
                ) : dramaMoviesList.length > 0 ? (
                    <VerticalMovieCarousel title="Drama" movies={dramaMoviesList} isLoading={false} error={null} />
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontStyle: 'italic',
                            }}
                        >
                            No drama movies to display
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Documentary Section */}
            <Box sx={{ marginBottom: '40px' }}>
                {documentaryMovies.loading ? (
                    <LoadingSkeleton />
                ) : documentaryMovies.error ? (
                    <ErrorComponent
                        error={documentaryMovies.error}
                        onRetry={() => window.location.reload()}
                        categoryName="documentary movies"
                    />
                ) : documentaryMoviesList.length > 0 ? (
                    <VerticalMovieCarousel
                        title="Documentary"
                        movies={documentaryMoviesList}
                        isLoading={false}
                        error={null}
                    />
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontStyle: 'italic',
                            }}
                        >
                            No documentary movies to display
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* History Section */}
            <Box sx={{ marginBottom: '40px' }}>
                {historyMovies.loading ? (
                    <LoadingSkeleton />
                ) : historyMovies.error ? (
                    <ErrorComponent
                        error={historyMovies.error}
                        onRetry={() => window.location.reload()}
                        categoryName="history movies"
                    />
                ) : historyMoviesList.length > 0 ? (
                    <VerticalMovieCarousel title="History" movies={historyMoviesList} isLoading={false} error={null} />
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontStyle: 'italic',
                            }}
                        >
                            No history movies to display
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default VerticalMovieSections; // Thay đổi export name từ MoviesSection thành VerticalMovieSections
