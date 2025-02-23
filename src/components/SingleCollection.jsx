import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  RotateCw,
  CircleHelp,
  History,
  Truck,
  Gem,
  ShieldCheck,
  CalendarSync,
} from "lucide-react";
import "../assets/styles/SingleProduct.css";

const SingleCollection = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://api.jewelsamarth.in/api/product/${id}`
        );
        const productData = response.data.product;
        setProduct(productData);

        setMainImage(productData.images[0] || "");
        setSubImages(productData.subImages || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <>
    <div className='flex justify-center items-center h-[90vh] w-full'>
      <div className="w-full flex justify-center items-center gap-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-5 h-5 bg-[var(--primary-color)] rounded-full animate-bounce animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  </>;
  if (!product) return <div>Product not found</div>;

  const handleImageClick = (clickedImage, index) => {
    const newSubImages = [...subImages];
    newSubImages[index] = mainImage;
    setSubImages(newSubImages);
    setMainImage(clickedImage);
  };

  return (
    <div className="singleProd flex flex-col justify-center items-start px-8">
      <div className="flex">
        {/* Left Image Section */}
        <div className="singleProdImg w-full flex py-8">
          <ul className="singleSubProdImg flex flex-col justify-start items-center pt-2 gap-4">
            {subImages.map((img, index) => (
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
              alt="Product"
              className="w-full h-auto rounded-lg object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>
        </div>

        {/* Right Details Section */}
        <div className="singleProdDtl w-full flex justify-center items-start flex-col p-8">
          <div className="singleProdTitle font-bold text-2xl">{product.name}</div>
          <div className="singleProdPrice flex gap-2 items-center mb-4">
            <div className="salePrice text-2xl pr-2">₹{product.saleprice}</div>
            <div className="regPrice text-md line-through text-gray-500">
              ₹{product.regprice}
            </div>
            <div className="prodTax text-gray-500">Incl. of all taxes</div>
          </div>

          <div>
            <span className="text-sm">Availability:</span>
            <span
              className={`text-sm ${product.stock > 0 ? "text-green-700" : "text-red-700"
                }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Delivery Time */}
          <div className="singleProdPincode my-4 w-[50%]">
            <div className="text-lg">Estimated Delivery Time</div>
            <div className="my-2 flex gap-4">
              <input type="number" min={1} className="p-2 pl-4 w-full" />
              <button className="text-md px-4">Check</button>
            </div>
          </div>

          {/* Add to Cart & Buy Now */}
          <div className="singleProdBtns flex w-[70%] my-4 px-4 pl-0">
            <div className="addToCartBtn w-full text-center py-2 mx-4 ml-0">
              Add To Cart
            </div>
            <div className="buyNowBtn w-full text-center py-2 mx-4">
              Buy Now
            </div>
          </div>

          {/* Info Section */}
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
            Estimated Delivery:{" "}
            <span className="text-gray-500">15TH Feb - 20TH Feb</span>
          </div>

          {/* Features */}
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

      {/* Tabs Section */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative flex justify-center items-center gap-8 text-xl py-4 pb-0 border-b">
          <div
            className={`cursor-pointer px-4 py-2 ${activeTab === "description" ? "text-[var(--accent-color)]" : ""
              }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </div>
          <div
            className={`cursor-pointer px-4 py-2 ${activeTab === "reviews" ? "text-[var(--accent-color)]" : ""
              }`}
            onClick={() => setActiveTab("reviews")}
          >
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
