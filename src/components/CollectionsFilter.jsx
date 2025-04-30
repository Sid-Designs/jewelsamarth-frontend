import React, { useState, useEffect, useRef } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import '../assets/styles/CollectionsPage.css';

const filterOptions = {
  "Product Type": ["Rings", "Necklaces", "Bracelets"],
  "Price": ["Under ₹500", "₹500 - ₹1000", "Above ₹1000"],
  "Shop For": ["Men", "Women", "Unisex"],
  "Color": ["Gold", "Silver", "Rose Gold"],
  "Style": ["Classic", "Modern", "Nose Pins"],
  "Stone": ["Pearl", "Rudraksh"]
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

const CollectionsFilter = ({ onFiltersChange, onSortChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [sortBy, setSortBy] = useState("Featured");

  const [filters, setFilters] = useState(() =>
    Object.keys(filterOptions).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {})
  );

  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Send updated filters to parent
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters]);

  // Send updated sort to parent
  useEffect(() => {
    onSortChange?.(sortBy);
  }, [sortBy]);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (category, option) => {
    setFilters((prev) => {
      const updated = { ...prev };
      const isSelected = updated[category].includes(option);

      // Single-select for all filters except "Style"
      const isMulti = category === "Style";

      if (isMulti) {
        updated[category] = isSelected
          ? updated[category].filter(item => item !== option)
          : [...updated[category], option];
      } else {
        updated[category] = isSelected ? [] : [option];
      }

      return updated;
    });
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    setActiveDropdown(null);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredFilter(null);
      if (activeDropdown !== 'sort') setActiveDropdown(null);
    }, 200);
  };

  const handleMouseEnter = (filter) => {
    clearTimeout(timeoutRef.current);
    setHoveredFilter(filter);
    setActiveDropdown(filter);
  };

  const renderFilterDropdown = (category) => (
    <div className="absolute left-0 top-full bg-white shadow-lg px-2 py-1 mt-2 w-48 border rounded-[20px] animate-dropdown-in z-10">
      {filterOptions[category].map((option) => {
        const selected = filters[category].includes(option);
        return (
          <div
            key={option}
            className={`flex items-center gap-2 p-2 my-2 cursor-pointer rounded-lg transition-all duration-200 ${selected ? 'bg-[var(--accent-color)] text-white' : 'hover:bg-gray-200'} rounded-xl`}
            onClick={() => toggleFilter(category, option)}
          >
            <input
              type={category === "Style" ? "checkbox" : "radio"}
              checked={selected}
              readOnly
              className="hidden"
            />
            <label>{option}</label>
          </div>
        );
      })}
    </div>
  );

  const renderSortDropdown = () => (
    <div className="absolute z-40 right-0 top-full bg-white shadow-lg p-3 mt-2 w-48 border rounded-[20px] animate-dropdown-in">
      {sortOptions.map((option) => (
        <div
          key={option}
          className="p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition-all duration-200"
          onClick={() => handleSortChange(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={dropdownRef}
      className="flex justify-between items-start w-full p-2 px-4 relative bg-cover bg-center transition-all duration-300"
      style={{
        backgroundImage: hoveredFilter ? `url(${backgroundImages[hoveredFilter]})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      {/* Filter Section */}
      <div className="filter w-full">
        <ul className="flex justify-start gap-8 items-center w-full h-full filterItems">
          {Object.keys(filterOptions).map((category) => (
            <li
              key={category}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-[5px] cursor-pointer transition-transform duration-300">
                {category}
                <VscChevronDown />
              </div>
              {activeDropdown === category && renderFilterDropdown(category)}
            </li>
          ))}
        </ul>
      </div>

      {/* Sort Section */}
      <div className="sort w-fit min-w-[25%] flex justify-end relative">
        <div className="flex justify-center items-center gap-4 relative cursor-pointer">
          <span>Sort</span>
          <div
            className="flex items-center gap-[5px] p-2 border rounded-lg bg-white shadow-md transition-transform duration-300"
            onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
          >
            {sortBy}
            <VscChevronDown />
          </div>
          {activeDropdown === "sort" && renderSortDropdown()}
        </div>
      </div>
    </div>
  );
};

export default CollectionsFilter;
