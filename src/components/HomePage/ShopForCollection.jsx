import React from 'react'
import men from '@/assets/images/ShopForMen.png'
import women from '@/assets/images/ShopForWomen.png'
import { useNavigate } from 'react-router-dom'

const ShopForCollection = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='flex justify-center gap-2 items-center flex-col py-8'>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>Shop For</h2>
                <p className='text-gray-500 text-sm sm:text-md'>Shop By Recipient</p>
            </div>
            <div onClick={() => {navigate('/collections/men')}} className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 p-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8'>
                <div className='w-full sm:w-1/2 h-48 sm:h-52 md:h-56 lg:h-60 bg-[#efefef] rounded-[20px]'>
                    <img src={men} alt="Men" className='object-cover h-full w-full rounded-[20px] transition duration-300 ease-in-out cursor-pointer hover:scale-[1.025]' />
                </div>
                <div onClick={() => {navigate('/collections/women')}} className='w-full sm:w-1/2 h-48 sm:h-52 md:h-56 lg:h-60 bg-[#efefef] rounded-[20px]'>
                    <img src={women} alt="Women" className='object-cover h-full w-full rounded-[20px] transition duration-300 ease-in-out cursor-pointer hover:scale-[1.025]' />
                </div>
            </div>
        </div>
    )
}

export default ShopForCollection