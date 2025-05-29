import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to home page
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-[55vh] flex items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 border mb-4">
          <LogOut className="h-6 w-6 text-[var(--primary-color)]" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">Log out?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to log out of your account?
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-[20px] bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-[20px] bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-color)]"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;