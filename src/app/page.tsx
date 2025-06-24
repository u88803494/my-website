"use client";

import HeroSection from "@/components/home/HeroSection/HeroSection";
import WorkExperience from "@/components/home/WorkExperience";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Skills from "@/components/home/Skills";
import Education from "@/components/home/Education";
import Contact from "@/components/home/Contact";

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      <HeroSection />
      <WorkExperience />
      <FeaturedProjects />
      <Skills />
      <Education />
      <Contact />
    </div>
  );
};

export default Home;
