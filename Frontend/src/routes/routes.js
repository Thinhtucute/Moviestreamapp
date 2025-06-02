import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';
import MediaDetail from '@/pages/Media/MediaDetail';
import GenreDetail from '@/pages/Genre/GenreDetail';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import NewMovies from '@/pages/MediaType/NewMovies';
import Movie from '@/pages/MediaType/Movie';
import Series from '@/pages/MediaType/Series';
import { useDispatch, useSelector } from 'react-redux';
import { introspect } from '@/redux/features/auth/authSlice';
import { compose } from '@reduxjs/toolkit';

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

];
// const ProtectedRoute = ({ children }) => {
//     const dispatch = useDispatch();
//     const { token, isAuthenticated, loading } = useSelector((state) => state.auth);

//     useEffect(() => {
//         if (token) {
//             dispatch(introspect(token));
//         }
//     }, [dispatch, token]);

//     if (!token || (!loading && !isAuthenticated)) {
//         return <Navigate to="/login" />;
//     }

//     return children;
// };
const privateRoutes = [];

export { publicRoutes, privateRoutes };