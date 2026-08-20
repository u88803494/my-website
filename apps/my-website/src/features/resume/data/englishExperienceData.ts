import type { Experience } from "@packages/shared/types";

import { experiences as traditionalChineseExperiences } from "@/data/experienceData";

const [freelanceExperience, eucareExperience, wishmobileExperience, arisanExperience] = traditionalChineseExperiences;

if (!freelanceExperience || !eucareExperience || !wishmobileExperience || !arisanExperience) {
  throw new Error("Resume experience facts are incomplete");
}

export const englishExperiences: Experience[] = [
  {
    ...freelanceExperience,
    company: "Independent Developer / Freelancer",
    role: "Senior Software Engineer",
    techStackGroups: [
      { items: freelanceExperience.techStackGroups?.[0]?.items ?? [], label: "AI Development" },
      { items: freelanceExperience.techStackGroups?.[1]?.items ?? [], label: "Frontend" },
    ],
    achievements: [
      {
        title: "AI Product Development and Integration",
        description:
          "Built henryleelab.com as a personal technology platform integrating AI Chat, AI Dictionary, and AI Analyzer, demonstrating end-to-end product development capabilities.",
      },
      {
        title: "AI-Native Interface Design",
        description:
          "Developed streaming interfaces that reduce the perceived latency of LLM responses through real-time rendering and complete Markdown support.",
      },
      {
        title: "Development Workflow Innovation",
        description:
          "Established a documentation-driven workflow with Claude Code, enabling the delivery of one to two production-ready features per day.",
      },
      {
        title: "Technical Consulting",
        description:
          "Provide AI integration and frontend architecture consulting to help teams adopt modern development tools and AI-native practices.",
      },
    ],
  },
  {
    ...eucareExperience,
    company: "EUCARE Co., Ltd.",
    role: "Frontend Engineer",
    techStackGroups: [
      { items: eucareExperience.techStackGroups?.[0]?.items ?? [], label: "Frontend" },
      { items: eucareExperience.techStackGroups?.[1]?.items ?? [], label: "Tools" },
    ],
    achievements: [
      {
        title: "Telemedicine Platform Design and Development",
        description:
          "Led the planning and development of doctor, patient (LINE Mini App), and administrative interfaces for a telemedicine platform in a monorepo architecture.",
      },
      {
        title: "Video Consultation and Integration",
        description:
          "Integrated the Twilio SDK and simplified its implementation to deliver video consultations and screen sharing for remote care.",
      },
      {
        title: "Cost and Workflow Optimization",
        description:
          "Introduced a development approach that reduced costs by 50% and improved UI, UX, and developer experience, increasing development convenience by 60%.",
      },
      {
        title: "Data Flow and Type Safety",
        description:
          "Improved frontend-backend data flow and strengthened type safety with TypeScript, increasing delivery efficiency and maintainability.",
      },
      {
        title: "Product Upgrade and Refactoring",
        description:
          "Upgraded the company's React product line and refactored 99% of the codebase, improving product stability and developer experience.",
      },
      {
        title: "AI-Assisted Development Adoption",
        description:
          "Pioneered AI-assisted development tools within the team, improving implementation speed and code quality while preparing for later AI product work.",
      },
    ],
  },
  {
    ...wishmobileExperience,
    company: "WishMobile, Inc.",
    role: "Frontend Engineer",
    techStackGroups: [
      { items: wishmobileExperience.techStackGroups?.[0]?.items ?? [], label: "Frontend" },
      { items: wishmobileExperience.techStackGroups?.[1]?.items ?? [], label: "Tools" },
    ],
    achievements: [
      {
        title: "Frontend Mentoring and Collaboration",
        description:
          "Mentored two team members, including an app team lead, helping them become productive with React and develop features independently.",
      },
      {
        title: "Modular Architecture",
        description:
          "Partnered with the app team to design a modular architecture and build reusable packages and libraries for rapid project assembly.",
      },
      {
        title: "Engineering Standards and Tooling",
        description:
          "Established coding standards and introduced ESLint, Prettier, and Husky to improve reviews, consistency, and code quality.",
      },
      {
        title: "Documentation and Cross-Team Alignment",
        description:
          "Documented repository initialization, folder structures, and development conventions to reduce communication overhead across teams.",
      },
    ],
  },
  {
    ...arisanExperience,
    company: "Arisan Intelligence Co., Ltd.",
    role: "Full-Stack Engineer",
    techStackGroups: [
      { items: arisanExperience.techStackGroups?.[0]?.items ?? [], label: "Frontend" },
      {
        items: (arisanExperience.techStackGroups?.[1]?.items ?? []).map((item) =>
          item === "DDD 架構" ? "Domain-Driven Design (DDD)" : item,
        ),
        label: "Backend",
      },
      { items: arisanExperience.techStackGroups?.[2]?.items ?? [], label: "Tools" },
    ],
    achievements: [
      {
        title: "End-to-End Feature Development",
        description:
          "Independently built new features end-to-end within the team's existing DDD architecture — from MongoDB data querying and Express.js backend logic to frontend integration.",
      },
      {
        title: "Critical Performance Improvement",
        description:
          "Collaborated to improve multi-channel video loading from more than five seconds to under one second.",
      },
      {
        title: "Website Technology Migration",
        description:
          "Independently migrated the company website (www.arisan.io) from jQuery to React, improving interactivity and long-term maintainability.",
      },
      {
        title: "Frontend Workflow Optimization",
        description:
          "Created more efficient SCSS practices and a shared component library, improving delivery speed for repeatable layouts by more than 50%.",
      },
      {
        title: "Reusable Components and Form Architecture",
        description:
          "Built reusable components and redesigned the architecture and styling of full-page form components to reduce implementation time.",
      },
    ],
  },
];
