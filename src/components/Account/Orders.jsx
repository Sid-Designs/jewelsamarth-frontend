import React, { useState } from 'react'

const Orders = () => {
  return (
    <>
      <div className='flex justify-center items-center w-full'>
        <div className='flex flex-col gap-4 justify-center w-full'>
          <div className=' overflow-y-auto w-full flex flex-col'>
            <div className="flex flex-col gap-2">
              <div className="boxShadow cursor-pointer p-4 mx-2 pl-4 my-2 flex justify-around gap-4 rounded-[20px] items-center">
                {/* Product Image */}
                <div className="w-[200px] h-[100px]">
                  <img
                    className="object-cover w-full h-full rounded-[20px]"
                    src="https://images.unsplash.com/photo-1617117811969-97f441511dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxlcnl8ZW58MHx8MHx8fDA%3D"
                    alt="Product Image"
                  />
                </div>

                {/* Product Details */}
                <div className="w-full grow">
                  <div className="flex gap-2 items-start justify-start">
                    <div className="cartRegPrice font-bold text-xl">₹2,799.00</div>
                    <div className="cartSalePrice text-gray-500 line-through">₹4,799</div>
                  </div>
                  <div className="font-bold text-lg mb-2">Product Name</div>
                </div>

                {/* Delivery and Actions */}
                <div className="w-[50%] flex flex-col gap-2">
                  <div className="w-full flex flex-col gap-2 text-sm">
                    <div className="px-2 flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      <span>Delivered On Oct 14, 2024</span>
                    </div>
                    <div className="px-2 text-green-600 font-semibold">
                      Your item has been delivered
                    </div>
                    <button
                      className="px-2 text-blue-600 hover:text-blue-700 transition-colors w-fit flex items-center gap-2"
                      aria-label="Rate and Review Product"
                    >
                      Rate & Review Product
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>
  )
}

export default Orders