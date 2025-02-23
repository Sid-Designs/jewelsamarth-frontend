import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import "../assets/styles/SingleProduct.css";
import { RotateCw, CircleHelp, History, Truck, Gem, ShieldCheck, CalendarSync } from "lucide-react";

const SingleCollection = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://api.jewelsamarth.in/api/product/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const [mainImage, setMainImage] = useState(product.images[0] || "");
  const [subImages, setSubImages] = useState(product.subImages || []);
  const [activeTab, setActiveTab] = useState("description");

  const handleImageClick = (clickedImage, index) => {
    const newSubImages = [...subImages];
    newSubImages[index] = mainImage;
    setSubImages(newSubImages);
    setMainImage(clickedImage);
  };

  return (
    <div className="singleProd flex justify-center items-start px-8">
      {/* Product Images */}
      <div className="singleProdImg w-full flex py-8">
        <ul className="singleSubProdImg flex flex-col justify-start items-center pt-2 gap-4">
          {subImages.map((img, index) => (
            <li key={index} onClick={() => handleImageClick(img, index)} className="cursor-pointer transition-transform transform hover:scale-105">
              <img src={img} alt={`Sub ${index}`} className="w-full rounded-[20px] h-full object-cover transition-opacity duration-300" />
            </li>
          ))}
        </ul>

        <div className="singleMainProdImg w-full mx-12">
          <img src={mainImage} alt={product.name} className="w-full h-auto rounded-lg object-cover transition-opacity duration-500 ease-in-out" />
        </div>
      </div>

      {/* Product Details */}
      <div className="singleProdDtl w-full flex justify-center items-start flex-col p-8">
        <h1 className="font-bold text-2xl">{product.name}</h1>
        <div className="singleProdPrice flex gap-2 items-center mb-4">
          <div className="salePrice text-2xl pr-2">₹{product.saleprice}</div>
          <div className="regPrice text-md line-through text-gray-500">₹{product.regprice}</div>
          <div className="prodTax text-gray-500">Incl. of all taxes</div>
        </div>

        <div>
          <span className="text-sm">Availability: </span>
          <span className="text-sm text-green-700">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>

        <div className="singleProdBtns flex w-[70%] my-4 px-4 pl-0">
          <button className="addToCartBtn w-full text-center py-2 mx-4 ml-0">Add To Cart</button>
          <button className="buyNowBtn w-full text-center py-2 mx-4">Buy Now</button>
        </div>

        <div className="w-full mb-4 flex gap-2 items-center">
          <History className="text-gray-500" size={20} />
          Estimated Delivery: <span className="text-gray-500">15TH Feb - 20TH Feb</span>
        </div>

        <ul className="singleProdFeature flex justify-around my-4 w-full py-8">
          <li className="flex flex-col justify-center items-center gap-2 text-center leading-none text-sm pointer-events-none">
            <Truck className="text-[var(--primary-color)]" size={24} />
            Fast <br /> Shipping
          </li>
          <li className="flex flex-col justify-center items-center gap-2 text-center leading-none text-sm pointer-events-none">
            <Gem className="text-[var(--primary-color)]" size={24} />
            925 Pure <br /> Silver
          </li>
          <li className="flex flex-col justify-center items-center gap-2 text-center leading-none text-sm pointer-events-none">
            <ShieldCheck className="text-[var(--primary-color)]" size={24} />
            Secure <br /> Payment
          </li>
          <li className="flex flex-col justify-center items-center gap-2 text-center leading-none text-sm pointer-events-none">
            <CalendarSync className="text-[var(--primary-color)]" size={24} />
            15 Days <br /> Returns
          </li>
        </ul>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative flex justify-center items-center gap-8 text-xl py-4 pb-0 border-b">
          <div className={`cursor-pointer px-4 py-2 ${activeTab === "description" ? "text-[var(--accent-color)]" : ""}`} onClick={() => setActiveTab("description")}>
            Description
          </div>
          <div className={`cursor-pointer px-4 py-2 ${activeTab === "reviews" ? "text-[var(--accent-color)]" : ""}`} onClick={() => setActiveTab("reviews")}>
            Reviews
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "description" && (
            <div>
              <h2 className="text-lg font-semibold">Product Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              <h2 className="text-lg font-semibold">Customer Reviews</h2>
              <p className="text-gray-700">No reviews yet. Be the first to write one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCollection;
