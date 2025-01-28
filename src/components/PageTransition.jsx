import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    const variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: 'easeIn' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
