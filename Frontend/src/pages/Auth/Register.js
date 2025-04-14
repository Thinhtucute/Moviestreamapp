'use client';

import { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, IconButton } from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import bgImage from '@/assets/images/bg.jpg';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: "url('" + bgImage + "')",
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
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            }}
        >
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4, // Tăng padding
                        backgroundColor: 'rgba(18, 18, 18, 0.8)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Đăng Ký
                    </Typography>

                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Họ và tên"
                            name="name"
                            autoComplete="name"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: 'var(--primary)' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                fontSize: '1.2rem', // Tăng kích thước chữ
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '1.2rem', // Tăng kích thước label
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: 'var(--primary)' },
                                },
                                '& .MuiOutlinedInput-input': { color: 'white', fontSize: '1.2rem' }, // Tăng kích thước chữ trong ô nhập
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
                            name="password"
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                mb: 3,
                                py: 1.5, // Tăng chiều cao nút
                                fontSize: '1.1rem', // Tăng kích thước chữ
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                background: 'var(--primary)',
                                '&:hover': {
                                    background: 'var(--primary)',
                                },
                            }}
                        >
                            Đăng Ký
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Đã có tài khoản?{' '}
                                <Link
                                    href="/login"
                                    variant="body2"
                                    sx={{
                                        fontSize: '1.1rem', // Tăng kích thước chữ
                                        color: 'var(--primary)',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline var(--primary)',
                                        },
                                    }}
                                >
                                    Đăng nhập
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
