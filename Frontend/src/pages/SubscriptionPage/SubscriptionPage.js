import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import axios from 'axios';
import { updateUser, fetchCurrentUser } from '@/redux/features/auth/authSlice';
import useNotification from '@/hooks/useNotification';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: '0 $',
        period: '/month',
        features: [
            'Limited content access',
            'SD video quality',
            'With advertisements',
            '1 device can stream simultaneously',
            'Basic support',
        ],
        buttonText: 'Free',
        color: '#6b7280',
        icon: <MoneyOffIcon />,
        popular: false,
        description: 'Basic experience for beginners',
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '99.000 $',
        period: '/month',
        features: [
            'All movies and shows',
            'Full HD video quality',
            'No ads',
            '2 devices simultaneously',
            'Priority support',
            'Download to watch offline',
        ],
        buttonText: 'Choose Premium',
        color: 'var(--primary)',
        icon: <StarIcon />,
        popular: true,
        description: 'Most popular choice for families',
    },
    {
        id: 'vip',
        name: 'VIP',
        price: '199.000 $',
        period: '/month',
        features: [
            'All exclusive content',
            '4K + HDR video quality',
            'No ads',
            '4 devices simultaneously',
            '24/7 VIP support',
            'Unlimited downloads',
            'Early access to new releases',
            'Exclusive content',
        ],
        buttonText: 'Choose VIP',
        color: '#dc2626',
        icon: <DiamondIcon />,
        popular: false,
        description: 'Ultimate premium experience',
    },
];

const StyledCard = styled(Card)(({ plancolor, popular }) => ({
    minHeight: 500,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--second-black)',
    border: popular ? `3px solid ${plancolor}` : `2px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: '16px',
    position: 'relative',
    transition: 'all 0.3s ease',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        border: `3px solid ${plancolor}`,
    },
}));

const SubscriptionPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const handleSubscribe = async (planId, planName) => {
        if (!isAuthenticated) {
            sessionStorage.setItem('intendedSubscription', planId);
            sessionStorage.setItem('redirectAfterLogin', '/subscription');
            navigate('/login');
            return;
        }

        if (planId === 'free') {
            showNotification('Bạn đang sử dụng gói Free!', 'info');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            // Map planId to SubscriptionPlan enum value
            const subscriptionPlan = planId === 'vip' ? 'VIP' : 
                                  planId === 'premium' ? 'Premium' : 
                                  'Free';

            const response = await axios.put(
                `${apiUrl}/users/myInfo/subscription`,
                {
                    subscriptionPlan,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data && response.data.code === 1000) {
                // Update user info in Redux store
                await dispatch(updateUser({ subscription: subscriptionPlan }));
                showNotification({
                    message: `Bạn đã mua gói ${planName} thành công!`,
                    severity: 'success',
                    duration: 2000
                });
                
                // Add delay before reloading to show notification
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error(response.data?.message || 'Không thể cập nhật gói đăng ký');
            }
        } catch (err) {
            console.error('Failed to update subscription:', err);
            setError(err.response?.data?.message || err.message || 'Không thể cập nhật gói đăng ký');
            showNotification('Không thể cập nhật gói đăng ký', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--black) 0%, var(--second-black) 100%)',
                paddingTop: '80px',
            }}
        >
            <Container maxWidth="lg" sx={{ py: 8 }}>
                {/* Header Section */}
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        Choose a Subscription Plan
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 4,
                            fontSize: { xs: '1.1rem', md: '1.5rem' },
                        }}
                    >
                        Discover an unlimited world of entertainment with flexible plans
                    </Typography>

                    {/* Current User Status */}
                    {isAuthenticated && (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                border: '1px solid rgba(255, 165, 0, 0.3)',
                                borderRadius: '20px',
                                px: 3,
                                py: 1,
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ color: 'white' }}>Current Plan:</Typography>
                            <Chip
                                label={user?.subscription || 'FREE'}
                                size="small"
                                sx={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            maxWidth: '600px',
                            mx: 'auto',
                            mb: 4,
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            color: 'white',
                            '& .MuiAlert-icon': {
                                color: '#f44336',
                            },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Plans Grid */}
                <Grid container spacing={4} justifyContent="center">
                    {plans.map((plan) => (
                        <Grid item xs={12} sm={6} lg={4} key={plan.id}>
                            <StyledCard plancolor={plan.color} popular={plan.popular}>
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: plan.color,
                                            color: 'white',
                                            px: 3,
                                            py: 1,
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            minWidth: 120,
                                        }}
                                    >
                                        MOST POPULAR
                                    </Box>
                                )}

                                <CardContent sx={{ flex: 1, p: 3 }}>
                                    {/* Plan Header */}
                                    <Box textAlign="center" mb={3}>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                backgroundColor: plan.color,
                                                color: 'white',
                                                mb: 2,
                                            }}
                                        >
                                            {plan.icon}
                                        </Box>

                                        <Typography
                                            variant="h4"
                                            component="h3"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                mb: 1,
                                            }}
                                        >
                                            {plan.name}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                mb: 2,
                                            }}
                                        >
                                            {plan.description}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                justifyContent: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    color: plan.color,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {plan.price}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                }}
                                            >
                                                {plan.period}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Features List */}
                                    <List dense sx={{ mb: 3 }}>
                                        {plan.features.map((feature, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckCircleIcon
                                                        sx={{
                                                            color: plan.color,
                                                            fontSize: '1.2rem',
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature}
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            color: 'white',
                                                            fontSize: '0.9rem',
                                                        },
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>

                                {/* Subscribe Button */}
                                <Box sx={{ p: 3, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={() => handleSubscribe(plan.id, plan.name)}
                                        disabled={loading || (isAuthenticated && user?.subscription === plan.name.toUpperCase())}
                                        sx={{
                                            backgroundColor: plan.color,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            py: 1.5,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            '&:hover': {
                                                backgroundColor: plan.color,
                                                filter: 'brightness(0.9)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:disabled': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                color: 'rgba(255, 255, 255, 0.5)',
                                            },
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : isAuthenticated && user?.subscription === plan.name.toUpperCase() ? (
                                            'Current Plan'
                                        ) : (
                                            plan.buttonText
                                        )}
                                    </Button>
                                </Box>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Bottom CTA */}
                <Box textAlign="center" mt={8}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 2,
                        }}
                    >
                        You can cancel your subscription at any time. No long-term commitment.
                    </Typography>

                    {!isAuthenticated && (
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                color: 'white',
                                borderColor: 'var(--primary)',
                                px: 4,
                                py: 1.5,
                                borderRadius: '12px',
                                '&:hover': {
                                    borderColor: '#e55b00',
                                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                },
                            }}
                        >
                            Log In to Get Started
                        </Button>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default SubscriptionPage;

