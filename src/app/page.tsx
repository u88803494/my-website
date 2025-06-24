"use client";

import HeroSection from "@/components/home/HeroSection/HeroSection";
import WorkExperience from "@/components/home/WorkExperience";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Skills from "@/components/home/Skills";
import Education from "@/components/home/Education";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WorkExperience />
      <FeaturedProjects />
      <Skills />
      <Education />
    </div>
  );
};

export default Home;
