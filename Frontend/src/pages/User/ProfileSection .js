import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Grid,
    Paper,
    Divider,
    Switch,
    FormControlLabel,
    Alert,
    Chip,
    CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import avatar from '@/assets/images/avatar.jpg';

function ProfileSection({ userInfo }) {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: false,
        newsNotifications: true,
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // Load user data into form when userInfo changes
    useEffect(() => {
        if (userInfo) {
            setFormData({
                username: userInfo.username || '',
                email: userInfo.email || '',
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                phone: userInfo.phone || '',
                bio: userInfo.bio || '',
            });
        } else if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                bio: user.bio || '',
            });
        }
    }, [userInfo, user]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (updateSuccess) {
            const timer = setTimeout(() => setUpdateSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess]);

    const handleInputChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleNotificationChange = (field) => (event) => {
        setNotifications((prev) => ({
            ...prev,
            [field]: event.target.checked,
        }));
    };

    const handleSave = async () => {
        try {
            setUpdateLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.put(`${apiUrl}/users/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.data && response.data.code === 0) {
                setUpdateSuccess(true);
            } else {
                throw new Error(response.data?.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
        } finally {
            // setUpdateLoadingNo(false);
        }
    };

    const getSubscriptionColor = (plan) => {
        switch (plan?.toLowerCase()) {
            case 'premium':
                return { bg: 'rgba(255, 215, 0, 0.2)', color: '#ffd700' };
            case 'pro':
                return { bg: 'rgba(156, 39, 176, 0.2)', color: '#9c27b0' };
            case 'free':
            default:
                return { bg: 'rgba(158, 158, 158, 0.2)', color: '#9e9e9e' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const subscriptionColors = getSubscriptionColor(userInfo?.subscriptionPlan);

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, color: 'white' }}>
            {/* Header */}
            <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <PersonOutlineIcon sx={{ color: '#ff9800', fontSize: '2rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Profile Settings
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Update your personal information and preferences
                </Typography>
            </Box>

            {/* Alerts */}
            {(updateSuccess || error) && (
                <Box sx={{ mb: 3 }}>
                    {updateSuccess && (
                        <Alert
                            severity="success"
                            sx={{
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                color: '#4caf50',
                                '& .MuiAlert-icon': { color: '#4caf50' },
                            }}
                            onClose={() => setUpdateSuccess(false)}
                        >
                            Profile updated successfully!
                        </Alert>
                    )}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                color: '#f44336',
                                '& .MuiAlert-icon': { color: '#f44336' },
                            }}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}
                </Box>
            )}

            <Grid container spacing={3}>
                {/* Avatar Section */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 165, 0, 0.2)',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                        }}
                        elevation={0}
                    >
                        <Avatar
                            src={avatar || '/default-avatar.jpg'}
                            alt="Profile picture"
                            sx={{
                                width: 100,
                                height: 100,
                                mx: 'auto',
                                mb: 2,
                                border: '3px solid #ff9800',
                            }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<CameraAltIcon />}
                            sx={{
                                borderColor: '#ff9800',
                                color: '#ff9800',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                                    borderColor: '#ff9800',
                                },
                            }}
                            aria-label="Change profile picture"
                        >
                            Change Photo
                        </Button>
                    </Paper>
                </Grid>

                {/* Profile Form */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 165, 0, 0.2)',
                            borderRadius: 2,
                            p: 3,
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                            Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Form Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={formData.username}
                                    onChange={handleInputChange('username')}
                                    disabled={updateLoading}
                                    InputProps={{ style: { color: 'white' } }}
                                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: '#ff9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#ff9800' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    disabled={updateLoading}
                                    InputProps={{ style: { color: 'white' } }}
                                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: '#ff9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#ff9800' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange('firstName')}
                                    disabled={updateLoading}
                                    InputProps={{ style: { color: 'white' } }}
                                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: '#ff9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#ff9800' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange('lastName')}
                                    disabled={updateLoading}
                                    InputProps={{ style: { color: 'white' } }}
                                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: '#ff9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#ff9800' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    multiline
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleInputChange('bio')}
                                    disabled={updateLoading}
                                    placeholder="Tell us about yourself..."
                                    InputProps={{ style: { color: 'white' } }}
                                    InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: '#ff9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#ff9800' },
                                    }}
                                />
                            </Grid>

                            {/* Account Information Section - Organized Layout */}
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'white',
                                        mb: 3,
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <AccountCircleIcon sx={{ color: '#ff9800' }} />
                                    Account Information
                                </Typography>
                            </Grid>

                            {/* Account Info Cards Grid */}
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        background: subscriptionColors.bg,
                                        border: `1px solid ${subscriptionColors.color}30`,
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            fontWeight: 'bold',
                                            display: 'block',
                                            mb: 1,
                                        }}
                                    >
                                        SUBSCRIPTION
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <StarIcon sx={{ color: subscriptionColors.color, fontSize: '1.2rem' }} />
                                        <Typography
                                            variant="h6"
                                            sx={{ color: subscriptionColors.color, fontWeight: 'bold' }}
                                        >
                                            {userInfo?.subscriptionPlan || 'Free'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        background:
                                            userInfo?.accountStatus === 'Active'
                                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))'
                                                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))',
                                        border: `1px solid ${
                                            userInfo?.accountStatus === 'Active' ? '#4caf50' : '#f44336'
                                        }30`,
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            fontWeight: 'bold',
                                            display: 'block',
                                            mb: 1,
                                        }}
                                    >
                                        STATUS
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                bgcolor: userInfo?.accountStatus === 'Active' ? '#4caf50' : '#f44336',
                                                boxShadow: `0 0 10px ${
                                                    userInfo?.accountStatus === 'Active' ? '#4caf50' : '#f44336'
                                                }50`,
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: userInfo?.accountStatus === 'Active' ? '#4caf50' : '#f44336',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {userInfo?.accountStatus || 'Active'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        background:
                                            'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            fontWeight: 'bold',
                                            display: 'block',
                                            mb: 1,
                                        }}
                                    >
                                        MEMBER SINCE
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <CalendarTodayIcon sx={{ fontSize: '1.1rem', color: '#ff9800' }} />
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'white', fontWeight: '500', fontSize: '0.95rem' }}
                                        >
                                            {userInfo?.joinDate ? formatDate(userInfo.joinDate) : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Subscription Expiry (if exists) - Full width */}
                            {userInfo?.subscriptionExpiry && (
                                <Grid item xs={12}>
                                    <Paper
                                        sx={{
                                            background:
                                                'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))',
                                            border: '1px solid rgba(255, 193, 7, 0.3)',
                                            borderRadius: 2,
                                            p: 3,
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #ffc107, #ff9800)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2,
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        fontWeight: 'bold',
                                                        display: 'block',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    SUBSCRIPTION EXPIRES
                                                </Typography>
                                                <Typography variant="h5" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                                                    {formatDate(userInfo.subscriptionExpiry)}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    background: 'linear-gradient(135deg, #ffc107, #ff9800)',
                                                    borderRadius: '50%',
                                                    p: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <CalendarTodayIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>

                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

                        {/* Notification Settings */}
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                            Notification Preferences
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onChange={handleNotificationChange('emailNotifications')}
                                        disabled={updateLoading}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#ff9800',
                                                '& + .MuiSwitch-track': { bgcolor: '#ff9800' },
                                            },
                                        }}
                                    />
                                }
                                label="Email Notifications"
                                sx={{ color: 'white' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.pushNotifications}
                                        onChange={handleNotificationChange('pushNotifications')}
                                        disabled={updateLoading}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#ff9800',
                                                '& + .MuiSwitch-track': { bgcolor: '#ff9800' },
                                            },
                                        }}
                                    />
                                }
                                label="Push Notifications"
                                sx={{ color: 'white' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.newsNotifications}
                                        onChange={handleNotificationChange('newsNotifications')}
                                        disabled={updateLoading}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#ff9800',
                                                '& + .MuiSwitch-track': { bgcolor: '#ff9800' },
                                            },
                                        }}
                                    />
                                }
                                label="News & Updates"
                                sx={{ color: 'white' }}
                            />
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={
                                    updateLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                                }
                                onClick={handleSave}
                                disabled={updateLoading}
                                sx={{
                                    bgcolor: '#ff9800',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#e68900' },
                                    '&:disabled': { bgcolor: 'rgba(255, 152, 0, 0.5)' },
                                }}
                                aria-label="Save profile changes"
                            >
                                {updateLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ProfileSection;
