import React, { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import "../assets/styles/CollectionsPage.css";
import { ToastContainer, toast } from 'react-toastify';
import jwtDecode from "jwt-decode";
import axios from "axios";

const Collections = (productData) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const mainImg = productData.productData.images[0];
  const subImg = productData.productData.subImages[1];
  const productName = productData.productData.name;

  let displayName;
  const deviceWidth = window.innerWidth;
  if (deviceWidth <= 767) {
    displayName =
      productName.length > 20 ? `${productName.slice(0, 20)}...` : productName;
  } else if (deviceWidth >= 768 && deviceWidth <= 1024) {
    displayName =
      productName.length > 35 ? `${productName.slice(0, 35)}...` : productName;
  } else {
    displayName =
      productName.length > 30 ? `${productName.slice(0, 30)}...` : productName;
  }

  const product = {
    name: productData.productData.name,
    price: productData.productData.saleprice,
    oldPrice: productData.productData.regprice,
    category: productData.productData.productCategory,
    images: [mainImg, subImg],
  };

  const addToCartBtn = async () => {
    setClicked(true);
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const data = {
      productId: productData.productData._id,
      quantity: 1,
      userId: decoded.id,
    }
    const res = await axios.post("https://api.jewelsamarth.in/api/cart/add", data);
    if (res) {
      toast.success(res.data.message);
    }
    else {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <>
      <div className="border rounded-[20px] p-4 shadow-md prodCntnr bg-white relative transition-all duration-300 hover:shadow-lg w-80 m-2 md:m-4">
        <a href={`/products/${productData.productData._id}`}>
          <div
            className="w-full imgCntnr h-48 md:h-48 lg:h-64 overflow-hidden rounded-[15px] cursor-pointer relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <img
              src={product.images[0]}
              alt="Product Image"
              className={`bg-[#efefef] absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100 scale-100"
                }`}
            />
            <img
              src={product.images[1] || product.images[0]}
              alt="Product Hover Image"
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0 scale-100"
                }`}
            />
          </div>
        </a>
        <div className="text-center prodTxt">
          <a href={`/products/${productData.productData._id}`}>
            <h3 className="text-md md:text-xl lg:text-lg font-semibold">
              {displayName}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-md md:text-2xl salePrice lg:text-xl font-semibold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-gray-500 regPrice line-through md:text-md text-sm">
                ₹{product.oldPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 mt-1 text-sm hidden md:block">
              {product.category}
            </p>
          </a>
          <button
            onClick={() => addToCartBtn()}
            className={`${clicked ? "clicked" : ""} w-full bg-[var(--accent-color)] text-white py-2 mt-3 rounded-[20px] font-semibold hover:bg-[var(--primary-color)] transition-all cart-button cart-outside-des`}
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
      <ToastContainer
        stacked
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

export default Collections;
