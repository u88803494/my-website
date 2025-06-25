"use client";

import React from 'react';
import clsx from 'clsx';
import AnimatedBackground from "@/components/home/HeroSection/AnimatedBackground";
import HeroImage from "@/components/home/HeroSection/HeroImage";
import HeroContent from "@/components/home/HeroSection/HeroContent";

interface HeroSectionProps {
  backgroundClass: string;
  sectionId: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundClass,
  sectionId
}) => {
  return (
    <section 
      className={clsx(
        'hero min-h-screen relative overflow-hidden',
        backgroundClass
      )}
      id={sectionId}
    >
      <AnimatedBackground />
      
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 relative z-10 w-full">
        <HeroImage />
        <HeroContent />
      </div>
    </section>
  );
};

export default HeroSection; 
