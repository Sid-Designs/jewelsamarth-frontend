import React, { useEffect, useRef } from 'react'

const CustomerStories = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId;
        let scrollPosition = 0;
        const speed = 1; // Adjust speed as needed

        const scroll = () => {
            scrollPosition += speed;
            if (scrollPosition >= container.scrollWidth / 2) {
                scrollPosition = 0;
            }
            container.scrollLeft = scrollPosition;
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        // Pause on hover
        const handleMouseEnter = () => {
            cancelAnimationFrame(animationFrameId);
        };

        const handleMouseLeave = () => {
            animationFrameId = requestAnimationFrame(scroll);
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const items = [
        { 
            id: 1, 
            content: "Great products and designs and such great quality, they always wash up well no matter how many times I wash them.",
            name: "Viraj Thakur",
            role: "Frequent Buyer",
            rating: 5
        },
        { 
            id: 2, 
            content: "The customer service is exceptional. They went above and beyond to help me with my order.",
            name: "Atharva Mokal",
            role: "First-time Customer",
            rating: 5
        },
        { 
            id: 3, 
            content: "I've been a loyal customer for years. Consistent quality and fast shipping every time.",
            name: "Vedant Kadam",
            role: "Loyal Customer",
            rating: 4
        },
        { 
            id: 4, 
            content: "The products exceeded my expectations. Will definitely purchase again!",
            name: "Atharva Kanekar",
            role: "Satisfied Customer",
            rating: 5
        },
        { 
            id: 5, 
            content: "Good value for money. The items arrived well-packaged and in perfect condition.",
            name: "Varad Sarange",
            role: "Budget Shopper",
            rating: 4
        },
        { 
            id: 6, 
            content: "Amazing selection and quality. Highly recommend to anyone looking for premium products.",
            name: "Tushar Baravarkar",
            role: "Product Reviewer",
            rating: 5
        },
    ];

    const duplicatedItems = [...items, ...items];

    // Function to render star ratings
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className='flex justify-center gap-2 items-center flex-col py-8'>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>Customer Stories</h2>
                <p className='text-gray-500 text-sm sm:text-md'>What Our Customers Have to Say</p>
            </div>
            <div
                ref={containerRef}
                className="flex overflow-x-auto gap-4 scrollbar-hide pb-6"
            >
                {duplicatedItems.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className="w-[80vw] sm:w-[45vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] min-w-[300px] bg-white rounded-[20px] flex-col items-center flex-shrink-0 flex p-6 text-center shadow-sm border border-gray-100"
                    >
                        <div className="mb-4">
                            {renderStars(item.rating)}
                        </div>
                        <p className="text-gray-600 italic mb-6">"{item.content}"</p>
                        <div className='flex items-center justify-center gap-4 mt-auto'>
                            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                                <span className="text-gray-400 font-medium text-lg">
                                    {item.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomerStories