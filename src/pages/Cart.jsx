import { useEffect, useState } from "react"
import jwtDecode from "jwt-decode"
import "../assets/styles/Cart.css"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi"

const Cart = () => {
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                if (token) {
                    const decodedToken = jwtDecode(token)
                    const data = { userId: decodedToken.id }
                    const res = await axios.post("https://api.jewelsamarth.in/api/cart/get", data)
                    setCartData(res.data.data)
                } else {
                    console.error("Token not found")
                    toast.error("Please login to view your cart")
                }
            } catch (error) {
                console.error("Error fetching cart data:", error.message)
                toast.error("Failed to load cart data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

            setCartData(prev => prev.map(item =>
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

            setCartData(prev => prev.map(item =>
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

            setCartData(prev => prev.filter(item => item._id !== productId))

            toast.error("Item removed from cart")
        } catch (error) {
            console.error("Error removing item:", error)
            toast.error("Failed to remove item")
        } finally {
            setUpdating(false)
        }
    }

    const handlePlaceOrder = () => {
        if (cartData.length === 0) {
            toast.error("Your cart is empty")
            return
        }
        navigate("/checkout")
    }

    const calculateTotal = () => {
        return cartData.reduce((sum, item) => sum + item.saleprice * item.quantity, 0)
    }

    const calculateDiscount = () => {
        return cartData.reduce((sum, item) => sum + (item.regprice - item.saleprice) * item.quantity, 0)
    }

    const calculateSubtotal = () => {
        return cartData.reduce((sum, item) => sum + item.regprice * item.quantity, 0)
    }

    // Sample data for suggested products (placeholder)
    const suggestedProducts = [
        { id: 1, name: "Gold Necklace", price: 24999, image: "https://via.placeholder.com/150" },
        { id: 2, name: "Silver Bracelet", price: 5999, image: "https://via.placeholder.com/150" },
        { id: 3, name: "Diamond Earrings", price: 34999, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Pearl Set", price: 12999, image: "https://via.placeholder.com/150" },
    ]

    return (
        <>
            <div className="px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col gap-4">
                        <div className="h-32 animate-pulse w-full bg-[#efefef] rounded-[20px] fadeOut"></div>
                        <div className="h-32 animate-pulse w-full bg-[#efefef] rounded-[20px] fadeOut"></div>
                    </div>
                ) : cartData.length > 0 ? (
                    <div className="flex flex-col md:flex-row lg:justify-between lg:gap-8">
                        {/* Left Section: Shopping Cart */}
                        <div className="w-full lg:w-[65%]">
                            <div className="cartTitle rounded-[20px] px-2 pl-4 py-1 mb-4">Shopping Cart</div>
                            <div className="shopCart">
                                {cartData.map((item, index) => (
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
                        </div>

                        {/* Right Section: Order Details - Only shown when cart has items */}
                        <div className="ordrDtl w-full h-fit md:w-[40%] lg:w-[30%] md:ml-4 md:mt-14 border p-6 rounded-[20px] shadow-lg bg-white lg:sticky lg:top-4 mt-6 lg:mt-16">
                            <div className="font-bold text-2xl text-gray-800 mb-4">Order Details</div>
                            <div className="flex flex-col gap-3 text-gray-700">
                                <div className="flex justify-between text-lg">
                                    <div>Total Price</div>
                                    <div className="font-medium">₹{calculateSubtotal().toLocaleString()}</div>
                                </div>

                                <div className="flex justify-between text-lg">
                                    <div>Discount</div>
                                    <div className="text-green-500 font-medium">− ₹{calculateDiscount().toLocaleString()}</div>
                                </div>

                                <div className="flex justify-between text-lg">
                                    <div>Delivery Charges</div>
                                    <div className="text-green-500 font-medium">Free</div>
                                </div>
                            </div>

                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between text-xl font-semibold">
                                    <div>Total Amount</div>
                                    <div className="text-gray-800">₹{calculateTotal().toLocaleString()}</div>
                                </div>
                            </div>

                            <button
                                className="w-full px-6 py-3 mt-6 bg-[var(--accent-color)] text-white text-lg font-semibold rounded-[20px] hover:bg-[var(--primary-color)] transition-all"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-12">
                        <div className="text-center max-w-md">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <button
                                className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-[20px] hover:bg-[var(--primary-color)] transition-all"
                                onClick={() => navigate("/")}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}

                {/* Suggested Products Section - Only shown when cart has items */}
                {cartData.length > 0 && (
                    <>
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Suggested Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {suggestedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <h3 className="font-medium">{product.name}</h3>
                                            <p className="text-purple-700 font-bold mt-1">₹{product.price.toLocaleString()}</p>
                                            <button className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Similar Products Section */}
                        <div className="mt-12 mb-8">
                            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {suggestedProducts
                                    .slice()
                                    .reverse()
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-medium">{product.name}</h3>
                                                <p className="text-purple-700 font-bold mt-1">₹{product.price.toLocaleString()}</p>
                                                <button className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Cart