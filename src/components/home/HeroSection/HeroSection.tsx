"use client";

import React from "react";

import AnimatedBackground from "@/components/home/HeroSection/AnimatedBackground";
import HeroContent from "@/components/home/HeroSection/HeroContent";
import HeroImage from "@/components/home/HeroSection/HeroImage";
import { cn } from "@/utils/cn";

interface HeroSectionProps {
  backgroundClass: string;
  sectionId: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ backgroundClass, sectionId }) => {
  return (
    <section className={cn("hero relative min-h-screen overflow-hidden", backgroundClass)} id={sectionId}>
      <AnimatedBackground />

      <div
        className={cn(
          "hero-content relative z-10 w-full",
          "flex-col gap-8 pt-12",
          "lg:flex-row-reverse lg:gap-16 lg:pt-0",
        )}
      >
        <HeroImage />
        <HeroContent />
      </div>
    </section>
  );
};

export default HeroSection;
