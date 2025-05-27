// src/components/MoviesSection/MoviesSection.jsx
import React from 'react';
import { Box } from '@mui/material';
import VerticalMovieCarousel from '../VerticalMovieCarousel/VerticalMovieCarousel';
import useFetch from '@/hooks/useFetch';

function MoviesSection() {
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
            releaseYear: item.releaseYear || 'N/A',
            duration: item.duration || 'N/A',
        }));
    };

    return (
        <Box sx={{ p: 2 }}>
            <VerticalMovieCarousel
                title="Phim Hài"
                movies={mapMovies(comedyMovies.data)}
                isLoading={comedyMovies.isLoading}
                error={comedyMovies.error}
            />
            <VerticalMovieCarousel
                title="Phim Hành Động"
                movies={mapMovies(actionMovies.data)}
                isLoading={actionMovies.isLoading}
                error={actionMovies.error}
            />
            <VerticalMovieCarousel
                title="Phim Gia Đình"
                movies={mapMovies(familyMovies.data)}
                isLoading={familyMovies.isLoading}
                error={familyMovies.error}
            />
        </Box>
    );
}

export default MoviesSection;
