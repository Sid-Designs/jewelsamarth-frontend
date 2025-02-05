import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, requiredRole }) => {
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
                        headers: { "x-auth-token": token },
                    }
                );

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                const userRole = response.data.data.role; // Assuming backend returns role
                console.log("User Role:", userRole);

                if (requiredRole && userRole !== requiredRole) {
                    throw new Error("Unauthorized");
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error("Error verifying user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyUser();
    }, [requiredRole]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
