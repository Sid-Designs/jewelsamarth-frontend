import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "https://api.jewelsamarth.in/api/user/data",
                    {
                        withCredentials: true,
                        headers: { "x-auth-token": token }, // Send token to backend
                    }
                );
                console.log(response.data)

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error("Error verifying user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyUser();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
