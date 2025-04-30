import { useState, useEffect } from 'react';

const Checkout = ({ setIsFormComplete, formData, setFormData }) => {
    const maxLength = 200;

    const handleInputChange = (event) => {
        const { id, value } = event.target;

        if (id === "phone" && value.length > 10) return;

        setFormData((prev) => ({
            ...prev,
            [id]: id === "address" ? value.slice(0, maxLength) : value,
        }));
    };

    useEffect(() => {
        setIsFormComplete(Object.values(formData).every(value => value.trim() !== ''));
    }, [formData, setIsFormComplete]);

    return (
        <>
            <div className='flex items-center mx-8 my-4'>
                <div className='flex flex-col gap-2 w-full'>
                    <div className='flex flex-col gap-2'>
                        <form className='flex flex-col gap-8'>
                            <div className='checkForm flex gap-4'>
                                <div className='relative w-full'>
                                    <input type='text' id='firstName' className='w-full p-2 px-4' placeholder='First Name' onChange={handleInputChange} value={formData.firstName} />
                                </div>
                                <div className='relative w-full'>
                                    <input type='text' id='lastName' className='w-full p-2 px-4' placeholder='Last Name' onChange={handleInputChange} value={formData.lastName} />
                                </div>
                            </div>
                            <div className='checkForm flex gap-4'>
                                <div className='relative w-full'>
                                    <input type='number' id='phone' className='w-full p-2 px-4' placeholder='Mobile Number' onChange={handleInputChange} value={formData.phone} />
                                </div>
                                <div className='relative w-full'>
                                    <input type='number' id='pincode' className='w-full p-2 px-4' placeholder='Pincode' onChange={handleInputChange} value={formData.pincode} />
                                </div>
                            </div>
                            <div className='checkForm'>
                                <div className='relative w-full'>
                                    <textarea id='address' spellCheck="false" className='address w-full p-2 px-4' rows='4' cols='50' value={formData.address} onChange={handleInputChange} placeholder='Address'></textarea>
                                    <p className='text-right text-gray-500 px-2' >{formData.address.length}/{maxLength} characters</p>
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
        </>
    );
};

export default Checkout;
