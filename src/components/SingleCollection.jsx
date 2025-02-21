import { useState } from 'react';
import React from 'react'
import '../assets/styles/SingleProduct.css'
import { RotateCw, CircleHelp, History, Truck, Gem, ShieldCheck, CalendarSync } from 'lucide-react';

const SingleCollection = () => {
  const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D");
  const [subImages, setSubImages] = useState([
    "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
  ]);
  const handleImageClick = (clickedImage, index) => {
    const newSubImages = [...subImages];
    newSubImages[index] = mainImage;
    setSubImages(newSubImages);
    setMainImage(clickedImage);
  };
  const [activeTab, setActiveTab] = useState("description");
  return (
    <>
      <div className="singleProd flex justify-center items-start px-8">
        <div className="singleProdImg w-full flex py-8">
          <ul className="singleSubProdImg flex flex-col justify-start items-center pt-2 gap-4">
            {subImages.slice(0, 5).map((img, index) => (
              <li
                key={index}
                onClick={() => handleImageClick(img, index)}
                className="cursor-pointer transition-transform transform hover:scale-105"
              >
                <img
                  src={img}
                  alt={`Sub ${index}`}
                  className="w-full rounded-[20px] h-full object-cover transition-opacity duration-300"
                />
              </li>
            ))}
          </ul>

          <div className="singleMainProdImg w-full mx-12">
            <img
              src={mainImage}
              alt="Product Image"
              className="w-full h-auto rounded-lg object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>
        </div>

        <div className="singleProdDtl w-full flex justify-center items-start flex-col p-8">
          <div className="singleProdTitle font-bold text-2xl">
            Product Heading
          </div>
          <div className="singleProdPrice flex gap-2 items-center mb-4">
            <div className="salePrice text-2xl pr-2">₹599.00</div>
            <div className="regPrice text-md line-through text-gray-500">
              ₹799.00
            </div>
            <div className="prodTax text-gray-500">Incl. of all taxes</div>
          </div>

          <div>
            <span className="text-sm">Availability:</span>
            <span className="text-sm text-green-700">In Stock</span>
          </div>

          <div className="singleProdPincode my-4 w-[50%]">
            <div className="text-lg">Estimated Delivery Time</div>
            <div className="my-2 flex gap-4">
              <input type="number" min={1} className="p-2 pl-4 w-full" />
              <button className="text-md px-4">Check</button>
            </div>
          </div>

          <div className="singleProdBtns flex w-[70%] my-4 px-4 pl-0">
            <div className="addToCartBtn w-full text-center py-2 mx-4 ml-0">
              Add To Cart
            </div>
            <div className="buyNowBtn w-full text-center py-2 mx-4">
              Buy Now
            </div>
          </div>

          <ul className="singleProdInfo flex gap-4 my-4 w-full">
            <li className="w-fit flex gap-2 items-center">
              <RotateCw className="text-gray-500" size={20} />
              Delivery & Return
            </li>
            <li className="w-fit flex gap-2 items-center">
              <CircleHelp className="text-gray-500" size={20} />
              Ask a Question
            </li>
          </ul>

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
      </div>
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative flex justify-center items-center gap-8 text-xl py-4 pb-0 border-b">
          <div
            className={`cursor-pointer px-4 py-2 ${activeTab === "description" ? "text-[var(--accent-color)]" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </div>
          <div
            className={`cursor-pointer px-4 py-2 ${activeTab === "reviews" ? "text-[var(--accent-color)]" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </div>
          <div
            className="absolute bottom-[-1.5px] left-0 h-[2px] bg-[var(--primary-color)] transition-all duration-300 ease-in-out"
            style={{
              width: "120px",
              transform: activeTab === "description" ? "translateX(370%)" : "translateX(500%)",
            }}
          />
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "description" && (
            <div>
              <h2 className="text-lg font-semibold">Product Description</h2>
              <p className="text-gray-700">
                This is a detailed description of the product. It highlights the features, benefits, and specifications.
              </p>
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
    </>
  )
}

export default SingleCollection