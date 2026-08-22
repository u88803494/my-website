import type { ResumeContent } from "../types/resumeContent.types";
import { englishExperiences } from "./englishExperienceData";
import { englishProjects } from "./englishProjectData";
import { englishSkills } from "./englishSkillData";

export const englishResumeContent: ResumeContent = {
  contact: {
    availability: {
      responseLabel: "Response time:",
      responseValue: "I usually reply within 24 hours",
      rolesLabel: "Open to:",
      rolesValue: "Frontend and full-stack roles, remote or on-site",
      skillsLabel: "Core strengths:",
      skillsValue: "React, Next.js, TypeScript, and frontend architecture",
    },
    copiedLabel: "Copied",
    copyLabel: "Copy",
    description:
      "Interested in my experience or working together? I am open to remote and full-time opportunities and would be glad to connect.",
    emailDescription: "The best way to reach me. I usually reply within 24 hours.",
    emailHeading: "Email",
    heading: "Let's Work Together",
    platformDescriptions: ["GitHub · Code", "LinkedIn · Profile", "Medium · Articles", "Email · Direct contact"],
    platformsDescription: "You can also learn more about my work through these platforms.",
    platformsHeading: "Other Platforms",
  },
  contactLinkLocale: "en",
  education: {
    description: "My academic background and continuing education",
    heading: "Education and Training",
    items: [
      { description: "Participant", highlight: true, period: "Apr 2019 ~ Dec 2019", title: "Mentor Program, Cohort 3" },
      {
        description: "Bachelor's degree, Chemical and Materials Engineering",
        highlight: false,
        period: "2009 ~ 2011",
        title: "Minghsin University of Science and Technology",
      },
      {
        description: "Associate degree, Chemical Engineering",
        highlight: false,
        period: "2007 ~ 2009",
        title: "I-Shou University",
      },
    ],
  },
  featuredProjects: {
    collapseLabel: "Show Less",
    description: "Selected work spanning AI-native products, frontend architecture, and full product delivery.",
    developmentOnlyLabel: "[Development only]",
    heading: "Featured Projects",
    projects: englishProjects,
    showMoreLabel: "View More Projects",
    techStackLabel: "Technology Stack",
  },
  hero: {
    greeting: "Hi, I'm ",
    imageAlt: "Portrait of Henry Lee",
    name: "Henry Lee",
    paragraphs: [
      "Senior Software Engineer specializing in Next.js 16 and building generative AI-powered products, with the ability to independently ship complete products.",
      "I established a documentation-driven workflow with Claude Code that enables the delivery of one to two production-ready features per day.",
      "I independently built AI Chat, AI Dictionary, AI Analyzer, and other products, demonstrating end-to-end product development capabilities.",
      "I continue to explore AI-native development practices and advise teams on adopting modern engineering tools and workflows.",
    ],
    resumeDownload: {
      fileName: "Henry-Lee-Resume-2025.pdf",
      href: "/documents/henry-lee-resume-20250618.pdf",
      label: "Download Resume",
      tooltip: "Download my resume as a PDF",
    },
    subtitle: "Frontend · AI · Full-Stack Web Development",
    title: "Senior Software Engineer",
    workCta: { label: "View My Work", tooltip: "Explore my featured projects" },
  },
  locale: "en",
  mediumArticles: {
    articleTypeLabel: "Medium Article",
    dateLocale: "en-US",
    description:
      "Notes and technical insights from my software development journey. Articles are published in Traditional Chinese.",
    featuredHeading: "⭐ Featured Articles",
    heading: "Technical Articles",
    latestHeading: "📰 Latest Articles",
    mediumCta: "Visit My Medium Publication",
    mobileHeadingLines: ["Technical", "Articles"],
    nextLabel: "Next slide",
    pauseLabel: "Pause carousel",
    playLabel: "Play carousel",
    previousLabel: "Previous slide",
    readArticleLabel: "Read Article",
    slideLabelTemplate: "Go to slide {number}",
  },
  skills: {
    categories: englishSkills,
    description: "My software development strengths, from core expertise to supporting technologies.",
    heading: "Skills",
  },
  workExperience: {
    achievementHeading: "Key Achievements",
    achievementSeparator: ": ",
    description: "My professional journey and engineering impact",
    experiences: englishExperiences,
    heading: "Work Experience",
  },
};
