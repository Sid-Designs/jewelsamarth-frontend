import React from 'react'
import '../assets/styles/Cart.css'

const Cart = () => {
    return (
        <>
            <div className='flex justify-around items-center mx-8 my-4'>
                <div className='w-[65%] flex flex-col'>
                    <div className='cartTitle rounded-[20px] px-2 pl-4 py-1 mb-4'>Shopping Cart</div>
                    <div className='shopCart overflow-y-scroll flex flex-col gap-2'>
                        <div className='boxShadow border p-4 mx-2 pl-4 my-2 flex justify-around gap-4 rounded-[20px] items-center'>
                            <div className='cartImg w-fit'>
                                <img className='object-cover w-full h-full rounded-[20px]' src="https://images.unsplash.com/photo-1617117811969-97f441511dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxlcnl8ZW58MHx8MHx8fDA%3D" alt="Product Image" />
                            </div>
                            <div className='w-full grow w-full'>
                                <div className='flex gap-2 items-start justify-start'>
                                    <div className="cartRegPrice font-bold text-xl">₹2,799.00</div>
                                    <div className="cartSalePrice text-gray-500 line-through">₹4,799</div>
                                </div>
                                <div className='font-bold text-lg mb-2'>
                                    Product Name
                                </div>
                                <button className='border px-3 rounded-[20px] text-sm py-1'>Remove</button>
                            </div>
                            <div className='w-[15%] flex gap-4'>
                                <button className='border px-2 text-xl'>-</button>
                                <div>1</div>
                                <button className='border px-2 text-xl'>+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ordrDtl w-[25%] border p-6 rounded-[20px] shadow-lg bg-white self-start mt-16">
                    {/* Title */}
                    <div className="font-bold text-2xl text-gray-800 mb-4">Order Details</div>

                    <div className="mb-4">
                        <div className="text-gray-700 font-semibold">Coupons</div>
                        <form className="flex items-center border overflow-hidden mt-2">
                            <input type="text" spellCheck="false" className="uppercase w-full px-4 py-2 outline-none text-gray-700" placeholder="Enter coupon code" />
                            <button className="cupnBtn px-4 py-2 font-semibold">Apply</button>
                        </form>
                    </div>

                    {/* Price Breakdown */}
                    <div className="flex flex-col gap-3 text-gray-700">
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

                    {/* Place Order Button */}
                    <button className="w-full px-6 py-3 mt-6 bg-[var(--accent-color)] text-white text-lg font-semibold rounded-[20px] hover:bg-[var(--primary-color)] transition-all">
                        Place Order
                    </button>
                </div>

            </div>
        </>
    )
}

export default Cart