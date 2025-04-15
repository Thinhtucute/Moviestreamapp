import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@/services/authServices';
import { jwtDecode } from 'jwt-decode';

// Async thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authApi.login(credentials);
        console.log('Login API response:', response); // Debug response từ API
        if (response.code === 1000) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        console.error('Login API error:', error); // Debug lỗi mạng
        return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối mạng' });
    }
});

// Các thunk khác giữ nguyên
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await authApi.register(userData);
        // console.log('Login API response:', response); // Debug response từ API
        if (response.code === 1000) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối mạng' });
    }
});

export const introspect = createAsyncThunk('auth/introspect', async (token, { rejectWithValue }) => {
    try {
        const response = await authApi.introspect(token);
        if (response.code === 1000) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối mạng' });
    }
});

export const refresh = createAsyncThunk('auth/refresh', async (token, { rejectWithValue }) => {
    try {
        const response = await authApi.refreshToken(token);
        if (response.code === 0) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối mạng' });
    }
});

export const logout = createAsyncThunk('auth/logout', async (token, { rejectWithValue }) => {
    try {
        const response = await authApi.logout(token);
        if (response.code === 1000) {
            return response;
        }
        return rejectWithValue(response);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối mạng' });
    }
});

export const checkToken = createAsyncThunk('auth/checkToken', async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue({ message: 'Không có token' });

    try {
        const decoded = jwtDecode(auth.token);
        const currentTime = Date.now() / 1000;

        // valid-duration: 36000s (10 giờ)
        if (decoded.exp < currentTime) {
            // refreshable-duration: 360000s (100 giờ)
            const issuedAt = decoded.iat;
            if (currentTime - issuedAt > 360000) {
                return rejectWithValue({ message: 'Token không còn có thể làm mới' });
            }
            const response = await dispatch(refresh(auth.token)).unwrap();
            return response;
        }
        return { token: auth.token, authenticated: true };
    } catch (error) {
        return rejectWithValue({ message: 'Token không hợp lệ' });
    }
});

// Initial state
const initialState = {
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthState: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.authenticated;
                state.user = null;
                state.error = null;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload.message || 'Đăng nhập thất bại';
                console.log('Login rejected payload:', action.payload); // Debug payload
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Đăng ký thất bại';
            });

        // Introspect
        builder
            .addCase(introspect.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(introspect.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload.valid;
                state.error = null;
            })
            .addCase(introspect.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload.message || 'Kiểm tra token thất bại';
            });

        // Refresh
        builder
            .addCase(refresh.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refresh.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.authenticated;
                state.error = null;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(refresh.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload.message || 'Làm mới token thất bại';
                localStorage.removeItem('token');
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('token');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Đăng xuất thất bại';
            });

        // Check Token
        builder
            .addCase(checkToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.authenticated;
                state.error = null;
            })
            .addCase(checkToken.rejected, (state, action) => {
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload.message || 'Kiểm tra token thất bại';
                localStorage.removeItem('token');
            });
    },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
