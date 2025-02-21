import React, { useState, useEffect, useRef } from 'react';
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import '../assets/styles/CollectionsPage.css';

const filterOptions = {
    "Product Type": ["Rings", "Necklaces", "Bracelets"],
    "Price": ["Under $50", "$50 - $100", "Above $100"],
    "Shop For": ["Men", "Women", "Unisex"],
    "Color": ["Gold", "Silver", "Rose Gold"],
    "Style": ["Classic", "Modern", "Vintage"],
    "Stone": ["Diamond", "Ruby", "Sapphire"]
};

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

const backgroundImages = {
    "Product Type": "https://your-image-url.com/product-type.jpg",
    "Price": "https://your-image-url.com/price.jpg",
    "Shop For": "https://your-image-url.com/shop-for.jpg",
    "Color": "https://your-image-url.com/color.jpg",
    "Style": "https://your-image-url.com/style.jpg",
    "Stone": "https://your-image-url.com/stone.jpg"
};

const CollectionsFilter = () => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [hoveredFilter, setHoveredFilter] = useState(null);
    const [sortBy, setSortBy] = useState("Featured");
    const dropdownRef = useRef(null);

    const toggleFilter = (filter) => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveFilter(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div 
            className='flex justify-between p-2 relative transition-all duration-300 bg-cover bg-center'
            ref={dropdownRef}
            style={{
                backgroundImage: hoveredFilter ? `url(${backgroundImages[hoveredFilter]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 0.5s ease-in-out"
            }}
        >
            {/* Filters */}
            <div className="filter w-full">
                <ul className='flex justify-around items-center filterItems'>
                    {Object.keys(filterOptions).map((filter) => (
                        <li 
                            key={filter} 
                            className='relative'
                            onMouseEnter={() => setHoveredFilter(filter)}
                            onMouseLeave={() => setHoveredFilter(null)}
                        >
                            <div
                                className='flex items-center gap-[5px] cursor-pointer transition-transform duration-300'
                                onClick={() => toggleFilter(filter)}
                            >
                                {filter}
                                {activeFilter === filter ? <VscChevronUp /> : <VscChevronDown />}
                            </div>
                            {activeFilter === filter && (
                                <div className='absolute left-0 top-full bg-white shadow-lg p-3 mt-2 w-48 border rounded-[20px] transition-all duration-300 transform scale-95 opacity-0 animate-dropdown'>
                                    {filterOptions[filter].map((option) => (
                                        <div key={option} className='flex items-center gap-2'>
                                            <input type="checkbox" id={option} />
                                            <label htmlFor={option}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sorting Section */}
            <div className="sort w-full flex justify-end relative">
                <div className='flex justify-center items-center gap-4 relative cursor-pointer'>
                    <span>Sort</span>
                    <div
                        className='flex items-center gap-[5px] p-2 border rounded-lg bg-white shadow-md transition-transform duration-300'
                        onClick={() => setActiveFilter(activeFilter === "sort" ? null : "sort")}
                    >
                        {sortBy} <VscChevronDown />
                    </div>
                    {activeFilter === "sort" && (
                        <div className='absolute z-40 right-0 top-full bg-white shadow-lg p-3 mt-2 w-48 border rounded-[20px] transition-all duration-300 transform scale-95 opacity-0 animate-dropdown'>
                            {sortOptions.map((option) => (
                                <div
                                    key={option}
                                    className='p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition-all duration-200'
                                    onClick={() => {
                                        setSortBy(option);
                                        setActiveFilter(null);
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionsFilter;
