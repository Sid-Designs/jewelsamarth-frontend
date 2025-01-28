import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthTabs } from '../components/AuthTabs';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import SuccessAnimation from '@/components/SuccessAnimation';

const AuthPage = ({ onUserChange }) => {
    const [formData, setFormData] = useState({ username: localStorage.getItem('username') || '', email: localStorage.getItem('email') || '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('defaultTab');
        if (tab && (tab === 'login' || tab === 'signup')) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleNewUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await axios.post('https://api.jewelsamarth.in/api/auth/register', formData, { withCredentials: true });
            if (res.data.success) {
                localStorage.setItem('username', res.data.user.username);
                localStorage.setItem('email', res.data.user.email);
                localStorage.setItem('auth', res.data.user.isAccountVerified);
                localStorage.setItem('token', res.data.token);
                setShowSuccess(true);
                onUserChange(true);
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 3000); // Wait for animation to complete before navigating
            } else {
                setErrorMessage(res.data.message); // Display error message on the same page
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleExistUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await axios.post('https://api.jewelsamarth.in/api/auth/login', formData, { withCredentials: true });
            if (res.data.success) {
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('auth', res.data.auth);
                setShowSuccess(true);
                onUserChange(true);
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Wait for animation to complete before navigating
            } else {
                setErrorMessage(res.data.message); // Display error message on the same page
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign Up / Log In | Jewel Samarth</title>
            </Helmet>
            <div className='h-fit w-full flex justify-center items-center my-4 md:my-14'>
                {showSuccess ? (
                    <div className="centered-animation">
                        <SuccessAnimation />
                    </div>
                ) : (
                    <AuthTabs
                        formData={formData}
                        setFormData={setFormData}
                        signUp={handleNewUser}
                        logIn={handleExistUser}
                        defaultActiveTab={activeTab}
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                    />
                )}
            </div>
            <ToastContainer
                stacked
                position="bottom-right"
                autoClose={3000}
                limit={3}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default AuthPage;
