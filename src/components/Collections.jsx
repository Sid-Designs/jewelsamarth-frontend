import React, { useState } from 'react';

const Collections = (productData) => {
    const [hovered, setHovered] = useState(false);
    const mainImg = productData.productData.images[0];
    const subImg = productData.productData.subImages[1];
    const product = {
        name: productData.productData.name,
        price: productData.productData.saleprice,
        oldPrice: productData.productData.regprice,
        category: productData.productData.productCategory,
        images: [
            mainImg,
            subImg]
    };

    return (
        <div className="border rounded-[20px] p-4 shadow-md bg-white relative transition-all duration-300 hover:shadow-lg w-80 m-4">
            {/* Image Section with Smooth Hover Transition */}
            <a href={`/products/${productData.productData._id}`}>
                <div
                    className="w-full h-64 overflow-hidden rounded-[15px] cursor-pointer relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Default Image */}
                    <img
                        src={product.images[0]}
                        alt="Product Image"
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100 scale-100"
                            }`}
                    />
                    {/* Hover Image */}
                    <img
                        src={product.images[1]}
                        alt="Product Hover Image"
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0 scale-100"
                            }`}
                    />
                </div>
            </a>
            {/* Details Section */}
            <div className="mt-4 text-center">
                <a href={`/products/${productData.productData._id}`}>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-xl font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                        <span className="text-gray-500 line-through text-sm">₹{product.oldPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">{product.category}</p>
                </a>
                {/* Add to Cart Button */}
                <button className="w-full bg-[var(--accent-color)] text-white py-2 mt-3 rounded-[20px] font-semibold hover:bg-[var(--primary-color)] transition-all">
                    Add To Cart
                </button>
            </div>
        </div>
    );
};

export default Collections;
