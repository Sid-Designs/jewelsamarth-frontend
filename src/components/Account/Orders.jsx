import { useState, useEffect } from "react"
import axios from "axios"
import jwtDecode from "jwt-decode"
import { ChevronLeft, ChevronRight, Star, MessageSquare, MapPin, CreditCard, Loader, X } from "lucide-react"

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [ratings, setRatings] = useState({})
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState({})
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [productDetails, setProductDetails] = useState({})
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState({})
  const [reviewError, setReviewError] = useState(null)

  // Fetch user orders and product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const decodedToken = jwtDecode(token)
        const userId = decodedToken.id

        // 1. Fetch orders
        const ordersResponse = await axios.post("https://api.jewelsamarth.in/api/order/details", { userId })

        if (!ordersResponse.data.success || !Array.isArray(ordersResponse.data.orders)) {
          throw new Error("No orders found or invalid response structure")
        }

        const ordersData = ordersResponse.data.orders

        // 2. Fetch product details for all unique products
        const uniqueProductIds = [
          ...new Set(ordersData.flatMap((order) => order.products.map((product) => product.productId))),
        ]

        const productDetailsMap = {}
        await Promise.all(
          uniqueProductIds.map(async (productId) => {
            try {
              const productResponse = await axios.get(`https://api.jewelsamarth.in/api/product/${productId}`)
              if (productResponse.data.product) {
                productDetailsMap[productId] = productResponse.data.product
              }
            } catch (err) {
              console.error(`Error fetching product ${productId}:`, err)
              // Fallback data if product fetch fails
              productDetailsMap[productId] = {
                name: `Product ${productId.slice(-4)}`,
                images: ["https://via.placeholder.com/150"],
                description: "Product description",
                saleprice: 0,
                regprice: 0,
              }
            }
          }),
        )

        setProductDetails(productDetailsMap)

        // 3. Format orders with product details
        const formattedOrders = ordersData.map((order) => {
          // Calculate price per product (fallback if product details not available)
          const pricePerProduct = Math.round(order.finalAmt / order.products.length)

          return {
            id: order._id,
            orderNumber: `JWL-${order.orderNumber}`,
            status: order.status,
            date: new Date(order.orderDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            total: `₹${order.finalAmt}`,
            products: order.products.map((product) => {
              const details = productDetailsMap[product.productId] || {}
              return {
                id: product.productId,
                name: details.name || `Product ${product.productId.slice(-4)}`,
                price: `₹${details.saleprice || pricePerProduct}`,
                originalPrice: details.regprice ? `₹${details.regprice}` : null,
                images: details.images || ["https://via.placeholder.com/150"],
                description: details.description || "Product description",
                specifications: [`Material: ${details.material || "Sterling Silver"}`],
                quantity: product.quantity,
              }
            }),
            delivery: {
              address: `${order.address}, ${order.city}, ${order.state} ${order.pincode}`,
              method: "Standard Delivery",
            },
            payment:
              order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : order.paymentMethod === "upi"
                  ? "UPI Payment"
                  : `${order.paymentMethod}`,
          }
        })

        setOrders(formattedOrders)
      } catch (err) {
        console.error("Error:", err)
        setError(err.message || "Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
    setCurrentSlide(0)
    setHoverRating(0)
  }

  const nextSlide = () => {
    const order = orders.find((o) => o.id === expandedOrder)
    if (currentSlide < order.products.length - 1) {
      setCurrentSlide(currentSlide + 1)
      setHoverRating(0)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
      setHoverRating(0)
    }
  }

  const handleRating = (orderId, productId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [`${orderId}-${productId}`]: rating,
    }))
  }

  const handleCommentChange = (orderId, productId, text) => {
    setComments((prev) => ({
      ...prev,
      [`${orderId}-${productId}`]: text,
    }))
  }

  const submitReview = async (orderId, productId) => {
    setSubmittingReview(true)
    setReviewError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const decodedToken = jwtDecode(token)
      const userId = decodedToken.id
      const userName = localStorage.getItem("username")
      const userEmail = localStorage.getItem("email")

      // Prepare the review data according to your API requirements
      const reviewData = {
        userId,
        orderId,
        productId,
        name: userName,
        email: userEmail,
        review: comments[`${orderId}-${productId}`] || "",
        rating: ratings[`${orderId}-${productId}`] || 0,
      }

      // Make the API call to submit the review
      const response = await axios.post("https://api.jewelsamrth.in/api/review/add", reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        // Update state to reflect the submitted review
        setReviewSubmitted((prev) => ({
          ...prev,
          [`${orderId}-${productId}`]: true,
        }))
      } else {
        throw new Error(response.data.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setReviewError(error.message || "An error occurred while submitting your review. Please try again.")
    } finally {
      setSubmittingReview(false)
    }
  }

  const currentProduct = () => {
    if (expandedOrder === null) return null
    const order = orders.find((o) => o.id === expandedOrder)
    return order?.products[currentSlide]
  }

  // Skeleton Loading Components
  const OrderListSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-[20px] overflow-hidden">
          <div className="p-5">
            <div className="animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              
              <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="w-16 h-16 bg-gray-200 rounded-[10px]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const OrderDetailSkeleton = () => (
    <div className="border-t border-gray-200">
      <div className="p-5">
        <div className="animate-pulse space-y-6">
          {/* Product Image */}
          <div className="h-64 rounded-[15px] bg-gray-200"></div>
          
          {/* Product Information */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex items-baseline gap-3 mt-1">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* Product Specifications */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <div className="h-10 bg-gray-200 rounded-[20px] w-24"></div>
            <div className="h-10 bg-gray-200 rounded-[20px] w-32"></div>
          </div>
        </div>
      </div>

      {/* Order Summary Footer */}
      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 p-2">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
        <OrderListSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[20px]">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Error Loading Orders</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-6 py-2 rounded-[20px]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[20px]">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <button className="bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-6 py-2 rounded-[20px]">
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 max-w-4xl mx-auto relative">
      {/* Error Popup */}
      {reviewError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-red-600">Review Submission Failed</h3>
              <button
                onClick={() => setReviewError(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-700 mb-6">{reviewError}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setReviewError(null)}
                className="px-5 py-2.5 bg-[var(--primary-color)] text-white rounded-[20px] hover:bg-[var(--accent-color)] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 p-2">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-[20px] overflow-hidden">
            {/* Order Summary Header */}
            <div
              className={`p-5 cursor-pointer transition-colors ${expandedOrder === order.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-medium">Order #{order.orderNumber}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-[var(--accent-color)]"
                        }`}
                    ></div>
                    <span className="text-sm">
                      {order.status === "delivered"
                        ? `Delivered on ${order.date}`
                        : order.status === "pending"
                          ? `Pending - ${order.date}`
                          : `Shipped - ${order.date}`}
                    </span>
                  </div>
                </div>
                <span className="text-[var(--primary-color)] font-semibold">{order.total}</span>
              </div>

              {/* Product Image Grid Preview */}
              <div className="flex gap-2 mt-4">
                {order.products.map((product, idx) => (
                  <div key={`${order.id}-${product.id}-${idx}`} className="w-16 h-16 flex-shrink-0 relative">
                    <img
                      className={`w-full h-full object-cover rounded-[10px] border-2 ${currentSlide === idx && expandedOrder === order.id ? "border-[var(--primary-color)]" : "border-transparent"}`}
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      loading="lazy"
                    />
                    {currentSlide === idx && expandedOrder === order.id && (
                      <div className="absolute inset-0 bg-black/20 rounded-[10px] flex items-center justify-center">
                        <div className="w-6 h-6 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-xs">
                          {idx + 1}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrder === order.id && (
              loading ? (
                <OrderDetailSkeleton />
              ) : (
                <div className="border-t border-gray-200">
                  {/* Product Navigation */}
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <button
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className={`p-2 rounded-full ${currentSlide === 0 ? "text-gray-400 cursor-default" : "text-gray-700"}`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-600">
                      Product {currentSlide + 1} of {order.products.length}
                    </span>
                    <button
                      onClick={nextSlide}
                      disabled={currentSlide === order.products.length - 1}
                      className={`p-2 rounded-full ${currentSlide === order.products.length - 1 ? "text-gray-400 cursor-default" : "text-gray-700"}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Current Product Details */}
                  <div className="p-5">
                    {currentProduct() && (
                      <div className="space-y-6">
                        {/* Product Image */}
                        <div className="relative flex h-64 rounded-[15px] overflow-hidden bg-gray-100">
                          <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className={`p-2 rounded-full ${currentSlide === 0 ? "text-gray-400 cursor-default" : "text-gray-700"}`}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <img
                            className="w-full h-full object-contain"
                            src={currentProduct().images[0] || "/placeholder.svg"}
                            alt={currentProduct().name}
                            loading="lazy"
                          />
                          <button
                            onClick={nextSlide}
                            disabled={currentSlide === order.products.length - 1}
                            className={`p-2 rounded-full ${currentSlide === order.products.length - 1 ? "text-gray-400 cursor-default" : "text-gray-700"}`}
                          >
                            <ChevronRight size={20} />
                          </button>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {currentProduct().images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-[var(--primary-color)]" : "bg-gray-300"}`}
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* Product Information */}
                        <div>
                          <h2 className="text-xl font-semibold">{currentProduct().name}</h2>
                          <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-[var(--primary-color)] font-bold text-lg">
                              {currentProduct().price}
                            </span>
                            {currentProduct().originalPrice && (
                              <span className="text-gray-500 line-through">{currentProduct().originalPrice}</span>
                            )}
                            <span className="text-sm text-gray-500">Quantity: {currentProduct().quantity}</span>
                          </div>
                        </div>

                        {/* Product Description */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                          <p className="text-gray-700">{currentProduct().description}</p>
                        </div>

                        {/* Product Specifications */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentProduct().specifications.map((spec, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-gray-500 mr-2">•</span>
                                <span className="text-gray-700">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Rating Section - Only for delivered orders */}
                        {order.status === "delivered" && (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                              <MessageSquare size={20} />
                              <span>Rate Your Purchase</span>
                            </h3>

                            {reviewSubmitted[`${order.id}-${currentProduct().id}`] ? (
                              <div className="p-4 bg-green-50 text-green-700 rounded-[12px] mb-4">
                                Thank you for your review!
                              </div>
                            ) : (
                              <>
                                {/* Star Rating */}
                                <div className="mb-4">
                                  <h4 className="text-gray-700 mb-2">How would you rate this product?</h4>
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => handleRating(order.id, currentProduct().id, star)}
                                        className="p-1 focus:outline-none"
                                      >
                                        <Star
                                          size={28}
                                          className={
                                            star <= (hoverRating || ratings[`${order.id}-${currentProduct().id}`] || 0)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }
                                        />
                                      </button>
                                    ))}
                                    <span className="ml-3 text-gray-600">
                                      {ratings[`${order.id}-${currentProduct().id}`] || 0} out of 5
                                    </span>
                                  </div>
                                </div>

                                {/* Comment Box */}
                                <div className="mb-4">
                                  <h4 className="text-gray-700 mb-2">Share your experience</h4>
                                  <textarea
                                    value={comments[`${order.id}-${currentProduct().id}`] || ""}
                                    onChange={(e) => handleCommentChange(order.id, currentProduct().id, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                                    rows="4"
                                    placeholder="What did you like or dislike about this product?"
                                  />
                                </div>

                                {/* Submit Button */}
                                <button
                                  onClick={() => submitReview(order.id, currentProduct().id)}
                                  disabled={!ratings[`${order.id}-${currentProduct().id}`] || submittingReview}
                                  className="px-5 py-2.5 bg-[var(--primary-color)] text-white rounded-[20px] hover:bg-[var(--accent-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {submittingReview ? "Submitting..." : "Submit Review"}
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6">
                          <button className="px-5 py-2.5 bg-[var(--primary-color)] text-white rounded-[20px] hover:bg-[var(--accent-color)] transition-colors">
                            Buy Again
                          </button>
                          <button className="px-5 py-2.5 border border-gray-300 rounded-[20px] hover:bg-gray-50 transition-colors">
                            Contact Support
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Summary Footer */}
                  <div className="p-5 border-t border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-lg mb-3">Order Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-gray-600 font-medium flex items-center gap-2">
                          <MapPin size={16} />
                          Delivery Address
                        </h4>
                        <p className="text-gray-700 mt-1">{order.delivery.address}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium flex items-center gap-2">
                          <CreditCard size={16} />
                          Payment Method
                        </h4>
                        <p className="text-gray-700 mt-1 capitalize">{order.payment}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders