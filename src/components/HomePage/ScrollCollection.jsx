import React, { useRef, useEffect, useState, useCallback } from 'react';
import logo from '@/assets/images/JewelSamarth_Single_Logo.png';
import '@/assets/styles/ScrollCollection.css';
import { useNavigate } from 'react-router-dom';

const ScrollAnimation = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [pauseScroll, setPauseScroll] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const items = [
    { name: "All Category", image: logo, link: "/shop" },
    { name: "Earrings", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1740409930/emv1w7tgzqk2czaxemix.jpg", link: "/collections/earring" },
    { name: "Rings", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1741189529/gptksx8htaozaqzevzcs.jpg", link: "/collections/ring" },
    { name: "Pendant", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1740411760/k2ba34tohgz2lpcthrzd.jpg", link: "/collections/pendant" },
    { name: "Nose Pin", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1740812278/wbsdpcu167bsrvfandnd.jpg", link: "/collections/nose+pin" },
    { name: "Bracelets", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1740411209/xujl5nqhty8oo8vcokfg.jpg", link: "/collections/bracelet" },
    { name: "Mangalsutra", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1741084644/urk6dsgo7y50hynpy4zx.jpg", link: "/collections/mangalsutra" },
    { name: "Bands", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1741013621/qekdborfisrqx08ig0yf.jpg", link: "/collections/band" },
    { name: "Cufflink", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1740824178/oqqlhriwcwx8zbgsptdc.jpg", link:"/collections/cuflink" },
    { name: "Astrological Ring", image: "https://res.cloudinary.com/dplww7z06/image/upload/v1741362914/pbzzpnipaag9gckfmqvb.webp", link: "/collections/astrological+ring" },
  ];

  const handleItemClick = (link) => {
    navigate(link);
  };

  const autoScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || pauseScroll || isDragging) return;

    if (Math.abs(velocity) > 0.1) {
      scrollContainer.scrollLeft += velocity;
      setVelocity(velocity * 0.95);
    } else {
      scrollContainer.scrollLeft += 0.5;
    }

    if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
      scrollContainer.scrollLeft = 0;
    } else if (scrollContainer.scrollLeft <= 0) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2;
    }

    animationFrameRef.current = requestAnimationFrame(autoScroll);
  }, [pauseScroll, isDragging, velocity]);

  useEffect(() => {
    if (scrollContentRef.current && !isInitialized) {
      scrollContentRef.current.innerHTML = '';
      [...items, ...items, ...items].forEach((item, index) => {
        const tabWrapper = document.createElement('div');
        tabWrapper.className = 'tab-wrapper';
        tabWrapper.onclick = () => handleItemClick(item.link);
        tabWrapper.style.cursor = 'pointer';
        
        const tab = document.createElement('div');
        tab.className = 'circle-tab';
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.className = 'circle-tab-image';
        
        const text = document.createElement('span');
        text.className = 'circle-tab-text';
        text.textContent = item.name;
        
        tab.appendChild(img);
        tabWrapper.appendChild(tab);
        tabWrapper.appendChild(text);
        scrollContentRef.current.appendChild(tabWrapper);
      });

      setIsInitialized(true);
      animationFrameRef.current = requestAnimationFrame(autoScroll);
    }
  }, [isInitialized, autoScroll]);

  useEffect(() => {
    if (isInitialized) {
      animationFrameRef.current = requestAnimationFrame(autoScroll);
    }
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [autoScroll, isInitialized]);

  const handleMouseDown = (e) => {
    // Prevent dragging when clicking on items
    if (e.target.closest('.tab-wrapper')) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.scrollBehavior = 'auto';
    cancelAnimationFrame(animationFrameRef.current);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    const now = performance.now();
    const timeDelta = now - lastTimeRef.current;
    const x = e.pageX;
    const deltaX = x - lastXRef.current;
    
    if (timeDelta > 0) {
      const newVelocity = deltaX / timeDelta * 20;
      setVelocity(newVelocity);
    }

    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.scrollBehavior = 'smooth';
    if (!pauseScroll) {
      animationFrameRef.current = requestAnimationFrame(autoScroll);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    
    const now = performance.now();
    if (now - lastTimeRef.current > 16) { 
      lastTimeRef.current = now;
      lastXRef.current = e.pageX;
    }
  };

  return (
    <div 
      className="scroll-container mt-4"
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPauseScroll(true)}
      onMouseOut={() => setPauseScroll(false)}
    >
      <div className="scroll-content" ref={scrollContentRef}>
      </div>
    </div>
  );
};

export default ScrollAnimation;