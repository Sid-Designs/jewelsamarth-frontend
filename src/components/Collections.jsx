import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import axios from "axios";

const Collections = ({ productData }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check wishlist status on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://api.jewelsamarth.in/api/wishlist/${decoded.id}`
        );

        const isProductWishlisted = response.data.some(
          item => item.productId._id === productData._id
        );

        setIsWishlisted(isProductWishlisted);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [productData._id]);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    setIsAnimating(true);
    const decoded = jwtDecode(token);

    try {
      if (isWishlisted) {
        await axios.delete(
          `https://api.jewelsamarth.in/api/wishlist/remove/${productData._id}`
        );
        setIsWishlisted(false);
        // toast.info("Removed from wishlist");
      } else {
        await axios.post("https://api.jewelsamarth.in/api/wishlist/add", {
          productId: productData._id,
          userId: decoded.id,
        });
        setIsWishlisted(true);
        // toast.success("Added to wishlist");
      }
    } catch (error) {
      // toast.error(
      //   error.response?.data?.message || "Failed to update wishlist"
      // );
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleAddToCart = async () => {
    setClicked(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add products to cart");
      return;
    }

    const decoded = jwtDecode(token);
    try {
      const response = await axios.post("https://api.jewelsamarth.in/api/cart/add", {
        productId: productData._id,
        quantity: 1,
        userId: decoded.id,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  // Responsive product name display
  const getDisplayName = () => {
    const deviceWidth = window.innerWidth;
    if (deviceWidth <= 767) {
      return productData.name.length > 20
        ? `${productData.name.slice(0, 20)}...`
        : productData.name;
    } else if (deviceWidth >= 768 && deviceWidth <= 1024) {
      return productData.name.length > 35
        ? `${productData.name.slice(0, 35)}...`
        : productData.name;
    }
    return productData.name.length > 30
      ? `${productData.name.slice(0, 30)}...`
      : productData.name;
  };

  return (
    <div className="border rounded-[20px] p-4 shadow-md bg-white relative transition-all duration-300 hover:shadow-lg w-80 m-2 md:m-4">
      {/* Heart Button with Smooth Animation */}
      <motion.button
        className="absolute top-2 right-2 z-10"
        onClick={handleWishlistToggle}
        whileTap={{ scale: 0.9 }}
        initial={false}
        animate={{
          scale: isAnimating ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative w-10 h-10 flex items-center justify-center"
          initial={false}
          animate={{
            scale: isWishlisted ? 1 : 0.9,
          }}
        >
          {/* Heart Outline */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              opacity: isWishlisted ? 0 : 1,
              color: "#9ca3af",
              scale: isWishlisted ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </motion.svg>

          {/* Filled Heart */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute w-6 h-6"
            fill="currentColor"
            initial={false}
            animate={{
              opacity: isWishlisted ? 1 : 0,
              color: "var(--primary-color)",
              scale: isWishlisted ? [0.8, 1.1, 1] : 0,
            }}
            transition={{
              duration: 0.5,
              scale: { type: "spring", stiffness: 300, damping: 15 }
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </motion.svg>

          {/* Celebration Particles */}
          {isAnimating && isWishlisted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
              transition={{ duration: 1 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[var(--accent-color)] rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 2],
                    x: Math.cos((i * Math.PI) / 4) * 20,
                    y: Math.sin((i * Math.PI) / 4) * 20,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.button>

      {/* Product Image */}
      <a href={`/products/${productData._id}`}>
        <div
          className="w-full h-48 md:h-48 lg:h-64 overflow-hidden rounded-[15px] cursor-pointer relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={productData.images[0]}
            alt="Product"
            className={`bg-[#efefef] absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"
              }`}
          />
          <img
            src={productData.subImages[1] || productData.images[0]}
            alt="Product Hover"
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"
              }`}
          />
        </div>
      </a>

      {/* Product Info */}
      <div className="text-center mt-4">
        <a href={`/products/${productData._id}`}>
          <h3 className="text-md md:text-xl lg:text-lg font-semibold">
            {getDisplayName()}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-md md:text-2xl lg:text-xl font-semibold text-gray-900">
              ₹{productData.saleprice.toLocaleString()}
            </span>
            <span className="text-gray-500 line-through md:text-md text-sm">
              ₹{productData.regprice.toLocaleString()}
            </span>
          </div>
          <p className="text-gray-600 mt-1 text-sm hidden md:block">
            {productData.productCategory}
          </p>
        </a>

        {/* Add to Cart Button */}

        <button
          onClick={handleAddToCart}
          aria-label="Add to Cart"
          className={`${clicked ? "clicked" : ""
            } addToCartBtn cart-button text-sm sm:text-base mt-3`}
        >
          <span className="add-to-cart">Add to cart</span>
          <span className="added flex justify-center items-center">
            <FaCheck className="mr-2 text-[var(--primary-color)]" />
            Added
          </span>
          <i className="fas fa-shopping-cart"></i>
          <i className="fas fa-box"></i>
        </button>
      </div>

    </div>
  );
};

export default Collections;