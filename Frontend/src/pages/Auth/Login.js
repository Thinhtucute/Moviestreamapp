'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '@/redux/features/auth/authSlice';
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
import { Person, Lock, Visibility, VisibilityOff, Style } from '@mui/icons-material';


export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const { notification, showNotification, closeNotification } = useNotification(); // Sử dụng custom hook

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login(credentials));
        if (login.fulfilled.match(result)) {
            showNotification('Đăng ký nhập thành công!', 'success'); // Hiển thị thông bá0
            setTimeout(() => {
                navigate('/'); // Chuyển hướng sau 1 giây để người dùng thấy thông báo
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
                        Đăng Nhập
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Tên đăng nhập"
                            name="username"
                            autoComplete="username"
                            variant="outlined"
                            value={credentials.username}
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
                            name="password"
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            value={credentials.password}
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
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            sx={{ color: 'var(--primary)' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
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

                        <Grid container sx={{ mb: 3 }}>
                            <Grid item xs>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value="remember"
                                            color="primary"
                                            sx={{
                                                color: 'white',
                                                '&.Mui-checked': {
                                                    color: 'var(--primary)',
                                                },
                                            }}
                                        />
                                    }
                                    label="Ghi nhớ đăng nhập"
                                    sx={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)' }}
                                />
                            </Grid>
                            <Grid item>
                                <Link
                                    href="#"
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
                                    Quên mật khẩu?
                                </Link>
                            </Grid>
                        </Grid>

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
                            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Chưa có tài khoản?{' '}
                                <Link
                                    href="/register"
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
                                    Đăng ký ngay
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Notification notification={notification} closeNotification={closeNotification} />
        </Box>
    );
}
