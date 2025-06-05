import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Chip } from '@mui/material';
import { PlayArrow, AccessTime, CalendarToday, Lock } from '@mui/icons-material';
import classNames from 'classnames/bind';

// Import styles từ MediaDetail để sử dụng chung
import styles from './MediaDetail.module.scss';

const cx = classNames.bind(styles);

const EpisodesSection = ({ episodes = [], mediaId, isAuthenticated, onLoginRequired, maxEpisodesToShow = 12 }) => {
    const navigate = useNavigate();

    if (!episodes || episodes.length === 0) {
        return null;
    }

    const handleEpisodeClick = (episodeId) => {
        if (isAuthenticated) {
            navigate(`/watch/${mediaId}/episode/${episodeId}`);
        } else {
            onLoginRequired();
        }
    };

    const handleWatchButtonClick = (e, episodeId) => {
        e.stopPropagation();
        handleEpisodeClick(episodeId);
    };

    const displayedEpisodes = episodes.slice(0, maxEpisodesToShow);

    return (
        // Sử dụng cùng structure như các section khác
        <Container maxWidth={false} className={cx('episodes-section')}>
            {/* Section Header - giống như cast-section và directors-section */}
            <Typography variant="h4" component="h2" className={cx('section-title')}>
                Episodes
            </Typography>

            {/* Episodes Count Info */}
            <Typography
                variant="h6"
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 'normal',
                    mb: 4,
                    fontSize: 'calc(var(--current-font-size) * 1.1)',
                }}
            >
                {episodes.length} episodes available
            </Typography>

            {/* Episodes Grid - sử dụng class từ SCSS */}
            <Box className={cx('episodes-grid')}>
                {displayedEpisodes.map((episode) => (
                    <Box
                        key={episode.episodeId}
                        className={cx('episode-card')}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            p: 3,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                                transform: 'translateY(-8px) scale(1.02)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                                borderColor: 'var(--primary)',
                                backgroundColor: 'rgba(255, 165, 0, 0.08)',
                                '& .episode-play-btn': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 8px 25px rgba(255, 165, 0, 0.4)',
                                },
                                '& .episode-number': {
                                    backgroundColor: '#e55b00',
                                    transform: 'scale(1.1)',
                                },
                            },
                        }}
                        onClick={() => handleEpisodeClick(episode.episodeId)}
                    >
                        {/* Episode Header */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box
                                className="episode-number"
                                sx={{
                                    backgroundColor: '#7c3aed',
                                    color: 'white',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    mr: 2,
                                    minWidth: '70px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                EP {episode.episodeNumber}
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="h6"
                                    component="h4"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        mb: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontSize: 'var(--current-font-size)',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {episode.title}
                                </Typography>

                                {/* Episode Meta Tags */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {episode.season && (
                                        <Chip
                                            label={`S${episode.season}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(255, 165, 0, 0.15)',
                                                color: 'var(--primary)',
                                                fontWeight: 'bold',
                                                fontSize: '11px',
                                                height: '24px',
                                                border: '1px solid rgba(255, 165, 0, 0.3)',
                                                '& .MuiChip-label': {
                                                    px: 1,
                                                },
                                            }}
                                        />
                                    )}

                                    {episode.duration && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <AccessTime
                                                sx={{
                                                    fontSize: '14px',
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {episode.duration}m
                                            </Typography>
                                        </Box>
                                    )}

                                    {episode.releaseDate && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <CalendarToday
                                                sx={{
                                                    fontSize: '14px',
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {new Date(episode.releaseDate).getFullYear()}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Episode Footer */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                pt: 2,
                            }}
                        >
                            <Button
                                className="episode-play-btn"
                                variant="contained"
                                size="medium"
                                startIcon={isAuthenticated ? <PlayArrow /> : <Lock />}
                                sx={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    marginLeft: '22%',
                                    px: 3,
                                    py: 1,
                                    fontSize: 'var(--current-font-size)',
                                    boxShadow: '0 4px 15px rgba(255, 165, 0, 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#e55b00',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                                onClick={(e) => handleWatchButtonClick(e, episode.episodeId)}
                            >
                                {isAuthenticated ? 'Watch' : 'Login'}
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Load More Section */}
            {episodes.length > maxEpisodesToShow && (
                <Box
                    sx={{
                        mt: 6,
                        pt: 4,
                        borderTop: '2px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 1,
                                fontSize: 'calc(var(--current-font-size) * 1.2)',
                            }}
                        >
                            Want to see more?
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: 'var(--current-font-size)',
                            }}
                        >
                            Showing {maxEpisodesToShow} of {episodes.length} episodes
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            color: 'white',
                            borderColor: 'var(--primary)',
                            borderWidth: '2px',
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontSize: 'var(--current-font-size)',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
                            '&:hover': {
                                borderColor: '#e55b00',
                                backgroundColor: 'rgba(255, 165, 0, 0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 30px rgba(255, 165, 0, 0.3)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onClick={() => {
                            console.log('Show all episodes');
                        }}
                    >
                        View All {episodes.length} Episodes
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default EpisodesSection;
