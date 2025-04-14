import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';
import MediaDetail from '@/pages/Media/MediaDetail';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/media/:mediaId', component: MediaDetail },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };