import React, { useState } from 'react';
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

const App = () => {
    const location = useLocation();
    const [user, setUser] = useState(false);

    const handleUserChange = (userState) => {
        setUser(userState);
    };

    const noNavbarFooterRoutes = ['/dashboard'];

    return (
        <>
            {!noNavbarFooterRoutes.includes(location.pathname) && (
                <Navbar loggedIn={user} onUserChange={handleUserChange} />
            )}
            <AnimatePresence exitBeforeEnter>
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
                            <PageTransition>
                                <Dashboard />
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
