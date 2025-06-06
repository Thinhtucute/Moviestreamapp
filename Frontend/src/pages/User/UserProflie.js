import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar,
    useTheme,
    useMediaQuery,
    Chip,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/features/auth/authSlice';
import axios from 'axios';
import avatar from '@/assets/images/avatar.jpg';

// Import icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Import components for each section
import FavoriteSection from './FavoriteSection';
import KeepWatchingSection from './KeepWatchingSection';
import ProfileSection from './ProfileSection ';
import SettingsSection from './SettingsSection';

const menuItems = [
    {
        id: 'favorites',
        label: 'My Favorites',
        icon: <FavoriteBorderIcon />,
        component: FavoriteSection,
    },
    {
        id: 'keep-watching',
        label: 'Keep Watching',
        icon: <VisibilityIcon />,
        component: KeepWatchingSection,
    },
    {
        id: 'profile',
        label: 'Profile Settings',
        icon: <PersonOutlineIcon />,
        component: ProfileSection,
    },
    {
        id: 'settings',
        label: 'App Settings',
        icon: <SettingsIcon />,
        component: SettingsSection,
    },
];

function UserProfile() {
    const [activeSection, setActiveSection] = useState('favorites');
    const { user } = useSelector((state) => state.auth);
    const [userInfo, setUserInfo] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // Fetch user info từ API
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                console.log('🔄 Starting fetchUserInfo...');
                setUserLoading(true);
                const token = localStorage.getItem('token');

                console.log('🔑 Token exists:', !!token);
                // console.log('🔐 Auth state:', { user, isAuthenticated });

                if (!token) {
                    console.error('❌ No token found');
                    setError('No authentication token found');
                    return;
                }

                console.log('📡 Making API call...');
                const response = await axios.get(`${apiUrl}/users/myInfo`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                console.log('✅ API Response:', response.data);

                if (response.data && response.data.code === 0) {
                    setUserInfo(response.data.result);
                    setError(null);
                } else {
                    setError('Failed to fetch user information');
                }
            } catch (err) {
                console.error('💥 API Error:', err);
                setError(err.response?.data?.message || 'Failed to fetch user information');
            } finally {
                setUserLoading(false);
            }
        };

        // Gọi API ngay khi component mount, không cần đợi user state
        console.log('🎯 useEffect triggered');
        const token = localStorage.getItem('token');

        if (token) {
            fetchUserInfo();
        } else {
            console.log('❌ No token, setting loading false');
            setUserLoading(false);
        }
    }, []); // Bỏ dependency user

    const handleMenuClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Helper function để format subscription plan
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

    // Helper function để format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const ActiveComponent = menuItems.find((item) => item.id === activeSection)?.component || FavoriteSection;
    const subscriptionColors = getSubscriptionColor(userInfo?.subscriptionPlan);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#000',
                padding: '100px 30px 40px',
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '320px 1fr',
                        gap: 3,
                        minHeight: 'calc(100vh - 120px)',
                    }}
                >
                    {/* Left Sidebar */}
                    <Paper
                        elevation={3}
                        sx={{
                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                            border: '1px solid rgba(255, 165, 0, 0.2)',
                            borderRadius: 2,
                            height: 'fit-content',
                            backdropFilter: 'blur(10px)',
                            position: isMobile ? 'static' : 'sticky',
                            top: 100,
                        }}
                    >
                        {/* User Info Header */}
                        <Box
                            sx={{
                                padding: 3,
                                textAlign: 'center',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Avatar
                                src={avatar || '/default-avatar.jpg'}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    margin: '0 auto 15px',
                                    border: '3px solid #ff9800',
                                    boxShadow: '0 4px 20px rgba(255, 165, 0, 0.3)',
                                }}
                            />

                            {userLoading ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} sx={{ color: '#ff9800' }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Loading profile...
                                    </Typography>
                                </Box>
                            ) : error ? (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: '#f44336', marginBottom: 1 }}>
                                        Failed to load profile
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                        {error}
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            marginBottom: 0.5,
                                        }}
                                    >
                                        {userInfo?.username || user?.username || 'User Name'}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            marginBottom: 2,
                                        }}
                                    >
                                        {userInfo?.email || user?.email || 'user@example.com'}
                                    </Typography>

                                    {/* Subscription Plan Chip */}
                                    <Chip
                                        icon={<StarIcon sx={{ fontSize: '16px !important' }} />}
                                        label={userInfo?.subscriptionPlan || 'Free'}
                                        size="small"
                                        sx={{
                                            backgroundColor: subscriptionColors.bg,
                                            color: subscriptionColors.color,
                                            fontWeight: 'bold',
                                            marginBottom: 1,
                                            '& .MuiChip-icon': {
                                                color: subscriptionColors.color,
                                            },
                                        }}
                                    />


                                    {/* Subscription Expiry */}
                                    {userInfo?.subscriptionExpiry && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 0.5,
                                                mt: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: '0.7rem',
                                                }}
                                            >
                                                Expires: {formatDate(userInfo.subscriptionExpiry)}
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>

                        {/* Navigation Menu */}
                        <List sx={{ padding: '10px 0' }}>
                            {menuItems.map((item) => (
                                <ListItem
                                    key={item.id}
                                    button
                                    onClick={() => handleMenuClick(item.id)}
                                    sx={{
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        backgroundColor:
                                            activeSection === item.id ? 'rgba(255, 165, 0, 0.2)' : 'transparent',
                                        borderLeft:
                                            activeSection === item.id ? '4px solid #ff9800' : '4px solid transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                            transform: 'translateX(5px)',
                                            '& .MuiListItemIcon-root': {
                                                color: '#ff9800',
                                                transform: 'scale(1.1)',
                                            },
                                        },
                                        cursor: 'pointer',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: activeSection === item.id ? '#ff9800' : 'rgba(255, 255, 255, 0.8)',
                                            minWidth: 40,
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color:
                                                    activeSection === item.id ? '#ff9800' : 'rgba(255, 255, 255, 0.9)',
                                                fontWeight: activeSection === item.id ? 'bold' : 500,
                                                fontSize: '0.95rem',
                                                transition: 'all 0.3s ease',
                                            },
                                        }}
                                    />
                                </ListItem>
                            ))}

                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '10px 0' }} />

                            {/* Logout Button */}
                            <ListItem
                                button
                                onClick={handleLogout}
                                sx={{
                                    margin: '0 10px',
                                    borderRadius: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                        transform: 'translateX(5px)',
                                        '& .MuiListItemIcon-root': {
                                            color: '#f44336',
                                        },
                                        '& .MuiTypography-root': {
                                            color: '#f44336',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'rgba(244, 67, 54, 0.8)',
                                        minWidth: 40,
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Logout"
                                    sx={{
                                        '& .MuiTypography-root': {
                                            color: 'rgba(244, 67, 54, 0.9)',
                                            fontWeight: 500,
                                            fontSize: '0.95rem',
                                            transition: 'all 0.3s ease',
                                        },
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Paper>

                    {/* Right Content Area */}
                    <Paper
                        elevation={2}
                        sx={{
                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
                            border: '1px solid rgba(255, 165, 0, 0.1)',
                            borderRadius: 2,
                            padding: { xs: 2.5, md: 4 },
                            minHeight: 600,
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <ActiveComponent userInfo={userInfo} />
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}

export default UserProfile;
