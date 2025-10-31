import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@/services/authServices';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Async thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authApi.login(credentials);
        console.log('Login API response:', response);
        if (response.code === 1000) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        console.error('Login API error:', error);
        return rejectWithValue(error.response?.data || { message: 'Network connection error' });
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await authApi.register(userData);
        if (response.code === 1000) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network connection error' });
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
        return rejectWithValue(error.response?.data || { message: 'Network connection error' });
    }
});

export const refresh = createAsyncThunk('auth/refresh', async (token, { rejectWithValue }) => {
    try {
        const response = await authApi.refreshToken(token);
        if (response.code === 1000) {
            return response.result;
        }
        return rejectWithValue(response);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network connection error' });
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
        return rejectWithValue(error.response?.data || { message: 'Network connection error' });
    }
});

export const verifyToken = createAsyncThunk('auth/verifyToken', async (_, { getState, rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue({ message: 'No token found' });
        }

        const response = await authApi.introspect(token);
        if (response.code === 1000 && response.result.valid) {
            return { token, authenticated: true, valid: response.result.valid };
        }
        return rejectWithValue({ message: 'Invalid token' });
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Token verification error' });
    }
});

export const checkToken = createAsyncThunk('auth/checkToken', async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.token || localStorage.getItem('token');

    if (!token) {
        return rejectWithValue({ message: 'No token found' });
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Valid-duration: 36000s (10h)
        if (decoded.exp < currentTime) {
            // Refreshable-duration: 360000s (100h)
            const issuedAt = decoded.iat;
            if (currentTime - issuedAt > 360000) {
                return rejectWithValue({ message: 'Token can no longer be refreshed' });
            }
            const response = await dispatch(refresh(token)).unwrap();
            return response;
        }
        return { token, authenticated: true };
    } catch (error) {
        return rejectWithValue({ message: 'Invalid token' });
    }
});

// Add new thunk to fetch current user info
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue({ message: 'No token found' });
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${apiUrl}/users/myInfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        if (response.data && response.data.code === 1000) {
            return response.data.result;
        }
        return rejectWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch user info' });
    }
});

// Initial state with proper initialization
const getInitialState = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    
    try {
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user'); // Remove invalid data
    }

    return {
        token: token || null,
        isAuthenticated: false,
        user: user,
        loading: false,
        error: null,
    };
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        clearAuthState: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.loading = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        clearError: (state) => {
            state.error = null;
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
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = action.payload?.message || 'Login failed';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                console.log('Login rejected payload:', action.payload);
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.authenticated;
                state.user = action.payload.user || null;
                state.error = null;
                localStorage.setItem('token', action.payload.token);
                if (action.payload.user) {
                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
            });

        // Verify Token
        builder
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.authenticated;
                state.error = null;
            })
            .addCase(verifyToken.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload?.message || 'Invalid token';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
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
                state.error = action.payload?.message || 'Token introspection failed';
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
                state.user = null;
                state.error = action.payload?.message || 'Token refresh failed';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
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
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload?.message || 'Logout failed';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });

        // Check Token
        builder
            .addCase(checkToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.authenticated;
                state.error = null;
            })
            .addCase(checkToken.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload?.message || 'Token check failed';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });

        // Fetch Current User
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch user info';
            });
    },
});

export const { clearAuthState, setUser, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;