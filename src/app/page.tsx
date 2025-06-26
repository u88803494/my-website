"use client";

import Contact from "@/components/home/Contact";
import Education from "@/components/home/Education";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import HeroSection from "@/components/home/HeroSection";
import MediumArticles from "@/components/home/MediumArticles";
import Skills from "@/components/home/Skills";
import WorkExperience from "@/components/home/WorkExperience";

const Home = () => {
  return (
    <main>
      <HeroSection backgroundClass="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10" sectionId="hero" />
      <WorkExperience backgroundClass="bg-base-200" sectionId="work-experience" />
      <FeaturedProjects backgroundClass="bg-base-100" sectionId="featured-projects" />
      <MediumArticles backgroundClass="bg-base-200" sectionId="medium-articles" />
      <Skills backgroundClass="bg-base-100" sectionId="skills" />
      <Education backgroundClass="bg-base-200/30" sectionId="education" />
      <Contact backgroundClass="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5" sectionId="contact" />
    </main>
  );
};

export default Home;
