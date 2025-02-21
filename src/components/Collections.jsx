import React, { useState } from 'react';

const product = {
    name: "Gold Evil Eye Diamond Necklace",
    price: 20217,
    oldPrice: 24901,
    category: "Jewellery",
    images: [
        "https://images.unsplash.com/photo-1617117811969-97f441511dee?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1600003014608-c2ccc1570a65?q=80&w=1880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
};

const Collections = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="border rounded-[20px] p-4 shadow-md bg-white relative transition-all duration-300 hover:shadow-lg w-80 m-4">
            {/* Image Section with Smooth Hover Transition */}
            <div
                className="w-full h-64 overflow-hidden rounded-[15px] cursor-pointer relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Default Image */}
                <img
                    src={product.images[0]}
                    alt="Product Image"
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                        hovered ? "opacity-0" : "opacity-100 scale-100"
                    }`}
                />
                {/* Hover Image */}
                <img
                    src={product.images[1]}
                    alt="Product Hover Image"
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                        hovered ? "opacity-100" : "opacity-0 scale-100"
                    }`}
                />
            </div>

            {/* Details Section */}
            <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xl font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-gray-500 line-through text-sm">₹{product.oldPrice.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 mt-1 text-sm">{product.category}</p>

                {/* Add to Cart Button */}
                <button className="w-full bg-[var(--accent-color)] text-white py-2 mt-3 rounded-[20px] font-semibold hover:bg-[var(--primary-color)] transition-all">
                    Add To Cart
                </button>
            </div>
        </div>
    );
};

export default Collections;
