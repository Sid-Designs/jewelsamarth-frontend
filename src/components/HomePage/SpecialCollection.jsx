import React from 'react';
import pendantCollection from '@/assets/images/pendantCollection.webp'
import gemstoneRing from '@/assets/images/gemStoneRing.webp'
import customizeJewelery from '@/assets/images/customizeJewelery.webp'
import cufflink from '@/assets/images/cufflink.webp'
import kidsJewelery from '@/assets/images/kidsJewelery.webp'


const SpecialCollection = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className='flex justify-center gap-2 items-center flex-col py-8'>
        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>Special Collection</h2>
        <p className='text-gray-500 text-sm sm:text-md'>Our Special Collection</p>
      </div>
      <div className='flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-6 lg:mb-8'>
        <div className='w-full md:w-1/4 h-48 sm:h-56 md:h-64 lg:h-[400px] bg-[#efefef] rounded-[20px] overflow-hidden'>
          <img src={pendantCollection} alt="Pendant Collection" className='object-fit h-full w-full' />
        </div>
        <div className='w-full md:w-1/4 h-48 sm:h-56 md:h-64 lg:h-[400px] bg-[#efefef] rounded-[20px] overflow-hidden'>
          <img src={gemstoneRing} alt="Gemstone Ring" className='object-fit h-full w-full' />
        </div>
        <div className='w-full md:w-1/2 h-48 sm:h-56 md:h-64 lg:h-[400px] bg-[#efefef] rounded-[20px] overflow-hidden'>
          <img src={customizeJewelery} alt="Customie Jewelry" className='object-fit h-full w-full' />
        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8'>
        <div className='w-full md:w-1/2 h-48 sm:h-56 md:h-64 lg:h-[400px] bg-[#efefef] rounded-[20px] overflow-hidden'>
          <img src={cufflink} alt="Cufflink" className='object-fit h-full w-full' />
        </div>
        <div className='w-full md:w-1/4 h-48 sm:h-56 md:h-64 lg:h-[400px] bg-[#efefef] rounded-[20px] overflow-hidden'>
          <img src="http://jewelsamarth.com/wp-content/uploads/2024/02/p3.jpg" alt="NosePin Collection" className='object-cover h-full w-full' /></div>
        <div className='w-full md:w-1/4 h-48 sm:h-56 md:h-64 lg:h-[400px] bg-[#efefef] rounded-[20px] overflow-hidden'>
          <img src={kidsJewelery} alt="Kids Jewelry" className='object-fit h-full w-full' />
        </div>
      </div>
    </div>
  );
};

export default SpecialCollection;