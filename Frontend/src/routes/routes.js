import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';
import MediaDetail from '@/pages/Media/MediaDetail';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/media/:mediaId', component: MediaDetail },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };