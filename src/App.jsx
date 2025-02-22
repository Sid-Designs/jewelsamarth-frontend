import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import Navbar from '@/components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import CategoryPage from './pages/CollectionsPage';
import SingleCollection from './components/SingleCollection';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';

const App = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get(
                    "https://api.jewelsamarth.in/api/user/data",
                    {
                        withCredentials: true,
                        headers: { "x-auth-token": token },
                    }
                );

                if (response.data.success) {
                    setUser(response.data.data); // Save user data (including role)
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const handleUserChange = (userData) => {
        setUser(userData);
    };

    const noNavbarFooterRoutes = ['/dashboard'];

    return (
        <>
            {!noNavbarFooterRoutes.includes(location.pathname) && (
                <Navbar loggedIn={!!user} onUserChange={handleUserChange} />
            )}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <PageTransition>
                                <Home />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/auth"
                        element={
                            <PageTransition>
                                <Authentication onUserChange={handleUserChange} />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/auth/verify-email"
                        element={
                            <PageTransition>
                                <EmailVerification />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/auth/reset-password"
                        element={
                            <PageTransition>
                                <ResetPassword />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            // <ProtectedRoute requiredRole="admin">
                            //     <PageTransition>
                            //         <Dashboard />
                            //     </PageTransition>
                            // </ProtectedRoute>
                            <PageTransition>
                                <Dashboard />
                            </PageTransition>
                        }
                    />
                    <Route path="/collections/:collectionName" element={
                        <PageTransition>
                            <CategoryPage />
                        </PageTransition>
                    }
                    />
                    <Route path="/products/:id" element={
                        <PageTransition>
                            <SingleCollection />
                        </PageTransition>
                    }
                    />
                    <Route path="/cart" element={
                        <PageTransition>
                            <Cart />
                        </PageTransition>
                    }
                    />
                    <Route path="/checkout" element={
                        <PageTransition>
                            <Checkout />
                        </PageTransition>
                    }
                    />
                    <Route path="/payment" element={
                        <PageTransition>
                            <Payment />
                        </PageTransition>
                    }
                    />
                    <Route
                        path="*"
                        element={
                            <PageTransition>
                                <h1>Error</h1>
                            </PageTransition>
                        }
                    />
                </Routes>
            </AnimatePresence>
            {!noNavbarFooterRoutes.includes(location.pathname) && <Footer />}
        </>
    );
};

export default App;
