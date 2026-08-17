import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import useNotification from '@/hooks/useNotification';
import { getAuthToken } from '@/utils/authStorage';

const DashboardPage = () => {
    const [tmdbImportForm, setTmdbImportForm] = useState({
        tmdbId: '',
        mediaType: 'Movie',
        includeEpisodes: true,
        overwriteEpisodes: false,
        accessLevel: 'Free',
        streamURL: '',
    });
    const [importingTmdb, setImportingTmdb] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { showNotification } = useNotification();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const handleTmdbImport = async (e) => {
        e.preventDefault();
        const tmdbId = Number(tmdbImportForm.tmdbId);
        
        if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
            const msg = 'Invalid TMDB ID';
            setError(msg);
            showNotification(msg, 'error');
            return;
        }

        try {
            setImportingTmdb(true);
            setError(null);
            setSuccess(null);
            
            const token = getAuthToken();
            if (!token) {
                const msg = 'Authentication token not found';
                setError(msg);
                showNotification(msg, 'error');
                return;
            }

            const response = await axios.post(
                `${apiUrl}/api/media/import/tmdb`,
                {
                    tmdbId,
                    mediaType: tmdbImportForm.mediaType,
                    includeEpisodes: tmdbImportForm.includeEpisodes,
                    overwriteEpisodes: tmdbImportForm.overwriteEpisodes,
                    accessLevel: tmdbImportForm.accessLevel,
                    streamURL: tmdbImportForm.streamURL || '',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.code === 1000) {
                const successMsg = `Import "${response.data.result?.title || 'Media'}" successful!`;
                setSuccess(successMsg);
                showNotification(successMsg, 'success');
                setTmdbImportForm({
                    tmdbId: '',
                    mediaType: 'Movie',
                    includeEpisodes: true,
                    overwriteEpisodes: false,
                    accessLevel: 'PUBLIC',
                    streamURL: '',
                });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'An error occurred while importing from TMDB';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
        } finally {
            setImportingTmdb(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'var(--second-black)', pt: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
                    Import Medias from TMDB
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Paper sx={{ p: 4, bgcolor: 'var(--black)' }}>
                    <Box component="form" onSubmit={handleTmdbImport}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="TMDB ID"
                                    type="number"
                                    value={tmdbImportForm.tmdbId}
                                    onChange={(e) =>
                                        setTmdbImportForm({
                                            ...tmdbImportForm,
                                            tmdbId: e.target.value,
                                        })
                                    }
                                    placeholder="E.g.: 603 (The Matrix) or 1399 (Breaking Bad)"
                                    disabled={importingTmdb}
                                    required
                                    inputProps={{ min: '1' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Media Type"
                                    value={tmdbImportForm.mediaType}
                                    onChange={(e) =>
                                        setTmdbImportForm({
                                            ...tmdbImportForm,
                                            mediaType: e.target.value,
                                        })
                                    }
                                    disabled={importingTmdb}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="Movie">Movie</option>
                                    <option value="Tv">TV Series</option>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Include Episodes"
                                    value={tmdbImportForm.includeEpisodes ? 'yes' : 'no'}
                                    onChange={(e) =>
                                        setTmdbImportForm({
                                            ...tmdbImportForm,
                                            includeEpisodes: e.target.value === 'yes',
                                        })
                                    }
                                    disabled={importingTmdb}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Overwrite Episodes"
                                    value={tmdbImportForm.overwriteEpisodes ? 'yes' : 'no'}
                                    onChange={(e) =>
                                        setTmdbImportForm({
                                            ...tmdbImportForm,
                                            overwriteEpisodes: e.target.value === 'yes',
                                        })
                                    }
                                    disabled={importingTmdb}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Access Level"
                                    value={tmdbImportForm.accessLevel}
                                    onChange={(e) =>
                                        setTmdbImportForm({
                                            ...tmdbImportForm,
                                            accessLevel: e.target.value,
                                        })
                                    }
                                    disabled={importingTmdb}
                                    placeholder="E.g.: PUBLIC, PREMIUM, VIP"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                    disabled={importingTmdb}
                                    sx={{ py: 1.5 }}
                                >
                                    {importingTmdb ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={20} />
                                            <span>Importing...</span>
                                        </Box>
                                    ) : (
                                        'Import from TMDB'
                                    )}
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Find TMDB ID at{' '}
                                    <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                                        themoviedb.org
                                    </a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default DashboardPage;
