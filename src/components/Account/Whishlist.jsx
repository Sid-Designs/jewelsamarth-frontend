import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiHeart, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null); // Track which item is being removed
  const [clearingAll, setClearingAll] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState(null); // Track which item is being added to cart

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://api.jewelsamarth.in/api/wishlist/${decoded.id}`
        );
        setWishlistItems(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    setRemovingId(productId); // Set the specific product being removed
    try {
      await axios.delete(
        `https://api.jewelsamarth.in/api/wishlist/remove/${productId}`
      );
      setWishlistItems(prev => prev.filter(item => item.productId._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null); // Reset after operation
    }
  };

  const handleClearAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    setClearingAll(true);
    try {
      const decoded = jwtDecode(token);
      await axios.delete(
        `https://api.jewelsamarth.in/api/wishlist/clear/${decoded.id}`
      );
      setWishlistItems([]);
      toast.success('Cleared all wishlist items');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setClearingAll(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add products to cart');
      return;
    }

    setAddingToCartId(productId); // Set the specific product being added
    try {
      const decoded = jwtDecode(token);
      const response = await axios.post("https://api.jewelsamarth.in/api/cart/add", {
        productId: productId,
        quantity: 1,
        userId: decoded.id,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCartId(null); // Reset after operation
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.8 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5
            }}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-2xl bg-white shadow-sm border border-gray-100"
          >
            {/* Image Skeleton */}
            <div className="w-full sm:w-32 flex-shrink-0 mr-4 mb-3 sm:mb-0">
              <div className="w-full h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="w-full flex-grow space-y-3">
              <div className="h-6 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-full w-1/2 animate-pulse"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-[20px] w-24 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 rounded-2xl bg-white shadow-sm">
        <FiHeart className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">Your wishlist is empty</h3>
        <p className="text-gray-500 mt-1">You haven't added any items to your wishlist yet</p>
        <a
          href="/collections"
          className="mt-4 px-6 py-2 bg-[var(--accent-color)] text-white hover:bg-[var(--primary-color)] rounded-[20px] transition-colors"
        >
          Browse Collections
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Wishlist ({wishlistItems.length})
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearAll}
          disabled={clearingAll}
          className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--primary-color)] text-white px-4 py-2 rounded-[20px] transition-colors"
        >
          <FiX size={18} />
          {clearingAll ? 'Clearing...' : 'Clear All'}
        </motion.button>
      </div>

      <div className="w-full space-y-4">
        <ToastContainer position="bottom-right" autoClose={3000} />

        {wishlistItems.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-2xl bg-white shadow-sm border border-gray-100"
          >
            <div className="w-full sm:w-32 flex-shrink-0 mr-4 mb-3 sm:mb-0">
              <img
                className="w-full h-32 object-cover rounded-xl"
                src={item.productId.images?.[0] || "https://via.placeholder.com/150"}
                alt={item.productId.name || "Product"}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>

            <div className="w-full flex-grow">
              <h3 className="font-medium text-gray-900">{item.productId.name || "Product Name"}</h3>

              <div className="flex items-center mt-1">
                <span className="text-lg">₹</span>
                <span className="font-bold text-lg font-semibold">
                  {item.productId.saleprice?.toLocaleString() || '0'}
                </span>
                {item.productId.regprice > item.productId.saleprice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{item.productId.regprice?.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="w-full flex justify-between items-center mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-sm text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveItem(item.productId._id)}
                  disabled={removingId === item.productId._id}
                >
                  <FiTrash2 className="mr-1" />
                  {removingId === item.productId._id ? 'Removing...' : 'Remove'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(item.productId._id)}
                  disabled={addingToCartId === item.productId._id}
                  className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-[20px] text-sm font-medium hover:bg-[var(--primary-color)] transition-colors"
                >
                  {addingToCartId === item.productId._id ? 'Adding...' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;