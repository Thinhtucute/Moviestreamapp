import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
