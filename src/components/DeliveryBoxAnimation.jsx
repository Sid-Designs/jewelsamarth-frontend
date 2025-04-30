import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from '@/assets/videos/DeliveryBox.json';

const DeliveryBoxAnimation = () => {
    const [showAnimation, setShowAnimation] = useState(false); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <>
            {showAnimation && (
                <Lottie options={defaultOptions} height={300} width={300} />
            )}
        </>
    );
};

export default DeliveryBoxAnimation;
