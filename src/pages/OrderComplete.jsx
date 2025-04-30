import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import OrderCompleteAnimation from '@/components/OrderCompleteAnimation';
import OrderCompleteTextAnimation from '@/components/OrderCompleteTextAnimation';
import DeliveryAnimation from '@/components/DeliveryAnimation';
import DeliveryBoxAnimation from '@/components/DeliveryBoxAnimation';
import axios from 'axios';
import '../assets/styles/OrderComplete.css';

const OrderComplete = () => {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [orderDtl, setOrderDtl] = useState({});
    const [prodDtl, setProdDtl] = useState([]);
    const [error, setError] = useState(null);

    const getOrderDetails = async () => {
        try {
            const response = await axios.post(`https://api.jewelsamarth.in/api/order/details/${orderId}`);
            setOrderDtl(response.data);
            const productIds = response.data?.order?.products?.map((item) => item.productId) || [];
            if (productIds.length > 0) {
                const productPromises = productIds.map(id =>
                    axios.get(`https://api.jewelsamarth.in/api/product/${id}`).then(res => res.data)
                );
                const products = await Promise.all(productPromises);
                setProdDtl(products);
            }
        } catch (err) {
            setError("Failed to load order details. Please try again later.");
            console.error("Error fetching order details:", err);
        }
    };

    const hideElement = () => {
        const elements = document.getElementsByClassName('megaMenu');
        for (let element of elements) {
            element.style.display = 'none'; // Hides the element
        }
    }

    useEffect(() => {
        getOrderDetails();
        hideElement();

        // Scroll to a specific position
        window.scrollTo({
            top: 80,
            left: 0,
            behavior: 'smooth',
        });

        // Start fade-out animation after 2.5 seconds
        const fadeTimeout = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        // Hide loader completely after 3 seconds
        const loaderTimeout = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(loaderTimeout);
        };
    }, [orderId]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 rounded-[20px]">
                <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[var(--accent-color)] text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {loading ? (
                <div
                    className={`flex flex-col gap-4 justify-center items-center min-h-screen w-full z-10 bg-[var(--background-color)] transition-opacity duration-500 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
                >
                    <OrderCompleteAnimation />
                    <h2><OrderCompleteTextAnimation /></h2>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8 transition-opacity duration-700 ease-in-out opacity-100 animate-fadeIn">
                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Thank You and Delivery Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Thank You Section */}
                            <div className="bg-white p-6 rounded-xl">
                                <div className="space-y-4">
                                    <h2 className="text-3xl md:text-4xl font-bold">Thank You!</h2>
                                    <div>
                                        <p className="text-xl uppercase font-medium">
                                            {orderDtl?.order?.firstName} {orderDtl?.order?.lastName}
                                        </p>
                                        <p className="text-md font-semibold">
                                            Your order <span className="text-[var(--accent-color)] font-bold">#{orderDtl?.order?.orderNumber}</span> has been successfully placed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Box Animation - Hidden on mobile */}
                            <div className="h-[295px]">
                                <DeliveryBoxAnimation />
                            </div>

                            {/* Delivery Details Section */}
                            <div className="bg-white rounded-[20px] shadow-sm overflow-hidden"
                                style={{
                                    boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.15), 0 6px 12px 0 rgba(0, 0, 0, 0.15)',
                                }}>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3 flex justify-center">
                                        <div className="w-full max-w-xs">
                                            <DeliveryAnimation />
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 space-y-4 p-4">
                                        <p className="text-gray-700">
                                            <h3 className="text-xl font-bold">Delivery Details</h3>
                                            Your order will be delivered within 5-7 business days. Please check your registered email address for the latest updates.
                                        </p>

                                        <div>
                                            <h4 className="font-semibold">Shipping Address:</h4>
                                            <p className="text-gray-700">
                                                123 Green Valley Lane Springfield, Illinois, 62704 United States
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">Contact Details:</h4>
                                            <p className="text-gray-700">+91 {orderDtl?.order?.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order and Payment Details */}
                        <div className="space-y-8">
                            {/* Order Details */}
                            <div className="bg-white p-6 rounded-xl shadow-sm"
                                style={{
                                    boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.15), 0 6px 12px 0 rgba(0, 0, 0, 0.15)',
                                }}>
                                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                                <div className="space-y-4 rounded-[20px] overflow-y-auto orderItemSec h-60">
                                    {prodDtl.length > 0 ? (
                                        prodDtl.map((item, index) => (
                                            <div
                                                className="flex gap-4 p-3 mx-2 rounded-xl items-center border border-gray-100"
                                                key={index}
                                                style={{
                                                    boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.15), 0 6px 12px 0 rgba(0, 0, 0, 0.15)',
                                                }}
                                            >
                                                <div className="w-20 h-20 flex-shrink-0">
                                                    <img
                                                        src={item?.product?.images}
                                                        alt={item?.product?.name}
                                                        className="h-full w-full object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-grow line-clamp-2">
                                                    {item?.product?.name}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='bg-[#efefef] h-48'>

                                        </div>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between pt-3 border-t">
                                        <span>Total Price</span>
                                        <span>₹{orderDtl?.order?.totalAmt || '0'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className='text-green-500'>- ₹{orderDtl?.order?.discount || '0'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charges</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between font-bold py-3 border-y">
                                        <span>Total Amount</span>
                                        <span>₹{orderDtl?.order?.finalAmt || '0'}</span>
                                    </div>
                                </div>
                                {/* Payment Details */}
                                <div className='mt-6'>
                                    <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between pt-3 border-t">
                                            <span>Transaction ID</span>
                                            <span className="font-mono text-sm">{orderDtl?.order?.payment_id || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment Method</span>
                                            <span className="uppercase">{orderDtl?.order?.paymentMethod || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment Status</span>
                                            <span className={`capitalize font-medium ${orderDtl?.order?.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                                }`}>
                                                {orderDtl?.order?.paymentStatus || "pending"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-bold py-3 border-y">
                                            <span>Due Amount</span>
                                            <span>₹{orderDtl?.order?.paymentStatus === "paid" ? "0" : orderDtl?.order?.finalAmt || '0'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderComplete;