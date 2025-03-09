import React, { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import '../assets/styles/Cart.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const data = { userId: decodedToken.id };
                    const res = await axios.post("https://api.jewelsamarth.in/api/cart/get", data);
                    toast.success("Product Added successfully");
                    setCartData(res.data.data);
                } else {
                    toast.error("Please Sign In And Try Again...");
                }
            } catch (error) {
                toast.error("Error fetching cart data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className='flex justify-around items-center mx-8 my-4'>
                {/* Left Section: Shopping Cart */}
                <div className='w-[65%] flex flex-col'>
                    <div className='cartTitle rounded-[20px] px-2 pl-4 py-1 mb-4'>Shopping Cart</div>
                    <div className='shopCart overflow-y-scroll flex flex-col gap-2'>
                        {loading ? (
                            <p>Loading cart data...</p>
                        ) : cartData.length > 0 ? (
                            cartData.map((item, index) => (
                                <div
                                    key={index}
                                    className='boxShadow border p-4 mx-2 pl-4 my-2 flex justify-around gap-4 rounded-[20px] items-center'
                                >
                                    <div className='cartImg w-fit'>
                                        <img
                                            className='object-cover w-full h-full rounded-[20px]'
                                            src={item.images || "https://via.placeholder.com/150"} // Fallback for missing image
                                            alt={item.name || "Product Image"}
                                        />
                                    </div>
                                    <div className='w-full grow'>
                                        <div className='flex gap-2 items-start justify-start'>
                                            <div className="cartRegPrice font-bold text-xl">₹{item.saleprice}</div>
                                            <div className="cartSalePrice text-gray-500 line-through">
                                                {item.regprice ? `₹${item.regprice}` : ""}
                                            </div>
                                        </div>
                                        <div className='text-lg mb-2'>{item.name || "Product Name"}</div>
                                        <button
                                            className='border px-3 rounded-[20px] text-sm py-1'
                                            onClick={() => console.log(`Remove product with ID: ${item._id}`)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className='w-[15%] flex gap-4 items-center'>
                                        <button className='border px-2 text-xl'>-</button>
                                        <div>{item.quantity}</div>
                                        <button className='border px-2 text-xl'>+</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items in your cart.</p>
                        )}
                    </div>
                </div>

                {/* Right Section: Order Details */}
                <div className="ordrDtl w-[25%] border p-6 rounded-[20px] shadow-lg bg-white self-start mt-16">
                    <div className="font-bold text-2xl text-gray-800 mb-4">Order Details</div>
                    <div className="flex flex-col gap-3 text-gray-700">
                        {/* Total Price Calculation */}
                        <div className="flex justify-between text-lg">
                            <div>Total Price</div>
                            <div className="font-medium">
                                ₹{cartData.reduce((sum, item) => sum + (item.regprice * item.quantity), 0)}
                            </div>
                        </div>

                        {/* Discount Calculation */}
                        <div className="flex justify-between text-lg">
                            <div>Discount</div>
                            <div className="text-green-500 font-medium">
                                − ₹{cartData.reduce((sum, item) => sum + ((item.regprice - item.saleprice) * item.quantity), 0)}
                            </div>
                        </div>

                        {/* Delivery Charges */}
                        <div className="flex justify-between text-lg">
                            <div>Delivery Charges</div>
                            <div className="text-green-500 font-medium">Free</div>
                        </div>
                    </div>

                    {/* Total Amount Calculation */}
                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between text-xl font-semibold">
                            <div>Total Amount</div>
                            <div className="text-gray-800">
                                ₹{cartData.reduce((sum, item) => sum + (item.saleprice * item.quantity), 0)}
                            </div>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                        className="w-full px-6 py-3 mt-6 bg-[var(--accent-color)] text-white text-lg font-semibold rounded-[20px] hover:bg-[var(--primary-color)] transition-all"
                        onClick={() => console.log("Place Order Clicked")}
                    >
                        Place Order
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

export default Cart;
