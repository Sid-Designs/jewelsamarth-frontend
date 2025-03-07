import { React, useState } from 'react';

const Checkout = () => {
    const [text, setText] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        mobNum: '',
        pinCode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
    });

    const maxLength = 200;

    const handleChange = (event) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
            setFormData((prev) => ({ ...prev, address: event.target.value }));
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const isFormComplete = Object.values(formData).every((value) => value.trim() !== '');

    return (
        <>
            <div className='flex justify-around items-center mx-8 my-4'>
                <div className='w-[65%] flex flex-col'>
                    <div className='cartTitle rounded-[20px] px-2 pl-4 py-1 mb-4'>Order Summary</div>
                    <div className='flex flex-col gap-2'>
                        <div className='boxShadow mx-2 border p-4 pl-4 my-2 flex justify-around gap-4 rounded-[20px] items-center'>
                            <div className='cartImg w-fit'>
                                <img className='object-cover w-full h-full rounded-[20px]' src="https://images.unsplash.com/photo-1617117811969-97f441511dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxlcnl8ZW58MHx8MHx8fDA%3D" alt="Product Image" />
                            </div>
                            <div className='w-full grow'>
                                <div className='flex gap-2 items-start justify-start'>
                                    <div className="cartRegPrice font-bold text-xl">₹2,799.00</div>
                                    <div className="cartSalePrice text-gray-500 line-through">₹4,799</div>
                                </div>
                                <div className='font-bold text-lg mb-2'>
                                    Product Name
                                </div>
                            </div>
                            <div className='w-[15%] flex gap-4'>
                                <button className='border px-2 text-xl'>-</button>
                                <div>1</div>
                                <button className='border px-2 text-xl'>+</button>
                            </div>
                        </div>
                        <div className='cartTitle rounded-[20px] px-2 pl-4 py-1 mb-4'>Confirm Address</div>
                        <div className='flex flex-col gap-2 px-2 pl-4 py-1'>
                            <form className='flex flex-col gap-8'>
                                <div className='checkForm flex gap-4'>
                                    <div className='relative w-full'>
                                        <input type='text' id='name' className='w-full p-2 px-4' placeholder='Name' onChange={handleInputChange} value={formData.name} />
                                    </div>
                                    <div className='relative w-full'>
                                        <input type='number' id='mobNum' maxLength={10} className='w-full p-2 px-4' placeholder='Mobile Number' onChange={handleInputChange} value={formData.mobNum} />
                                    </div>
                                </div>
                                <div className='checkForm flex gap-4'>
                                    <div className='relative w-full'>
                                        <input type='number' id='pinCode' className='w-full p-2 px-4' placeholder='Pincode' onChange={handleInputChange} value={formData.pinCode} />
                                    </div>
                                    <div className='relative w-full'>
                                        <input type='text' id='locality' className='w-full p-2 px-4' placeholder='Locality' onChange={handleInputChange} value={formData.locality} />
                                    </div>
                                </div>
                                <div className='checkForm'>
                                    <div className='relative w-full'>
                                        <textarea id='address' spellCheck="false" className='address w-full p-2 px-4' rows='4' cols='50' value={text} onChange={handleChange} placeholder='Address'></textarea>
                                        <p className='text-right text-gray-500 px-2'>{text.length}/{maxLength} characters</p>
                                    </div>
                                </div>
                                <div className='checkForm flex gap-4'>
                                    <div className='relative w-full'>
                                        <input type='text' id='city' className='w-full p-2 px-4' placeholder='City' onChange={handleInputChange} value={formData.city} />
                                    </div>
                                    <div className='relative w-full'>
                                        <input type='text' id='state' className='w-full p-2 px-4' placeholder='State' onChange={handleInputChange} value={formData.state} />
                                    </div>
                                </div>
                            </form>
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

                    {/* Checkout Button (Only Visible if Form is Complete) */}
                    {isFormComplete && (
                        <button className="w-full px-6 py-3 mt-6 bg-[var(--accent-color)] text-white text-lg font-semibold rounded-[20px] hover:bg-[var(--primary-color)] transition-all">
                            Proceed to Checkout
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Checkout;
