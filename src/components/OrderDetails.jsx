import React from 'react'

const OrderDetails = () => {
    return (
        <div className="ordrDtl w-[25%] border p-6 rounded-[20px] shadow-lg bg-white self-start mt-16">
            {/* Title */}
            <div className="font-bold text-2xl text-gray-800 mb-4">Order Details</div>

            {/* Coupons Section */}
            <div className="mb-4">
                <div className="text-gray-700 font-semibold">Coupons</div>
                <form className="flex items-center border overflow-hidden mt-2">
                    <input type="text" spellCheck="false" className="uppercase w-full px-4 py-2 outline-none text-gray-700" placeholder="Enter coupon code" />
                    <button className="cupnBtn px-4 py-2 font-semibold">Apply</button>
                </form>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-3 mt-4 text-gray-700">
                <div className="flex justify-between text-lg">
                    <div>Price</div>
                    <div className="font-medium">₹2,999</div>
                </div>
                <div className="flex justify-between text-lg">
                    <div>Discount</div>
                    <div className="text-green-500 font-medium">− ₹1,752</div>
                </div>
                <div className="flex justify-between text-lg">
                    <div>Delivery Charges</div>
                    <div className="text-green-500 font-medium">Free</div>
                </div>
            </div>

            {/* Total Amount */}
            <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-xl font-semibold">
                    <div>Total Amount</div>
                    <div className="text-gray-800">₹2,999</div>
                </div>
            </div>

            {/* Checkout Button */}
            <button className="checkOut w-full px-6 py-3 mt-6 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all">
                Complete Payment
            </button>
        </div>
    )
}

export default OrderDetails