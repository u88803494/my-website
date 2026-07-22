import type { Experience, Project } from "@packages/shared/types";

import type { Skill, SkillCategory } from "@/data/skillData";

export type ResumeLocale = "en" | "zh-Hant";

export interface HeroContentData {
  greeting: string;
  imageAlt: string;
  name: string;
  paragraphs: string[];
  resumeDownload: {
    fileName: string;
    href: string;
    label: string;
    tooltip: string;
  };
  title: string;
  workCta: {
    label: string;
    tooltip: string;
  };
}

export interface WorkExperienceContent {
  achievementHeading: string;
  achievementSeparator: string;
  description: string;
  experiences: Experience[];
  heading: string;
}

export interface FeaturedProjectsContent {
  collapseLabel: string;
  description: string;
  developmentOnlyLabel: string;
  techStackLabel: string;
  heading: string;
  projects: Project[];
  showMoreLabel: string;
}

export interface MediumArticlesContent {
  articleTypeLabel: string;
  dateLocale: "en-US" | "zh-TW";
  description: string;
  featuredHeading: string;
  heading: string;
  latestHeading: string;
  mediumCta: string;
  mobileHeadingLines: [string, string];
  nextLabel: string;
  pauseLabel: string;
  playLabel: string;
  previousLabel: string;
  readArticleLabel: string;
  slideLabelTemplate: string;
}

export interface LocalizedSkillCategory extends Omit<SkillCategory, "skills" | "title"> {
  skills: Skill[];
  title: string;
}

export interface SkillsContent {
  categories: LocalizedSkillCategory[];
  description: string;
  heading: string;
}

export interface EducationItem {
  description: string;
  highlight: boolean;
  period: string;
  title: string;
}

export interface EducationContent {
  description: string;
  heading: string;
  items: EducationItem[];
}

export interface ContactContent {
  availability: {
    responseLabel: string;
    responseValue: string;
    rolesLabel: string;
    rolesValue: string;
    skillsLabel: string;
    skillsValue: string;
  };
  copiedLabel: string;
  copyLabel: string;
  description: string;
  emailDescription: string;
  emailHeading: string;
  heading: string;
  platformDescriptions: string[];
  platformsDescription: string;
  platformsHeading: string;
}

export interface ResumeContent {
  contact: ContactContent;
  contactLinkLocale: "en" | "zh-Hant";
  education: EducationContent;
  featuredProjects: FeaturedProjectsContent;
  hero: HeroContentData;
  locale: ResumeLocale;
  mediumArticles: MediumArticlesContent;
  skills: SkillsContent;
  workExperience: WorkExperienceContent;
}
