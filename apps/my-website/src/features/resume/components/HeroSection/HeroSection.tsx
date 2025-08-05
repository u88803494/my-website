"use client";

import React from "react";

import { cn } from "@/utils/cn";

import AnimatedBackground from "./AnimatedBackground";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

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
