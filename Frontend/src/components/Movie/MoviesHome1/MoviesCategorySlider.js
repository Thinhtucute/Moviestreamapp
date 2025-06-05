import React from 'react';
import { Box, Typography, Button, CircularProgress, Skeleton } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import MoviesHome from './MoviesHome'; // Đường dẫn tới MoviesHome
import useFetch from '@/hooks/useFetch'; // Đường dẫn tới useFetch hook

function MoviesCategorySlider() {
    // Gọi API cho từng thể loại phim
    const comedyMovies = useFetch(
        `${process.env.REACT_APP_API_URL}/api/media/search?releaseYear=2025&genreName=Comedy`,
    );
    const actionMovies = useFetch(
        `${process.env.REACT_APP_API_URL}/api/media/search?releaseYear=2025&genreName=Action`,
    );
    const familyMovies = useFetch(
        `${process.env.REACT_APP_API_URL}/api/media/search?releaseYear=2025&genreName=Family`,
    );

    // Hàm ánh xạ dữ liệu API sang định dạng MoviesHome
    const mapMovies = (data) => {
        if (!data || !data.result || !Array.isArray(data.result.content)) {
            console.warn('Dữ liệu API không hợp lệ:', data);
            return [];
        }

        return data.result.content.map((item) => ({
            mediaId: item.mediaId,
            image: item.posterURL || 'https://via.placeholder.com/300x169',
            title: item.title || 'Không có tiêu đề',
            releaseYear: item.releaseYear || 'N/A',
            duration: item.duration || 'N/A',
            rating: item.rating || null,
            mediaType: item.mediaType || 'Movie',
        }));
    };

    // Ánh xạ dữ liệu cho từng danh sách
    const comedyMoviesList = mapMovies(comedyMovies.data);
    const actionMoviesList = mapMovies(actionMovies.data);
    const familyMoviesList = mapMovies(familyMovies.data);

    // Loading skeleton component
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

    // Error component
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
                Không thể tải {categoryName}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 3,
                }}
            >
                {error?.message || 'Đã xảy ra lỗi khi tải dữ liệu'}
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
                Thử lại
            </Button>
        </Box>
    );

    // Main loading state - nếu tất cả đều đang loading
    const isAllLoading = comedyMovies.loading && actionMovies.loading && familyMovies.loading;

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
                        Đang tải nội dung...
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
                margin: '40px 40px 0 40px',
                padding: '40px',
                background: 'linear-gradient(to bottom, var(--second-black), var(--black))',
                borderRadius: '20px',
            }}
        >
            {/* Phim hài */}
            <Box sx={{ marginBottom: '40px' }}>
                {comedyMovies.loading ? (
                    <LoadingSkeleton />
                ) : comedyMovies.error ? (
                    <ErrorComponent
                        error={comedyMovies.error}
                        onRetry={() => window.location.reload()}
                        categoryName="phim hài"
                    />
                ) : comedyMoviesList.length > 0 ? (
                    <MoviesHome
                        movies={comedyMoviesList}
                        size="small"
                        orientation="landscape"
                        title="Laugh Till You Drop"
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
                            Không có phim hài nào để hiển thị
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Phim hành động */}
            <Box sx={{ marginBottom: '40px' }}>
                {actionMovies.loading ? (
                    <LoadingSkeleton />
                ) : actionMovies.error ? (
                    <ErrorComponent
                        error={actionMovies.error}
                        onRetry={() => window.location.reload()}
                        categoryName="phim hành động"
                    />
                ) : actionMoviesList.length > 0 ? (
                    <MoviesHome
                        movies={actionMoviesList}
                        size="small"
                        orientation="landscape"
                        title="Run Before They Catch"
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
                            Không có phim hành động nào để hiển thị
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Phim gia đình */}
            <Box>
                {familyMovies.loading ? (
                    <LoadingSkeleton />
                ) : familyMovies.error ? (
                    <ErrorComponent
                        error={familyMovies.error}
                        onRetry={() => window.location.reload()}
                        categoryName="phim gia đình"
                    />
                ) : familyMoviesList.length > 0 ? (
                    <MoviesHome
                        movies={familyMoviesList}
                        size="small"
                        orientation="landscape"
                        title="Home Is Where Love"
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
                            Không có phim gia đình nào để hiển thị
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default MoviesCategorySlider;
