'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '@/redux/features/auth/authSlice';
import bgImage from '@/assets/images/bg.jpg';
import Notification from '@/components/Notification/Notification';
import useNotification from '@/hooks/useNotification';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Grid,
    Alert,
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff, Email, Style } from '@mui/icons-material';

export default function Register() {
    const [userData, setUserData] = useState({ username: '', email: '', passwordHash: '' });
    const [showpasswordHash, setShowpasswordHash] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const { notification, showNotification, closeNotification } = useNotification(); // Sử dụng custom hook

    const togglepasswordHashVisibility = () => {
        setShowpasswordHash(!showpasswordHash);
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(register(userData));
        if (register.fulfilled.match(result)) {
            showNotification('Registration successful! Please log in.', 'success'); // Hiển thị thông báo
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng sau 1 giây để người dùng thấy thông báo
            }, 3000);
        }
    };

    // Chuyển hướng nếu đã đăng nhập
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
            }}
        >
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        backgroundColor: 'rgba(18, 18, 18, 0.8)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Register
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            variant="outlined"
                            value={userData.username}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: 'var(--primary)' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                fontSize: '1.2rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '1.2rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: 'var(--primary)' },
                                },
                                '& .MuiOutlinedInput-input': { color: 'white', fontSize: '1.2rem' },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                            value={userData.email}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'var(--primary)' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                fontSize: '1.2rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '1.2rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: 'var(--primary)' },
                                },
                                '& .MuiOutlinedInput-input': { color: 'white', fontSize: '1.2rem' },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="passwordHash"
                            label="Password"
                            type={showpasswordHash ? 'text' : 'passwordHash'}
                            id="passwordHash"
                            autoComplete="current-passwordHash"
                            variant="outlined"
                            value={userData.passwordHash}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'var(--primary)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglepasswordHashVisibility}
                                            edge="end"
                                            sx={{ color: 'var(--primary)' }}
                                        >
                                            {showpasswordHash ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                fontSize: '1.2rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '1.2rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: 'var(--primary)' },
                                },
                                '& .MuiOutlinedInput-input': { color: 'white', fontSize: '1.2rem' },
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, lineHeight: 2, fontSize: 12 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                mb: 3,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                background: 'var(--primary)',
                                '&:hover': {
                                    background: 'var(--primary)',
                                },
                            }}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 0 }}>
                            <Link
                                href="/login"
                                variant="body2"
                                sx={{
                                    fontSize: '1.1rem',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline var(--primary)',
                                    },
                                }}
                            >
                                Login
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Notification notification={notification} closeNotification={closeNotification} />
        </Box>
    );
}
