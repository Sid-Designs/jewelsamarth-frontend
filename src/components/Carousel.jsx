import React, { useEffect, useRef, useState } from 'react';
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import '../assets/styles/Carousel.css';

const Carousel = () => {
  const [currSlide, setCurrSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false); 

  const slides = [
    { url: 'https://images.unsplash.com/photo-1736297150541-89378f055b96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8' },
    { url: 'https://images.unsplash.com/photo-1736297150541-89378f055b96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8' },
    { url: 'https://images.unsplash.com/photo-1736297150541-89378f055b96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8' },
    { url: 'https://images.unsplash.com/photo-1736297150541-89378f055b96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8' }
  ];

  const totalSlides = slides.length;
  const slideRef = useRef(null);

  useEffect(() => {
    const imgSlide = setInterval(() => {
      if (!isPaused) {
        setCurrSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 3000);
    return () => clearInterval(imgSlide);
  }, [isPaused, totalSlides]);

  const handleNext = () => {
    setCurrSlide((currSlide) => (currSlide + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrSlide((currSlide) => (currSlide - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const img = new Image();
    img.src = slides[currSlide].url;
    img.onload = () => {
      slideRef.current.style.transition = 'transform 0.5s ease-in-out';
      slideRef.current.style.transform = `translateX(-${currSlide * 100}%)`;
    };
  }, [currSlide]);

  return (
    <div
      className='carousel flex justify-around items-center h-[300px] md:h-[350px] lg:h-[600px] lg:p-2'
      onMouseEnter={() => setIsPaused(true)} 
      onMouseLeave={() => setIsPaused(false)} 
      role="region" 
      aria-label="Image Carousel" 
    >
      <div ref={slideRef} className="slides flex p-[1.5rem] md:py-0 gap-[3rem] md:px-[2rem] md:gap-[4rem]" style={{ transform: `translateX(-${currSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.url} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      <button className='prev mx-[1.5rem] md:mx-[2rem] lg:mx-[3rem]' onClick={handlePrev} aria-label="Previous Slide">
        <VscChevronLeft />
      </button>
      <button className='next mx-[1.5rem] md:mx-[2rem] lg:mx-[3rem]' onClick={handleNext } aria-label="Next Slide">
        <VscChevronRight />
      </button>
    </div>
  );
};

export default Carousel;