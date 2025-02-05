import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

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
    const verifyUser = async () => {
        const res = await axios.get("https://api.jewelsamarth.in/api/user/data", { withCredentials: true })
        console.log(res.data)
    }

    return children;
};

export default ProtectedRoute;
