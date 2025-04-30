import { useState, useEffect } from "react"
import "../assets/styles/CheckoutPage.css"
import Checkout from "./Checkout"
import jwtDecode from "jwt-decode"
import axios from "axios"
import { VscChevronDown } from "react-icons/vsc"
import { useNavigate } from "react-router-dom"
import logo from "../assets/images/JewelSamarth_Single_Logo.png"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { loadScript } from "../assets/utils/razorpay-utils"
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiCreditCard, FiMapPin, FiCheck } from "react-icons/fi"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [isFormComplete, setIsFormComplete] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isAddressOpen, setIsAddressOpen] = useState(true)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [upiId, setUpiId] = useState("")
  const [buttonText, setButtonText] = useState("Proceed to Payment")
  const [userId, setUserId] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [orderId, setOrderId] = useState("")
  const [rzpLoaded, setRzpLoaded] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Load Razorpay script
  const loadRazorpay = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
    if (!res) {
      toast.warn("Razorpay SDK failed to load. Are you online?")
      return
    }
    setRzpLoaded(true)
  }

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  })

  // Fetch cart data
  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/auth?defaultTab=signup")
        return
      }
      const decodedToken = jwtDecode(token)
      const data = { userId: decodedToken.id }
      const res = await axios.post("https://api.jewelsamarth.in/api/cart/get", data)
      setUserId(decodedToken.id)
      setCartItems(res.data.data)
    } catch (error) {
      console.error("Error fetching cart data:", error)
      toast.error("Failed to load cart items")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    loadRazorpay()
  }, [])

  // Calculate prices
  const totalRegPrice = cartItems.reduce((sum, item) => sum + item.regprice * item.quantity, 0)
  const totalSalePrice = cartItems.reduce((sum, item) => sum + item.saleprice * item.quantity, 0)
  const discountAmount = Math.round((totalSalePrice * discount) / 100)
  const finalAmt = totalSalePrice - discountAmount

  // Quantity Plus Handler
  const handleQuantityPlus = async (productId) => {
    try {
      setUpdating(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to update cart")
        return
      }

      const decodedToken = jwtDecode(token)
      const userId = decodedToken.id

      await axios.post(`https://api.jewelsamarth.in/api/cart/qtyplus/${productId}`, { userId })

      setCartItems(prev => prev.map(item =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ))

      toast.success("Quantity increased")
    } catch (error) {
      console.error("Error increasing quantity:", error)
      toast.error("Failed to increase quantity")
    } finally {
      setUpdating(false)
    }
  }

  // Quantity Minus Handler
  const handleQuantityMinus = async (productId) => {
    try {
      setUpdating(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to update cart")
        return
      }

      const decodedToken = jwtDecode(token)
      const userId = decodedToken.id

      await axios.post(`https://api.jewelsamarth.in/api/cart/qtyminus/${productId}`, { userId })

      setCartItems(prev => prev.map(item =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ))

      toast.success("Quantity decreased")
    } catch (error) {
      console.error("Error decreasing quantity:", error)
      toast.error("Failed to decrease quantity")
    } finally {
      setUpdating(false)
    }
  }

  // Remove Item Handler
  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to update cart")
        return
      }

      const decodedToken = jwtDecode(token)
      const userId = decodedToken.id

      await axios.delete(`https://api.jewelsamarth.in/api/cart/remove/${productId}`, {
        data: { userId }
      })

      setCartItems(prev => prev.filter(item => item._id !== productId))

      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    } finally {
      setUpdating(false)
    }
  }

  // Apply coupon
  const applyCoupon = async (e) => {
    try {
      e.preventDefault()
      if (!couponCode.trim()) {
        toast.error("Please enter a coupon code")
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to apply coupon")
        return
      }

      const res = await axios.post(
        "https://api.jewelsamarth.in/api/order/coupon/apply", 
        { couponCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (res.data.success) {
        setDiscount(res.data.discount)
        toast.success(`Coupon applied! ${res.data.discount}% off`)
      } else {
        toast.error(res.data.message || "Invalid coupon code")
      }
    } catch (error) {
      console.error("Coupon error:", error)
      toast.error(error.response?.data?.message || "Failed to apply coupon")
    }
  }

  // Remove coupon
  const removeCoupon = () => {
    setCouponCode("")
    setDiscount(0)
    toast.success("Coupon removed")
  }

  // Save UPI ID
  const saveUpiId = async (e) => {
    try {
      e.preventDefault()
      if (!upiId.trim()) {
        toast.error("Please enter a valid UPI ID")
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to save UPI ID")
        return
      }

      const upidData = {
        userId,
        paymentMethod: "UPI",
        paymentDetails: upiId,
      }
      
      const res = await axios.post(
        "https://api.jewelsamarth.in/api/user/payments-update", 
        upidData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (res.data.success) {
        toast.success("UPI ID saved successfully!")
      } else {
        toast.error("Failed to save UPI ID")
      }
    } catch (error) {
      toast.error("Failed to save UPI ID")
    }
  }

  // Handle checkout
  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validate form completion
    if (!isFormComplete) {
      toast.error("Please complete your address details");
      setIsAddressOpen(true);
      return;
    }

    // Validate coupon
    if (couponCode && discount === 0) {
      toast.error("Please apply a valid coupon or remove the coupon code");
      return;
    }

    // Validate cart
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Proceed to payment step
    if (buttonText === "Proceed to Payment") {
      setButtonText("Confirm & Pay");
      setIsAddressOpen(false);
      setIsPaymentOpen(true);
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        pincode: formData.pincode,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        email: localStorage.getItem("email"),
        products: cartItems.map((product) => ({
          productId: product._id,
          quantity: product.quantity,
        })),
        totalAmt: totalSalePrice,
        discount: discountAmount,
        couponCode: discount > 0 ? couponCode : undefined,
        finalAmt,
        paymentMethod,
      };

      // Create order
      const orderResponse = await axios.post(
        "https://api.jewelsamarth.in/api/order/checkout",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Order creation failed");
      }

      setOrderNumber(orderResponse.data.order.orderNumber);
      setOrderId(orderResponse.data.razorpayOrder.id);
      toast.success("Order created successfully!");

      // Handle COD payment
      if (paymentMethod === "cod") {
        navigate(`/order/${orderResponse.data.order._id}`);
        return;
      }

      // Handle online payment
      if (!rzpLoaded) {
        toast.error("Payment gateway not loaded. Please try again.");
        return;
      }

      // Razorpay options
      const options = {
        key: "rzp_test_aimogarTBYbWwl",
        amount: Math.round(finalAmt * 100),
        currency: "INR",
        name: "Jewel Samarth",
        description: `Order #${orderResponse.data.order.orderNumber}`,
        image: logo,
        order_id: orderResponse.data.razorpayOrder.id,
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              "https://api.jewelsamarth.in/api/order/verify",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verificationResponse.data.success) {
              toast.success("Payment successful! Order placed.");
              navigate(`/order/${orderResponse.data.order._id}`);
            } else {
              toast.error(verificationResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error verifying payment. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: localStorage.getItem("email"),
          contact: formData.phone,
          method: paymentMethod,
          vpa: upiId || "",
        },
        theme: {
          color: "#060675",
        },
        modal: {
          ondismiss: () => {
            toast.warn("Payment window closed. Please complete your payment.");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        navigate(`/order/${orderResponse.data.order._id}?payment=failed`);
      });

      rzp1.open();

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to process order");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Checkout Process */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Order Summary Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white">
                    <FiShoppingBag className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                <VscChevronDown className={`transition-transform duration-300 ${isSummaryOpen ? "rotate-180" : ""}`} />
              </div>

              <div
                className={`transition-all duration-300 ${isSummaryOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
              >
                <div className="p-4 h-64 overflow-y-auto cartItem">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-color)]"></div>
                    </div>
                  ) : cartItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Your cart is empty</p>
                      <button
                        onClick={() => navigate("/shop")}
                        className="mt-4 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--primary-color)] rounded-[20px] transition-colors"
                        style={{ borderRadius: "20px" }}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col border-2 shadow-lg sm:flex-row items-start sm:items-center p-4 mb-4 rounded-xl bg-white shadow-sm border border-gray-100"
                        >
                          <div className="cartImg flex-shrink-0 mr-4 w-full sm:w-auto mb-3 sm:mb-0">
                            <img
                              className="object-cover w-full h-full rounded-xl"
                              src={item.images || "https://via.placeholder.com/150"}
                              alt={item.name || "Product"}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150"
                              }}
                            />
                          </div>

                          <div className="flex-grow w-full sm:w-auto">
                            <h3 className="font-medium text-gray-900">{item.name || "Product Name"}</h3>

                            <div className="flex items-center mt-1">
                              <span className="text-lg">₹</span>
                              <span className="font-bold text-lg font-semibold">{item.saleprice.toLocaleString()}</span>
                              {item.regprice > item.saleprice && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ₹{item.regprice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-3">
                              <button
                                className="flex items-center text-sm text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveItem(item._id)}
                                disabled={updating}
                              >
                                <FiTrash2 className="mr-1" /> Remove
                              </button>

                              <div className="flex items-center">
                                <button
                                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50"
                                  onClick={() => handleQuantityMinus(item._id)}
                                  disabled={item.quantity <= 1 || updating}
                                >
                                  <FiMinus size={14} />
                                </button>
                                <span className="mx-2 font-medium">{item.quantity}</span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50"
                                  onClick={() => handleQuantityPlus(item._id)}
                                  disabled={updating}
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm Address Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => setIsAddressOpen(!isAddressOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
                {isFormComplete && (
                  <div className="flex items-center text-green-600 mr-4">
                    <FiCheck className="w-5 h-5 mr-1" />
                    <span className="text-sm">Complete</span>
                  </div>
                )}
                <VscChevronDown className={`transition-transform duration-300 ${isAddressOpen ? "rotate-180" : ""}`} />
              </div>

              <div
                className={`transition-all duration-300 ${isAddressOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
              >
                <div className="p-4">
                  <Checkout setIsFormComplete={setIsFormComplete} formData={formData} setFormData={setFormData} />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => isFormComplete && setIsPaymentOpen(!isPaymentOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white">
                    <FiCreditCard className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>
                <VscChevronDown className={`transition-transform duration-300 ${isPaymentOpen ? "rotate-180" : ""}`} />
              </div>

              <div
                className={`transition-all duration-300 ${isPaymentOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
              >
                <div className="p-4">
                  <div className="space-y-3">
                    <div
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex rounded-2xl payBtnOpt items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "upi" ? "bg-[var(--primary-color)]" : "hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        id="upi"
                        name="paymentMethod"
                        checked={paymentMethod === "upi"}
                        readOnly
                        className="h-4 w-4 accent-[var(--accent-color)]"
                      />
                      <label htmlFor="upi" className="flex-grow cursor-pointer font-medium">
                        UPI Payment
                      </label>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="ml-7 mt-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Enter UPI ID (e.g. name@upi)"
                            className="flex payBtnOpt md:w-full lg:w-[50%] px-4 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                            spellCheck="false"
                            onChange={(e) => setUpiId(e.target.value)}
                            value={upiId}
                          />
                          <button
                            onClick={saveUpiId}
                            className="px-6 payBtnOpt py-2 bg-[var(--primary-color)] rounded-2xl text-white font-medium rounded-lg hover:bg-[var(--accent-color)] transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => setPaymentMethod("razorpay")}
                      className={`flex rounded-2xl payBtnOpt items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "bg-[var(--primary-color)]" : "hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        checked={paymentMethod === "razorpay"}
                        readOnly
                        className="h-4 w-4 accent-[var(--accent-color)]"
                      />
                      <label htmlFor="razorpay" className="flex-grow cursor-pointer font-medium">
                        Razorpay
                      </label>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex rounded-2xl payBtnOpt items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "bg-[var(--primary-color)]" : "hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        readOnly
                        className="h-4 w-4 accent-[var(--accent-color)]"
                      />
                      <label htmlFor="cod" className="flex-grow cursor-pointer font-medium">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl orderSum p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Coupon</label>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-grow cupnBox px-4 py-2 border focus:outline-none uppercase"
                    placeholder="Enter code"
                  />
                  <button
                    onClick={couponCode && discount > 0 ? removeCoupon : applyCoupon}
                    className={`px-4 py-2 font-medium cupnBtn transition-colors ${
                      couponCode && discount > 0 
                        ? "bg-[var(--accent-color)] text-white" 
                        : "bg-[var(--accent-color)] text-white"
                    }`}
                  >
                    {couponCode && discount > 0 ? "Remove" : "Apply"}
                  </button>
                </div>
                {discount > 0 && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <FiCheck className="mr-1" /> {discount}% discount applied
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalRegPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Product Discount</span>
                  <span className="text-green-600">- ₹{(totalRegPrice - totalSalePrice).toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Amount</span>
                    <span className="text-[var(--accent-color)]">₹{finalAmt.toLocaleString()}</span>
                  </div>
                  {totalRegPrice - finalAmt > 0 && (
                    <div className="text-right text-sm text-green-600 mt-1">
                      You save ₹{(totalRegPrice - finalAmt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <button
                className={`w-full mt-6 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : isFormComplete
                      ? "bg-[var(--accent-color)] hover:bg-[var(--primary-color)]"
                      : "bg-[var(--accent-color)]"
                }`}
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                {cartItems.length === 0
                  ? "Your cart is empty"
                  : isFormComplete
                    ? buttonText
                    : "Complete address details"}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our{" "}
                <a href="#" className="text-[var(--accent-color)] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[var(--accent-color)] hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        limit={3}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default CheckoutPage