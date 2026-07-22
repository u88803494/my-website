"use client";

import Contact from "./components/Contact";
import Education from "./components/Education";
import FeaturedProjects from "./components/FeaturedProjects";
import HeroSection from "./components/HeroSection";
import MediumArticles from "./components/MediumArticles";
import Skills from "./components/Skills";
import WorkExperience from "./components/WorkExperience";
import type { ResumeContent } from "./types/resumeContent.types";

interface ResumeFeatureProps {
  content: ResumeContent;
}

const ResumeFeature: React.FC<ResumeFeatureProps> = ({ content }) => {
  return (
    <main>
      <HeroSection
        backgroundClass="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"
        contactLinkLocale={content.contactLinkLocale}
        content={content.hero}
        sectionId="hero"
      />
      <WorkExperience backgroundClass="bg-base-200" content={content.workExperience} sectionId="work-experience" />
      <FeaturedProjects
        backgroundClass="bg-base-100"
        content={content.featuredProjects}
        sectionId="featured-projects"
      />
      <MediumArticles backgroundClass="bg-base-200" content={content.mediumArticles} sectionId="medium-articles" />
      <Skills backgroundClass="bg-base-100" content={content.skills} sectionId="skills" />
      <Education backgroundClass="bg-base-200/30" content={content.education} sectionId="education" />
      <Contact
        backgroundClass="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5"
        contactLinkLocale={content.contactLinkLocale}
        content={content.contact}
        sectionId="contact"
      />
    </main>
  );
};

export default ResumeFeature;
