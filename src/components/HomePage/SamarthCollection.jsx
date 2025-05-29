import React from 'react'
import pearlCollection from '@/assets/images/pearlCollection.webp'
import mangalsutraCollection from '@/assets/images/mangalsutraCollection.webp'
import { useNavigate } from 'react-router-dom'


const SamarthCollection = () => {
  const navigate = useNavigate();
  return (
    <div className='pt-8'>
      <div className='flex justify-center gap-2 items-center flex-col px-4'>
        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>Samarth Essential</h2>
        <p className='text-gray-500 text-sm sm:text-md'>Our New Collection</p>
      </div>
      <div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 p-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8'>
        <div onClick={() => {navigate('/collections/pearl')}} className='w-full sm:w-1/2 h-48 sm:h-52 md:h-56 lg:h-60 bg-[#efefef] rounded-[20px]'>
          <img src={pearlCollection} alt="Pearl Collection" className='object-cover h-full w-full rounded-[20px] transition duration-300 ease-in-out cursor-pointer hover:scale-[1.025]'/>
        </div>
        <div onClick={() => {navigate('/collections/mangalsutra')}} className='w-full sm:w-1/2 h-48 sm:h-52 md:h-56 lg:h-60 bg-[#efefef] rounded-[20px]'>
          <img src={mangalsutraCollection} alt="MangalSutra Collection" className='object-cover h-full w-full rounded-[20px] transition duration-300 ease-in-out cursor-pointer hover:scale-[1.025]'/>
        </div>
      </div>
    </div>
  )
}

export default SamarthCollection