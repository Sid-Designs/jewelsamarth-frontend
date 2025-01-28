import React from 'react';
import Lottie from 'react-lottie';
import animationData from '@/assets/videos/success-animation.json'; 

const SuccessAnimation = () => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return <Lottie options={defaultOptions} height={200} width={200} />;
};

export default SuccessAnimation;
