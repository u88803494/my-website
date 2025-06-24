"use client";

import HeroSection from "@/components/home/HeroSection/HeroSection";
import WorkExperience from "@/components/home/WorkExperience";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Skills from "@/components/home/Skills";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WorkExperience />
      <FeaturedProjects />
      <Skills />
    </div>
  );
};

export default Home;
