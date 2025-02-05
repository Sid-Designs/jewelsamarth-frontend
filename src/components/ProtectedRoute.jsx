import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const decodeToken = (token) => {
  if (!token) return null;

  const base64Url = token.split('.')[1];
  if (!base64Url) return null;

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
};

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
        const decodedToken = decodeToken(token);
        if (!decodedToken) {
          throw new Error('Invalid token');
        }
        const userId = decodedToken.id;

        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('User not found');
        }

        const userData = await response.json();

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
