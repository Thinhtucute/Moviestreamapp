import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '@/routes/routes';
import { DefaultLayout } from '@/components/Layout'; // Ensure this path is correct

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout || DefaultLayout; // Default layout nếu không có layout
                        const Page = route.component;

                        // Nếu không có layout thì không bọc trong Layout
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    route.layout === null ? (
                                        <Page /> // Nếu layout là null, chỉ render component
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
