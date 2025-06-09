import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/routes';
import DefaultLayout from './components/Layout/DefaultLayout/DefaultLayout';
import { useDispatch } from 'react-redux';
import { verifyToken } from '@/redux/features/auth/authSlice'; // Import action to verify token


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(verifyToken()); // Verify token nếu có
        }
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}

                    {/* Private Routes */}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        const ProtectedRoute = route.protectedRoute;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={`private-${index}`}
                                path={route.path}
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                        );
                    })}

                    {/* 404 Route */}
                    <Route
                        path="*"
                        element={
                            <DefaultLayout>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '80vh',
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    <h1>404 - Page Not Found</h1>
                                    <p>The page you are looking for does not exist.</p>
                                </div>
                            </DefaultLayout>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
