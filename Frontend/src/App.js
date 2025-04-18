import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '@/routes/routes';
import { DefaultLayout } from '@/components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkToken } from '@/redux/features/auth/authSlice';

function App() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    // Kiểm tra token khi ứng dụng khởi động
    useEffect(() => {
        if (token) {
            dispatch(checkToken());
        }
    }, [dispatch, token]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout || DefaultLayout;
                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    route.layout === null ? (
                                        <Page />
                                    ) : (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    )
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
