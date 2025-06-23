"use client";

import AnimatedBackground from "@/components/home/HeroSection/AnimatedBackground";
import HeroImage from "@/components/home/HeroSection/HeroImage";
import HeroContent from "@/components/home/HeroSection/HeroContent";

const HeroSection = () => {
  return (
    <section className="hero min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 relative z-10 w-full">
        <HeroImage />
        <HeroContent />
      </div>
    </section>
  );
};

export default HeroSection; 
