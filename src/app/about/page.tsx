import type { Metadata } from "next";
import React from "react";

import { AboutHero, PhilosophySection, StorySection, TechStackSection } from "@/components/about";
import AnimatedBackground from "@/components/about/AnimatedBackground";

export const metadata: Metadata = {
  description:
    "深入了解 Henry Lee，一位熱衷於打造高效能、可維護 Web 應用的前端工程師。探索我的技術棧、專業經歷與個人理念。",
  title: "關於我 | Henry Lee",
};

const AboutPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 動態背景 */}
      <AnimatedBackground />

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

export default AboutPage;
