import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const message = params.get('message');
        if (message) {
            toast.success(message);
        }
    }, [location]);

    return (
        <>
            <Helmet>
                <title>Jewel Samarth | Silver Collections</title>
            </Helmet>
            <Carousel />
            <ToastContainer
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

export default Home;
