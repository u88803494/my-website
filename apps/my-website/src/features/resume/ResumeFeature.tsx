"use client";

import dynamic from "next/dynamic";

import LazySection from "@/components/LazySection";

import HeroSection from "./components/HeroSection";

// 延遲載入非首屏組件
const WorkExperience = dynamic(() => import("./components/WorkExperience"), {
  ssr: false,
});

const FeaturedProjects = dynamic(() => import("./components/FeaturedProjects"), {
  ssr: false,
});

const MediumArticles = dynamic(() => import("./components/MediumArticles"), {
  ssr: false,
});

const Skills = dynamic(() => import("./components/Skills"), {
  ssr: false,
});

const Education = dynamic(() => import("./components/Education"), {
  ssr: false,
});

const Contact = dynamic(() => import("./components/Contact"), {
  ssr: false,
});

const ResumeFeature: React.FC = () => {
  return (
    <main>
      <HeroSection backgroundClass="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10" sectionId="hero" />

      <LazySection fallback={<div className="bg-base-200 min-h-96 animate-pulse" />}>
        <WorkExperience backgroundClass="bg-base-200" sectionId="work-experience" />
      </LazySection>

      <LazySection fallback={<div className="bg-base-100 min-h-96 animate-pulse" />}>
        <FeaturedProjects backgroundClass="bg-base-100" sectionId="featured-projects" />
      </LazySection>

      <LazySection fallback={<div className="bg-base-200 min-h-96 animate-pulse" />}>
        <MediumArticles backgroundClass="bg-base-200" sectionId="medium-articles" />
      </LazySection>

      <LazySection fallback={<div className="bg-base-100 min-h-80 animate-pulse" />}>
        <Skills backgroundClass="bg-base-100" sectionId="skills" />
      </LazySection>

      <LazySection fallback={<div className="bg-base-200/30 min-h-64 animate-pulse" />}>
        <Education backgroundClass="bg-base-200/30" sectionId="education" />
      </LazySection>

      <LazySection
        fallback={
          <div className="from-primary/5 via-base-100 to-secondary/5 min-h-80 animate-pulse bg-gradient-to-br" />
        }
      >
        <Contact backgroundClass="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5" sectionId="contact" />
      </LazySection>
    </main>
  );
};

export default ResumeFeature;
