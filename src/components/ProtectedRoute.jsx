import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children, role }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                if (!decodedToken || !decodedToken.id) {
                    throw new Error('Invalid token');
                }

                const response = await axios.post(
                    'https://api.jewelsamarth.in/api/user/data',
                    {},
                    { withCredentials: true, headers: { 'x-auth-token': token } }
                );

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                const userData = response.data.data;

                if (role && userData.role !== role) {
                    setIsLoading(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Error verifying user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyUser();
    }, [role]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
