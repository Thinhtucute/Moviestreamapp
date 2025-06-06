import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Alert,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RestoreIcon from '@mui/icons-material/Restore';

function SettingsSection() {
    const [settings, setSettings] = useState({
        language: 'en',
        theme: 'dark',
        videoQuality: 'auto',
        autoplay: true,
        volume: 80,
        subtitles: true,
        parentalControl: false,
    });
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleSettingChange = (field) => (event) => {
        setSettings((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSwitchChange = (field) => (event) => {
        setSettings((prev) => ({
            ...prev,
            [field]: event.target.checked,
        }));
    };

    const handleVolumeChange = (event, newValue) => {
        setSettings((prev) => ({
            ...prev,
            volume: newValue,
        }));
    };

    const handleResetSettings = () => {
        setSettings({
            language: 'en',
            theme: 'dark',
            videoQuality: 'auto',
            autoplay: true,
            volume: 80,
            subtitles: true,
            parentalControl: false,
        });
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
    };

    return (
        <Box sx={{ color: 'white' }}>
            {/* Section Header */}
            <Box
                sx={{
                    marginBottom: 4,
                    paddingBottom: 2.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginBottom: 1,
                    }}
                >
                    <SettingsIcon sx={{ color: '#ff9800', fontSize: '2rem' }} />
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            margin: 0,
                        }}
                    >
                        App Settings
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    Customize your viewing experience
                </Typography>
            </Box>

            {resetSuccess && (
                <Alert
                    severity="success"
                    sx={{
                        marginBottom: 3,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4caf50',
                        '& .MuiAlert-icon': {
                            color: '#4caf50',
                        },
                    }}
                >
                    Settings reset to default successfully!
                </Alert>
            )}

            {/* General Settings */}
            <Paper
                sx={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 165, 0, 0.2)',
                    borderRadius: 2,
                    padding: 3,
                    marginBottom: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: 'white',
                        marginBottom: 3,
                        fontWeight: 'bold',
                    }}
                >
                    General Settings
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': { color: '#ff9800' },
                            }}
                        >
                            Language
                        </InputLabel>
                        <Select
                            value={settings.language}
                            onChange={handleSettingChange('language')}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff9800',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff9800',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white',
                                },
                            }}
                        >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="vi">Tiếng Việt</MenuItem>
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="fr">Français</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': { color: '#ff9800' },
                            }}
                        >
                            Theme
                        </InputLabel>
                        <Select
                            value={settings.theme}
                            onChange={handleSettingChange('theme')}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff9800',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff9800',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white',
                                },
                            }}
                        >
                            <MenuItem value="dark">Dark Theme</MenuItem>
                            <MenuItem value="light">Light Theme</MenuItem>
                            <MenuItem value="auto">Auto (System)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            {/* Video Settings */}
            <Paper
                sx={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 165, 0, 0.2)',
                    borderRadius: 2,
                    padding: 3,
                    marginBottom: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: 'white',
                        marginBottom: 3,
                        fontWeight: 'bold',
                    }}
                >
                    Video & Audio Settings
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': { color: '#ff9800' },
                            }}
                        >
                            Default Video Quality
                        </InputLabel>
                        <Select
                            value={settings.videoQuality}
                            onChange={handleSettingChange('videoQuality')}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff9800',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff9800',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white',
                                },
                            }}
                        >
                            <MenuItem value="auto">Auto</MenuItem>
                            <MenuItem value="1080p">1080p HD</MenuItem>
                            <MenuItem value="720p">720p HD</MenuItem>
                            <MenuItem value="480p">480p</MenuItem>
                        </Select>
                    </FormControl>

                    <Box>
                        <Typography sx={{ color: 'white', marginBottom: 2 }}>
                            Default Volume: {settings.volume}%
                        </Typography>
                        <Slider
                            value={settings.volume}
                            onChange={handleVolumeChange}
                            min={0}
                            max={100}
                            sx={{
                                color: '#ff9800',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#ff9800',
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: '#ff9800',
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.autoplay}
                                onChange={handleSwitchChange('autoplay')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#ff9800',
                                        '& + .MuiSwitch-track': {
                                            backgroundColor: '#ff9800',
                                        },
                                    },
                                }}
                            />
                        }
                        label="Autoplay next episode"
                        sx={{ color: 'white' }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.subtitles}
                                onChange={handleSwitchChange('subtitles')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#ff9800',
                                        '& + .MuiSwitch-track': {
                                            backgroundColor: '#ff9800',
                                        },
                                    },
                                }}
                            />
                        }
                        label="Show subtitles by default"
                        sx={{ color: 'white' }}
                    />
                </Box>
            </Paper>

            {/* Privacy Settings */}
            <Paper
                sx={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 165, 0, 0.2)',
                    borderRadius: 2,
                    padding: 3,
                    marginBottom: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: 'white',
                        marginBottom: 3,
                        fontWeight: 'bold',
                    }}
                >
                    Privacy & Safety
                </Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.parentalControl}
                            onChange={handleSwitchChange('parentalControl')}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#ff9800',
                                    '& + .MuiSwitch-track': {
                                        backgroundColor: '#ff9800',
                                    },
                                },
                            }}
                        />
                    }
                    label="Enable Parental Controls"
                    sx={{ color: 'white' }}
                />
            </Paper>

            {/* Reset Settings */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<RestoreIcon />}
                    onClick={handleResetSettings}
                    sx={{
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            borderColor: '#ff9800',
                        },
                    }}
                >
                    Reset to Defaults
                </Button>
            </Box>
        </Box>
    );
}

export default SettingsSection;
