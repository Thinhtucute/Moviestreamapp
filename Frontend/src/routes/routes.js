import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkToken } from '@/redux/features/auth/authSlice';
import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';
import MediaDetail from '@/pages/Media/MediaDetail';
import GenreDetail from '@/pages/Genre/GenreDetail';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import NewMovies from '@/pages/MediaType/NewMovies';
import Movie from '@/pages/MediaType/Movie';
import Series from '@/pages/MediaType/Series';
import Animation from '@/pages/MediaType/Animation';
import MediaStream from '@/pages/MediaStream/MediaStream'; // Import MediaStream
import SubscriptionPage from '@/pages/SubscriptionPage/SubscriptionPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { token, isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(checkToken());
        }
    }, [dispatch, token]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: 'var(--black)',
                    color: 'white',
                }}
            >
                Checking authentication...
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!token || !isAuthenticated) {
        // Save current path for redirect after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public routes - không cần đăng nhập
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/media/:mediaId', component: MediaDetail },
    { path: '/genre/:genreName', component: GenreDetail },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/new-movies', component: NewMovies },
    { path: '/movies', component: Movie },
    { path: '/series', component: Series },
    { path: '/animation', component: Animation },
];

// Private routes - cần đăng nhập
const privateRoutes = [
    {
        path: '/watch/:mediaId',
        component: MediaStream,
        protectedRoute: ProtectedRoute, // Thêm protection
    },
    {
        path: '/subscription',
        component: SubscriptionPage,
        protectedRoute: ProtectedRoute,
    },

    // Có thể thêm các trang khác cần đăng nhập ở đây
    // { path: '/profile', component: Profile, protectedRoute: ProtectedRoute },
    // { path: '/favorites', component: Favorites, protectedRoute: ProtectedRoute },
];

export { publicRoutes, privateRoutes, ProtectedRoute };
