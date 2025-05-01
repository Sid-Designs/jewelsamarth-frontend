import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import {
  RotateCw,
  CircleHelp,
  History,
  Truck,
  Gem,
  ShieldCheck,
  CalendarIcon as CalendarSync,
  SquarePen,
  Star,
  Trash2,
  Edit,
} from "lucide-react";
import { FaCheck } from "react-icons/fa6";
import SingleCollectionLoading from "./SingleCollectionLoading";
import "../assets/styles/SingleProduct.css";

const SingleCollection = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Initialize current user from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // Memoized average rating calculation
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    
    const { sum, count } = reviews.reduce(
      (acc, review) => {
        if (review && typeof review.rating === 'number') {
          acc.sum += review.rating;
          acc.count += 1;
        }
        return acc;
      },
      { sum: 0, count: 0 }
    );

    return count > 0 ? (sum / count).toFixed(1) : 0;
  }, [reviews]);

  // Memoized user review
  const userReview = useMemo(() => {
    return currentUserId && reviews.length > 0
      ? reviews.find((review) => review && review.userId === currentUserId)
      : null;
  }, [currentUserId, reviews]);

  // Fetch product and reviews data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await axios.get(
          `https://api.jewelsamarth.in/api/product/${id}`
        );
        setProduct(productResponse.data.product);
        setMainImage(productResponse.data.product.images[0] || "");
        setSubImages(productResponse.data.product.subImages || []);

        // Fetch reviews data
        const reviewsResponse = await axios.get(
          `https://api.jewelsamrth.in/api/review/product/${id}`
        );
        const reviewsData = reviewsResponse.data.reviews || [];
        setReviews(reviewsData);

        // Fetch usernames for all reviews
        const userIds = [...new Set(reviewsData.map((review) => review?.userId).filter(Boolean))];
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userResponse = await axios.get(
                `https://api.jewelsamrth.in/api/user/${userId}`
              );
              if (userResponse.data.success) {
                setUserNames((prev) => ({
                  ...prev,
                  [userId]: userResponse.data.name,
                }));
              }
            } catch (error) {
              console.error(`Error fetching username for user ${userId}:`, error);
            }
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageClick = useCallback((clickedImage, index) => {
    const newSubImages = [...subImages];
    newSubImages[index] = mainImage;
    setSubImages(newSubImages);
    setMainImage(clickedImage);
  }, [mainImage, subImages]);

  const handleAddTocart = async () => {
    if (!token) {
      toast.error("Please log in to add items to cart");
      return;
    }
    
    try {
      setClicked(true);
      const decoded = jwtDecode(token);
      const data = {
        productId: id,
        quantity: 1,
        userId: decoded.id,
      };
      const res = await axios.post(
        "https://api.jewelsamarth.in/api/cart/add",
        data
      );
      if (res) toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to add product to cart");
      setClicked(false);
    }
  };

  const handlePincode = async (e) => {
    e.preventDefault();
    if (!pincode) {
      toast.error("Please enter a pincode");
      return;
    }
    try {
      const response = await axios.post(
        "https://api.jewelsamarth.in/api/pincode/check",
        { pincode }
      );
      if (response.data.success) {
        setPincodeStatus(true);
        setPincodeMessage("Delivery is available in your area. 🎉");
        toast.success("Pincode is available for delivery");
      } else {
        setPincodeStatus(true);
        setPincodeMessage(
          "Sorry, delivery is not available for the entered pincode. 😔"
        );
        toast.error("Pincode is not available for delivery");
      }
    } catch (error) {
      setPincodeMessage("Error Occurred Please Try Again!");
      toast.error("Error Occurred Please Try Again!");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!reviewText || rating === 0) {
      toast.error("Please provide both a rating and review text");
      return;
    }

    try {
      setIsReviewLoading(true);
      const decoded = jwtDecode(token);

      if (editingReviewId) {
        // Optimistic update for editing review
        const updatedReview = {
          _id: editingReviewId,
          userId: decoded.id,
          productId: id,
          review: reviewText,
          rating: rating,
          createdAt: new Date().toISOString(),
          name: userNames[decoded.id] || "Anonymous"
        };

        setReviews(reviews.map(review => 
          review._id === editingReviewId ? updatedReview : review
        ));

        // API call after state update for faster UI response
        const response = await axios.put(
          "https://api.jewelsamrth.in/api/review/update",
          {
            userId: decoded.id,
            productId: id,
            review: reviewText,
            rating: rating,
            reviewId: editingReviewId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Review updated successfully!");
      } else {
        // Optimistic update for new review
        const newReview = {
          _id: `temp-${Date.now()}`, // Temporary ID
          userId: decoded.id,
          productId: id,
          review: reviewText,
          rating: rating,
          createdAt: new Date().toISOString(),
          name: userNames[decoded.id] || "Anonymous"
        };

        setReviews([newReview, ...reviews]);

        // API call after state update for faster UI response
        const response = await axios.post(
          "https://api.jewelsamrth.in/api/review/add",
          {
            userId: decoded.id,
            productId: id,
            review: reviewText,
            rating: rating,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Replace the temporary review with the actual one from server
        setReviews(prev => [
          {
            ...response.data.review,
            name: userNames[decoded.id] || "Anonymous"
          },
          ...prev.filter(r => r._id !== newReview._id)
        ]);

        toast.success("Review submitted successfully!");
      }

      setReviewText("");
      setRating(0);
      setEditingReviewId(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
      // Revert optimistic update on error
      if (editingReviewId) {
        // Try to get the original review back (simplified approach)
        const originalReview = reviews.find(r => r._id === editingReviewId);
        if (originalReview) {
          setReviews(reviews.map(r => 
            r._id === editingReviewId ? originalReview : r
          ));
        }
      } else {
        // Remove the temporary review on error
        setReviews(reviews.filter(r => !r._id.startsWith('temp-')));
      }
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleEditReview = useCallback((review) => {
    setEditingReviewId(review._id);
    setReviewText(review.review || review.comment || "");
    setRating(review.rating || 0);
    document.getElementById("review-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingReviewId(null);
    setReviewText("");
    setRating(0);
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!token) {
      toast.error("Please login to delete review");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      // Optimistic update
      setReviews(reviews.filter(review => review._id !== reviewId));
      
      const decoded = jwtDecode(token);
      await axios.delete("https://api.jewelsamrth.in/api/review/delete", {
        data: {
          userId: decoded.id,
          reviewId: reviewId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
      // Revert optimistic update on error
      const deletedReview = reviews.find(r => r._id === reviewId);
      if (deletedReview) {
        setReviews([...reviews]);
      }
    }
  };

  if (loading) return <SingleCollectionLoading />;
  if (!product)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg">
        Product not found
      </div>
    );

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
          <div className="flex-1 my-4 bg-[#efefef] rounded-[20px] aspect-square md:aspect-[3/4] max-h-[350px] md:max-h-[400px] lg:max-h-[550px] overflow-hidden md:order-2 relative group">
            <img
              src={mainImage || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-cover rounded-[20px] transition-transform duration-300 origin-center scale-100 group-hover:scale-150"
              style={{ transformOrigin: "var(--zoom-origin)" }}
              onMouseMove={(e) => {
                const container = e.currentTarget.parentElement;
                const containerRect = container.getBoundingClientRect();
                const x = e.clientX - containerRect.left;
                const y = e.clientY - containerRect.top;
                container.style.setProperty("--zoom-origin", `${x}px ${y}px`);
              }}
              onMouseLeave={(e) => {
                const container = e.currentTarget.parentElement;
                container.style.removeProperty("--zoom-origin");
              }}
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-1/2 p-2 sm:p-4 order-2 flex flex-col gap-2 mt-2 md:mt-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            {product.name}
          </h2>

          {/* Average Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= averageRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* Price Section */}
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

          {/* Availability */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-md">Availability:</span>
            <span
              className={`text-xs sm:text-sm ${
                product.stock > 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Delivery Check */}
          <div className="text-md sm:text-lg md:text-xl mt-2">
            Estimated Delivery Time
          </div>
          <div>
            <form
              onSubmit={(e) => handlePincode(e)}
              className="flex gap-2 singleProdPincode"
            >
              <input
                type="number"
                min={1}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="p-2 pl-4 w-[50%] md:w-[40%] rounded text-sm sm:text-base"
              />
              <button className="px-3 sm:px-4 py-2 rounded border bg-white shadow-sm text-sm sm:text-base">
                Check
              </button>
            </form>
            {pincodeStatus && (
              <div className="pt-2 pl-2 text-xs sm:text-sm md:text-base">
                {pincodeMessage}
              </div>
            )}
          </div>

          {/* Cart + Buy Buttons */}
          <div className="singleProdBtns-container w-full sm:w-[80%] md:w-[70%] lg:w-[75%] mt-4">
            <div className="singleProdBtns">
              <button
                onClick={handleAddTocart}
                aria-label="Add to Cart"
                className={`${
                  clicked ? "clicked" : ""
                } addToCartBtn cart-button text-sm sm:text-base`}
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
            className={`cursor-pointer px-2 sm:px-4 py-1 sm:py-2 relative text-sm sm:text-base md:text-lg ${
              activeTab === "description" ? "text-[var(--accent-color)]" : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </div>

          {/* Reviews Tab */}
          <div
            className={`cursor-pointer px-2 sm:px-4 py-1 sm:py-2 relative text-sm sm:text-base md:text-lg ${
              activeTab === "reviews" ? "text-[var(--accent-color)]" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </div>

          {/* Underline Animation */}
          <div
            className="absolute bottom-0 h-[2px] bg-[var(--accent-color)] transition-all duration-300 ease-in-out"
            style={{
              width: "80px",
              left:
                activeTab === "description"
                  ? "calc(50% - 119px)"
                  : "calc(50% + 40px)",
            }}
          ></div>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4">
          {activeTab === "description" && (
            <div>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">
                {product.description || "No description available for this product."}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Reviews List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => review && (
                      <div
                        key={review._id}
                        className="bg-[#f8f8f8] p-6 rounded-[20px] shadow-sm relative"
                      >
                        {/* Edit/Delete buttons for the review owner */}
                        {currentUserId && review.userId && currentUserId === review.userId && (
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="text-gray-500 hover:text-[var(--accent-color)] transition-colors"
                              title="Edit review"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                              title="Delete review"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={18}
                                  className={
                                    star <= (review.rating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-[var(--primary-color)]">
                              {review.rating || 0}.0
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt || Date.now()).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {review.review || review.comment || "No comment provided"}
                        </p>
                        <p className="text-sm font-medium text-[var(--accent-color)]">
                          - {(review.userId && userNames[review.userId]) || review.userId || "Anonymous"}
                          {console.log(review)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#f8f8f8] p-6 rounded-[20px] text-center">
                    <p className="text-gray-700">
                      No reviews yet. Be the first to write one!
                    </p>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div
                id="review-form"
                className="mt-8 bg-[#f8f8f8] p-6 rounded-[20px] shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4 text-[var(--primary-color)]">
                  {editingReviewId
                    ? "Edit Your Review"
                    : userReview
                    ? "Update Your Review"
                    : "Write a Review"}
                </h3>
                {(!userReview || editingReviewId) ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={
                                star <= (hoverRating || rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="review"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Review
                      </label>
                      <textarea
                        id="review"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isReviewLoading || !token}
                        className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-[15px] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 transition-colors duration-200 font-medium"
                      >
                        {isReviewLoading
                          ? "Submitting..."
                          : editingReviewId
                          ? "Update Review"
                          : "Submit Review"}
                      </button>
                      {editingReviewId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[15px] hover:bg-gray-300 focus:outline-none transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    
                    {!token && (
                      <p className="text-sm text-red-500 mt-2">
                        Please log in to submit a review
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-700 mb-4">
                      You've already submitted a review for this product.
                    </p>
                    <button
                      onClick={() => handleEditReview(userReview)}
                      className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-[15px] hover:bg-opacity-90 focus:outline-none transition-colors duration-200 font-medium"
                    >
                      Edit Your Review
                    </button>
                  </div>
                )}
              </div>
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
  );
};

export default SingleCollection