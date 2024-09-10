// ScrollingBackground.jsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import logo1 from '@/app/public/images/logo1.png'; 
import logo2 from '@/app/public/images/logo2.png'; 
import Image from 'next/image';

const ScrollingBackground = () => {
  // Create an array of alternating logos
  const logos = Array.from({ length: 100 }).map((_, index) =>
    index % 2 === 0 ? logo1 : logo2
  );

  return (
    <div className="scrolling-background">
      <motion.div
        className="scrolling-pattern"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
      >
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo}
            alt={`Logo ${index}`}
            width={250} // Set the appropriate width
            height={250} // Set the appropriate height
            className="logo-pattern"
          />
        ))}
      </motion.div>

      <div className="fade-overlay" />
    </div>
  );
};

export default ScrollingBackground;
