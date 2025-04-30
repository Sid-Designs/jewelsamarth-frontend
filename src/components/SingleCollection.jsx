import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import jwtDecode from "jwt-decode"
import { ToastContainer, toast } from "react-toastify"
import {
  RotateCw,
  CircleHelp,
  History,
  Truck,
  Gem,
  ShieldCheck,
  CalendarIcon as CalendarSync,
  SquarePen,
} from "lucide-react"
import { FaCheck } from "react-icons/fa6"
import SingleCollectionLoading from "./SingleCollectionLoading"
import "../assets/styles/SingleProduct.css"

const SingleCollection = () => {
  const { id } = useParams()
  const token = localStorage.getItem("token")
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const [subImages, setSubImages] = useState([])
  const [clicked, setClicked] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [pincode, setPincode] = useState("")
  const [pincodeMessage, setPincodeMessage] = useState("")
  const [pincodeStatus, setPincodeStatus] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://api.jewelsamarth.in/api/product/${id}`)
        const productData = response.data.product
        setProduct(productData)
        setMainImage(productData.images[0] || "")
        setSubImages(productData.subImages || [])
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleImageClick = (clickedImage, index) => {
    const newSubImages = [...subImages]
    newSubImages[index] = mainImage
    setSubImages(newSubImages)
    setMainImage(clickedImage)
  }

  const handleAddTocart = async () => {
    try {
      setClicked(true)
      const decoded = jwtDecode(token)
      const data = {
        productId: id,
        quantity: 1,
        userId: decoded.id,
      }
      const res = await axios.post("https://api.jewelsamarth.in/api/cart/add", data)
      if (res) toast.success(res.data.message)
    } catch {
      toast.error("Failed to add product to cart")
    }
  }

  const handlePincode = async (e) => {
    e.preventDefault();
    if (!pincode) {
      toast.error("Please enter a pincode")
      return
    }
    try {
      const response = await axios.post("https://api.jewelsamarth.in/api/pincode/check", { pincode })
      if (response.data.success) {
        setPincodeStatus(true);
        setPincodeMessage("Delivery is available in your area. 🎉", response.data);
        toast.success("Pincode is available for delivery")
      } else {
        setPincodeStatus(true);
        setPincodeMessage("Sorry, delivery is not available for the entered pincode. 😔")
        toast.error("Pincode is not available for delivery")
      }
    } catch (error) {
      setPincodeMessage("Error Occurred Please Try Again!")
      toast.error("Error Occurred Please Try Again!")
    }
  }

  const inputHandle = (e) => {
    setPincode(e.target.value)
  }

  if (loading) return <SingleCollectionLoading />
  if (!product) return <div className="container mx-auto px-4 py-8 text-center text-lg">Product not found</div>

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex flex-col md:flex-row px-0 sm:px-4 order-1">
          <ul className="singleSubProdImg flex md:flex-col gap-3 sm:gap-4 w-full md:w-fit md:px-4 order-2 md:order-1 justify-center md:justify-start items-center my-3 md:my-4">
            {subImages.slice(0, 4).map((img, index) => (
              <li
                key={index}
                onClick={() => handleImageClick(img, index)}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#efefef] rounded-[20px] cursor-pointer transition-transform hover:scale-105"
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Sub ${index}`}
                  className="w-full h-full object-cover rounded-[20px] transition-opacity duration-300"
                />
              </li>
            ))}
          </ul>
          <div
            className="flex-1 my-4 bg-[#efefef] rounded-[20px] aspect-square md:aspect-[3/4] max-h-[350px] md:max-h-[400px] lg:max-h-[550px] overflow-hidden md:order-2 relative group"
          >
            <img
              src={mainImage || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-cover rounded-[20px] transition-transform duration-300 origin-center scale-100 group-hover:scale-150"
              style={{ transformOrigin: 'var(--zoom-origin)' }}
              onMouseMove={(e) => {
                const container = e.currentTarget.parentElement;
                const containerRect = container.getBoundingClientRect();
                const x = e.clientX - containerRect.left;
                const y = e.clientY - containerRect.top;
                container.style.setProperty('--zoom-origin', `${x}px ${y}px`);
              }}
              onMouseLeave={(e) => {
                const container = e.currentTarget.parentElement;
                container.style.removeProperty('--zoom-origin');
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-2 sm:p-4 order-2 flex flex-col gap-2 mt-2 md:mt-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{product.name}</h2>
          <div className="flex gap-2 items-center py-2 pt-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold">
              <span className="font-light">₹</span>
              {product.saleprice}
            </div>
            <div className="text-sm sm:text-md md:text-lg line-through text-gray-400">
              <span className="font-light">₹</span>
              {product.regprice}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-md">Availability:</span>
            <span className={`text-xs sm:text-sm ${product.stock > 0 ? "text-green-700" : "text-red-700"}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="text-md sm:text-lg md:text-xl mt-2">Estimated Delivery Time</div>
          <div>
            <form onSubmit={(e) => handlePincode(e)} className="flex gap-2 singleProdPincode">
              <input
                type="number"
                min={1}
                value={pincode}
                onChange={(e) => inputHandle(e)}
                placeholder="Enter Pincode"
                className="p-2 pl-4 w-[50%] md:w-[40%] rounded text-sm sm:text-base"
              />
              <button className="px-3 sm:px-4 py-2 rounded border bg-white shadow-sm text-sm sm:text-base">
                Check
              </button>
            </form>
            {
              pincodeStatus && (
                <div className="pt-2 pl-2 text-xs sm:text-sm md:text-base">{pincodeMessage}</div>
              )
            }
          </div>

          {/* Cart + Buy Buttons */}
          <div className="singleProdBtns-container w-full sm:w-[80%] md:w-[70%] lg:w-[75%] mt-4">
            <div className="singleProdBtns">
              <button
                onClick={handleAddTocart}
                aria-label="Add to Cart"
                className={`${clicked ? "clicked" : ""} addToCartBtn cart-button text-sm sm:text-base`}
              >
                <span className="add-to-cart">Add to cart</span>
                <span className="added flex justify-center items-center">
                  <FaCheck className="mr-2 text-[var(--primary-color)]" />
                  Added
                </span>
                <i className="fas fa-shopping-cart"></i>
                <i className="fas fa-box"></i>
              </button>
              <button className="buyNowBtn text-sm sm:text-base">Buy Now</button>
            </div>
          </div>

          {/* Support Options */}
          <ul className="flex gap-3 sm:gap-4 w-full my-2 flex-wrap text-xs sm:text-sm md:text-base">
            <li className="flex gap-1 sm:gap-2 items-center cursor-pointer">
              <RotateCw className="text-gray-500" size={16} />
              <span>Delivery & Return</span>
            </li>
            <li className="flex gap-1 sm:gap-2 items-center cursor-pointer">
              <CircleHelp className="text-gray-500" size={16} />
              <span>Ask a Question</span>
            </li>
            <li className="hidden md:flex gap-1 sm:gap-2 items-center cursor-pointer">
              <SquarePen className="text-gray-500" size={16} />
              Edit Product
            </li>
          </ul>

          {/* Delivery Date */}
          <div className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm md:text-base">
            <History className="text-gray-500" size={16} />
            Estimated Delivery:
            <span className="text-gray-500">15TH Feb - 20TH Feb</span>
          </div>

          {/* Features Section */}
          <ul className="h-24 sm:h-28 w-full md:w-[90%] lg:w-[80%] bg-[#efefef] rounded-[15px] border flex my-3 sm:my-4">
            <li className="w-full flex flex-col justify-center items-center gap-1 sm:gap-2 text-center text-[10px] xs:text-xs sm:text-sm pointer-events-none p-1">
              <Truck className="text-[var(--primary-color)]" size={20} />
              Fast <br /> Shipping
            </li>
            <li className="w-full hidden sm:flex flex-col justify-center items-center gap-1 sm:gap-2 text-center text-[10px] xs:text-xs sm:text-sm pointer-events-none p-1">
              <Gem className="text-[var(--primary-color)]" size={20} />
              925 Pure <br /> Silver
            </li>
            <li className="w-full flex flex-col justify-center items-center gap-1 sm:gap-2 text-center text-[10px] xs:text-xs sm:text-sm pointer-events-none p-1">
              <ShieldCheck className="text-[var(--primary-color)]" size={20} />
              Secure <br /> Payment
            </li>
            <li className="w-full flex flex-col justify-center items-center gap-1 sm:gap-2 text-center text-[10px] xs:text-xs sm:text-sm pointer-events-none p-1">
              <CalendarSync className="text-[var(--primary-color)]" size={20} />
              15 Days <br /> Returns
            </li>
          </ul>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-8">
        <div className="relative flex justify-center items-center gap-4 sm:gap-8 text-lg sm:text-xl py-3 pb-0 border-b">
          {/* Description Tab */}
          <div
            className={`cursor-pointer px-2 sm:px-4 py-1 sm:py-2 relative text-sm sm:text-base md:text-lg ${activeTab === "description" ? "text-[var(--accent-color)]" : ""
              }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </div>

          {/* Reviews Tab */}
          <div
            className={`cursor-pointer px-2 sm:px-4 py-1 sm:py-2 relative text-sm sm:text-base md:text-lg ${activeTab === "reviews" ? "text-[var(--accent-color)]" : ""
              }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </div>

          {/* Underline Animation */}
          <div
            className="absolute bottom-0 h-[2px] bg-[var(--accent-color)] transition-all duration-300 ease-in-out"
            style={{
              width: "80px", // Adjust to match your tab width
              left: activeTab === "description" ? "calc(50% - 105px)" : "calc(50% + 40px)",
            }}
          ></div>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4">
          {activeTab === "description" && (
            <div>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">{product.description}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">Customer Reviews</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-2">
                No reviews yet. Be the first to write one!
              </p>
            </div>
          )}
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
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default SingleCollection
