import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';
import MediaDetail from '@/pages/Media/MediaDetail';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import { useDispatch, useSelector } from 'react-redux';
import { introspect } from '@/redux/features/auth/authSlice';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/media/:mediaId', component: MediaDetail },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
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