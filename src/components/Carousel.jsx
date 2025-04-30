import summerBanner from '../assets/images/SummerBanner.webp';
import silverBanner from '../assets/images/SilverBanner.jpg';
import AstrologyBanner from '../assets/images/AstrologyBanner.jpg';
import React, { useEffect, useRef, useState } from 'react';
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { Link } from 'react-router-dom'; // Remove if using anchor tags
import '../assets/styles/Carousel.css';

const Carousel = () => {
  const [currSlide, setCurrSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Sample slides data - replace with your actual images and links
  const slides = [
    { 
      url: summerBanner,
      // title: "Summer Collection",
      // subtitle: "Fresh styles for sunny days",
      buttonText: "Shop Summer",
      path: "/summer-collection", // For React Router
      // link: "https://example.com/summer", // For anchor tags
      buttonPosition: "summer-center", // New top-center position
      buttonClass: "bg-[#03853e] text-white" // Custom button style
    },
    { 
      url: silverBanner,
      title: "Finest Jewelry Collection",
      subtitle: "Elegant pieces for every occasion",
      buttonText: "Browse Jewelry",
      path: "/jewelry",
      buttonPosition: "center",
      buttonClass: "bg-[#e5e5e5] text-black"
    },
    { 
      url: AstrologyBanner,
      // title: "Astrology Inspired",
      // subtitle: "Find your zodiac perfect match",
      buttonText: "Discover Now",
      path: "/astrology",
      buttonPosition: "bottom-right",
      buttonClass: "bg-[var(--accent-color)] text-white"
    }
  ];

  const totalSlides = slides.length;
  const slideRef = useRef(null);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handleNext = () => setCurrSlide((curr) => (curr + 1) % totalSlides);
  const handlePrev = () => setCurrSlide((curr) => (curr - 1 + totalSlides) % totalSlides);

  // Update slide position
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = 'transform 0.7s ease-in-out';
      slideRef.current.style.transform = `translateX(-${currSlide * 100}%)`;
    }
  }, [currSlide]);

  // Button position calculator
  const getButtonPosition = (position) => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2', // New top-center
      'top-right': 'top-4 right-4',
      'middle-left': 'top-1/2 left-4 transform -translate-y-1/2',
      'middle-right': 'top-1/2 right-4 transform -translate-y-1/2',
      'center': 'top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-[20%] right-[25%] text',
      'summer-center': 'top-[68%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-6deg]',
      'silver-left': 'top-[70%] left-[20%] transform -translate-x-1/2 -translate-y-1/2',
    };
    return positions[position] || 'bottom-4 left-1/2 transform -translate-x-1/2';
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      
      {/* Slides container */}
      <div ref={slideRef} className="flex h-full w-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            {/* Background image */}
            <img 
              src={slide.url} 
              alt={slide.title} 
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center text-center p-4">
              {/* Title and subtitle */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90">
                  {slide.subtitle}
                </p>
              </div>
              
              {/* Positionable button */}
              <div className={`absolute ${getButtonPosition(slide.buttonPosition)}`}>
                {/* React Router Version */}
                <Link
                  to={slide.path}
                  className={`${slide.buttonClass} text-xl px-8 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  {slide.buttonText}
                </Link>

                {/* Anchor Tag Version (alternative) */}
                {/* <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${slide.buttonClass} px-8 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  {slide.buttonText}
                </a> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Previous slide"
      >
        <VscChevronLeft size={28} />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Next slide"
      >
        <VscChevronRight size={28} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currSlide ? 'bg-white w-6' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;