import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const navigate = useNavigate();

    // Check if the user is logged in (you can use context, Redux, or localStorage)
    const user = JSON.parse(localStorage.getItem('user')); // Or use context or state to get user

    // If the user is not logged in, redirect them to the login page
    if (!user) {
        navigate('/auth');
        return null;
    }

    // If the user is logged in but doesn't have the required role, redirect them elsewhere
    if (requiredRole && user.role !== requiredRole) {
        navigate('/'); // Or redirect to another page if needed
        return null;
    }

    // If the user is logged in and has the correct role, render the child route
    return children;
};

export default ProtectedRoute;
.1  