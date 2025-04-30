import React from 'react'

const SingleCollectionLoading = () => {
    return (
        <>
            <div className='flex flex-col lg:flex-row'>
                <div className='w-full flex flex-col md:flex-row px-4 order-1'>
                    <ul className="flex md:flex-col gap-4 w-full md:w-fit md:mx-4 order-2 md:order-1 justify-center items-center md:justify-start md:my-4 md:items-center md:ml-0">
                        {Array(4)
                            .fill(null)
                            .map((_, i) => (
                                <li
                                    key={i}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-[#efefef] rounded-xl"
                                ></li>
                            ))}
                    </ul>
                    <div className='flex-1 my-4 bg-[#efefef] rounded-xl min-h-[250px] sm:min-h-[300px] md:order-2'></div>
                </div>
                <div className='w-full p-4 order-2 flex flex-col gap-2 mt-2 md:mt-0'>
                    <div className="h-14 w-4/4 bg-[#efefef] rounded block"></div>
                    <div className="flex gap-3 items-center py-2 flex">
                        <div className="h-8 w-24 bg-[#efefef] rounded"></div>
                        <div className="h-6 w-16 bg-[#efefef] rounded"></div>
                    </div>
                    <div className='h-8 w-2/4 bg-[#efefef] rounded'></div>
                    <div className='h-8 w-3/4 bg-[#efefef] rounded'></div>
                    <div className='flex gap-2'>
                        <div className='h-10 w-2/4 bg-[#efefef] rounded'></div>
                        <div className='h-10 w-1/4 bg-[#efefef] rounded'></div>
                    </div>
                    <ul className="flex gap-4">
                        {Array(3)
                            .fill(null)
                            .map((_, i) => (
                                <li key={i} className="h-8 w-1/4 bg-[#efefef] rounded"></li>
                            ))}
                    </ul>
                    <div className='h-8 w-3/4 bg-[#efefef] rounded'></div>
                    <div className='h-24 w-4/4 bg-[#efefef] rounded'></div>
                </div>
            </div>
        </>
    )
}

export default SingleCollectionLoading