"use client";

import { Suspense, useEffect, useState } from "react";

import AboutHero from "./components/AboutHero";
import AnimatedBackground from "./components/AnimatedBackground";
import PhilosophySection from "./components/PhilosophySection";
import StorySection from "./components/StorySection";
import TechStackSection from "./components/TechStackSection";

const AboutFeature: React.FC = () => {
  const [showAnimatedBackground, setShowAnimatedBackground] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimatedBackground(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 動態背景 */}
      {showAnimatedBackground && (
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
      )}

      {/* 主要內容 */}
      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-12">
        <AboutHero />
        <main>
          <StorySection />
          <PhilosophySection />
          <TechStackSection />
        </main>
      </div>
    </div>
  );
};

export default AboutFeature;
