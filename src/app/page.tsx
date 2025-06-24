"use client";

import HeroSection from "@/components/home/HeroSection/HeroSection";
import WorkExperience from "@/components/home/WorkExperience";
import FeaturedProjects from "@/components/home/FeaturedProjects";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WorkExperience />
      <FeaturedProjects />
    </div>
  );
};

export default Home;
