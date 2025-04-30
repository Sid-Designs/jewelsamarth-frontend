import React from 'react';
import '../assets/styles/CollectionsLoading.css';

const CollectionsLoading = () => {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col bg-[#efefef] w-full animate-pulse gap-4 clcImg"></div>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8 w-full">
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-4 prodLoadCnt p-4 w-full sm:w-64 md:w-56 lg:w-64 xl:w-72">
                        <div className="bg-[#efefef] w-full animate-pulse h-32 sm:h-48 rounded-xl"></div>
                        <div className="bg-[#efefef] w-full animate-pulse h-6 rounded-xl"></div>
                        <div className="bg-[#efefef] w-full animate-pulse h-6 rounded-xl"></div>
                        <div className="bg-[#efefef] animate-pulse h-8 rounded-xl"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionsLoading;
