import Home from '@/pages/Home';
import Search from '@/pages/Search';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
