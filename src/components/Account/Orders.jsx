import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { ChevronLeft, ChevronRight, Star, MessageSquare, MapPin, CreditCard, Loader } from 'lucide-react';

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          setUserId(userId);

          // Fetch orders with userId in the request body
          const response = await axios.post('https://api.jewelsamarth.in/api/order/details', { userId });
          console.log(response.data)

          if (response.data.success) {
            // Format the orders data to match our component structure
            const formattedOrders = response.data.orders.map(order => ({
              id: order._id,
              orderNumber: `JWL-${order.orderNumber}`,
              status: order.status,
              date: new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              total: `₹${order.finalAmt}`,
              products: order.products.map(product => ({
                id: product.productId,
                name: `Product ${product.productId.slice(-4)}`, // Temporary - replace with actual product data
                price: `₹${Math.round(order.finalAmt / order.products.length)}`, // Temporary - replace with actual price
                images: ["https://via.placeholder.com/150"], // Temporary - replace with actual images
                description: "Product description", // Temporary - replace with actual description
                specifications: ["Specification 1", "Specification 2"] // Temporary - replace with actual specs
              })),
              delivery: {
                address: `${order.address}, ${order.city}, ${order.state} ${order.pincode}`,
                method: "Standard Delivery"
              },
              payment: order.paymentMethod === 'cod' ?
                'Cash on Delivery' :
                order.paymentMethod === 'upi' ?
                  'UPI Payment' :
                  `Credit Card (•••• •••• •••• ${order.paymentMethod.slice(-4)})`
            }));

            console.log(formattedOrders)
            setOrders(formattedOrders);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    setCurrentSlide(0);
    setHoverRating(0);
  };

  const nextSlide = () => {
    const order = orders.find(o => o.id === expandedOrder);
    if (currentSlide < order.products.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setHoverRating(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setHoverRating(0);
    }
  };

  const handleRating = (orderId, productId, rating) => {
    setRatings(prev => ({
      ...prev,
      [`${orderId}-${productId}`]: {
        ...prev[`${orderId}-${productId}`],
        stars: rating
      }
    }));
  };

  const handleCommentChange = (orderId, productId, text) => {
    setComments(prev => ({
      ...prev,
      [`${orderId}-${productId}`]: text
    }));
  };

  const submitReview = (orderId, productId) => {
    const review = {
      stars: ratings[`${orderId}-${productId}`]?.stars || 0,
      comment: comments[`${orderId}-${productId}`] || ''
    };

    // Here you would typically send the review to your backend
    console.log('Submitting review:', review);
    alert(`Thank you for your ${review.stars}-star review!`);
  };

  const currentProduct = () => {
    if (expandedOrder === null) return null;
    const order = orders.find(o => o.id === expandedOrder);
    return order.products[currentSlide];
  };

  if (loading) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto flex justify-center items-center h-64">
        <Loader className="animate-spin text-[var(--primary-color)]" size={48} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[20px]">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <button
            className="bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white px-6 py-2 rounded-[20px]"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 p-2">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-[20px] overflow-hidden">
            <div
              className={`p-5 cursor-pointer transition-colors ${expandedOrder === order.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-medium">Order #{order.orderNumber}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${order.status === "Delivered" ? "bg-green-500" :
                        order.status === "pending" ? "bg-yellow-500" : "bg-blue-500"
                      }`}></div>
                    <span className="text-sm">
                      {order.status === "Delivered" ? `Delivered on ${order.date}` :
                        order.status === "pending" ? `Pending - ${order.date}` : `Shipped - ${order.date}`}
                    </span>
                  </div>
                </div>
                <span className="text-[var(--primary-color)] font-semibold">{order.total}</span>
              </div>
              {/* Product Image Grid Preview */}
              <div className="flex gap-2 mt-4">
                {order.products.map((product, idx) => (
                  <div key={`${order.id}-${product.id}`} className="w-16 h-16 flex-shrink-0 relative">
                    <img
                      className={`w-full h-full object-cover rounded-[10px] border-2 ${currentSlide === idx && expandedOrder === order.id ? 'border-[var(--primary-color)]' : 'border-transparent'}`}
                      src={product.images[0]}
                      alt={product.name}
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

            {/* Expanded Product Slideshow - One Product at a Time */}
            {expandedOrder === order.id && (
              <div className="border-t border-gray-200">
                {/* Slideshow Navigation with Progress Indicator */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={`p-2 rounded-full ${currentSlide === 0 ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:bg-gray-200'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex-1 px-4">
                    <div className="relative h-1 bg-gray-200 rounded-full">
                      <div
                        className="absolute top-0 left-0 h-full bg-[var(--primary-color)] rounded-full"
                        style={{ width: `${((currentSlide + 1) / order.products.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600 mt-1">
                      Product {currentSlide + 1} of {order.products.length}
                    </div>
                  </div>

                  <button
                    onClick={nextSlide}
                    disabled={currentSlide === order.products.length - 1}
                    className={`p-2 rounded-full ${currentSlide === order.products.length - 1 ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:bg-gray-200'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Current Product Display */}
                <div className="p-5">
                  {currentProduct() && (
                    <div className="space-y-6">
                      {/* Product Images Carousel */}
                      <div className="relative h-64 rounded-[15px] overflow-hidden bg-gray-100">
                        <img
                          className="w-full h-full object-contain"
                          src={currentProduct().images[0]}
                          alt={currentProduct().name}
                        />
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {currentProduct().images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}
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
                          <span className="text-sm text-gray-500">
                            Quantity: {order.products.find(p => p.id === currentProduct().id)?.quantity || 1}
                          </span>
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
                      {order.status === "Delivered" && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                            <MessageSquare size={20} />
                            <span>Rate Your Purchase</span>
                          </h3>

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
                                      star <= (hoverRating || ratings[`${order.id}-${currentProduct().id}`]?.stars || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                </button>
                              ))}
                              <span className="ml-3 text-gray-600">
                                {ratings[`${order.id}-${currentProduct().id}`]?.stars || 0} out of 5
                              </span>
                            </div>
                          </div>

                          {/* Comment Box */}
                          <div className="mb-4">
                            <h4 className="text-gray-700 mb-2">Share your experience</h4>
                            <textarea
                              value={comments[`${order.id}-${currentProduct().id}`] || ''}
                              onChange={(e) => handleCommentChange(order.id, currentProduct().id, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                              rows="4"
                              placeholder="What did you like or dislike about this product?"
                            />
                          </div>

                          {/* Submit Button */}
                          <button
                            onClick={() => submitReview(order.id, currentProduct().id)}
                            disabled={!ratings[`${order.id}-${currentProduct().id}`]?.stars}
                            className="px-5 py-2.5 bg-[var(--primary-color)] text-white rounded-[20px] hover:bg-[var(--accent-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit Review
                          </button>
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
                      <p className="text-gray-700 mt-1">{order.payment}</p>
                      <p className="text-sm mt-1 text-gray-500">
                        Status: {order.status === "pending" ? "Pending" : "Completed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;