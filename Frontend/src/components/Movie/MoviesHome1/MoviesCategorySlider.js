import React from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import MoviesHome from './MoviesHome'; // Đường dẫn tới MoviesHome
import useFetch from '@/hooks/useFetch'; // Đường dẫn tới useFetch hook

function MoviesCategorySlider() {
    // Gọi API cho từng thể loại phim
    const comedyMovies = useFetch(`${process.env.REACT_APP_API_URL}/api/media/search?releaseYear=2025&genreId=4`);
    const actionMovies = useFetch(`${process.env.REACT_APP_API_URL}/api/media/search?releaseYear=2025&genreId=1`);
    const familyMovies = useFetch(`${process.env.REACT_APP_API_URL}/api/media/search?releaseYear=2025&genreId=8`);



    // Hàm ánh xạ dữ liệu API sang định dạng MoviesHome
    const mapMovies = (data) => {
        // Kiểm tra nếu data không tồn tại hoặc không có result.content
        if (!data || !data.result || !Array.isArray(data.result.content)) {
            console.warn('Dữ liệu API không hợp lệ:', data);
            return [];
        }

        // Ánh xạ dữ liệu từ result.content
        return data.result.content.map((item) => ({
            mediaId: item.mediaId,
            image: item.posterURL || 'https://via.placeholder.com/300x169', // Lấy posterURL
            title: item.title || 'Không có tiêu đề',
            description: `${item.releaseYear || 'N/A'} • ${item.duration || 'N/A'} phút`,
        }));
    };

    // Ánh xạ dữ liệu cho từng danh sách
    const comedyMoviesList = mapMovies(comedyMovies.data);
    const actionMoviesList = mapMovies(actionMovies.data);
    const familyMoviesList = mapMovies(familyMovies.data);

    return (
        <Box
            sx={{
                margin: '40px',
                padding: '40px',
                background: 'linear-gradient(to bottom, var(--second-black), var(--black))',
                borderRadius: '20px',
            }}
        >
            {/* Phim hài mới */}
            <Box sx={{ marginBottom: '40px' }}>
                {comedyMovies.loading && <CircularProgress />}
                {comedyMovies.error && (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography color="error">Lỗi khi lấy phim hài: {comedyMovies.error.message}</Typography>
                        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 1 }}>
                            Thử lại
                        </Button>
                    </Box>
                )}
                {!comedyMovies.loading && !comedyMovies.error && (
                    <MoviesHome
                        movies={comedyMoviesList}
                        size="small"
                        orientation="landscape"
                        title="Laugh Till You Drop"
                    />
                )}
            </Box>

            {/* Phim hành động mới */}
            <Box sx={{ marginBottom: '40px' }}>
                {actionMovies.loading && <CircularProgress />}
                {actionMovies.error && (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography color="error">Lỗi khi lấy phim hành động: {actionMovies.error.message}</Typography>
                        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 1 }}>
                            Thử lại
                        </Button>
                    </Box>
                )}
                {!actionMovies.loading && !actionMovies.error && (
                    <MoviesHome
                        movies={actionMoviesList}
                        size="small"
                        orientation="landscape"
                        title="Run Before They Catch"
                    />
                )}
            </Box>

            {/* Phim gia đình mới */}
            <Box>
                {familyMovies.loading && <CircularProgress />}
                {familyMovies.error && (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography color="error">Lỗi khi lấy phim gia đình: {familyMovies.error.message}</Typography>
                        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 1 }}>
                            Thử lại
                        </Button>
                    </Box>
                )}
                {!familyMovies.loading && !familyMovies.error && (
                    <MoviesHome
                        movies={familyMoviesList}
                        size="small"
                        orientation="landscape"
                        title="Home Is Where Love"
                    />
                )}
            </Box>
        </Box>
    );
}

export default MoviesCategorySlider;
