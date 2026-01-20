import { type Experience } from "@/types/experience.types";

const experiences: Experience[] = [
  {
    achievements: [
      { descriptionKey: "freelance.achievements.aiDev.description", titleKey: "freelance.achievements.aiDev.title" },
      {
        descriptionKey: "freelance.achievements.aiNative.description",
        titleKey: "freelance.achievements.aiNative.title",
      },
      {
        descriptionKey: "freelance.achievements.devProcess.description",
        titleKey: "freelance.achievements.devProcess.title",
      },
      {
        descriptionKey: "freelance.achievements.consulting.description",
        titleKey: "freelance.achievements.consulting.title",
      },
    ],
    companyKey: "freelance.company",
    logoUrl: "/images/logos/freelance.svg",
    periodKey: "freelance.period",
    roleKey: "freelance.role",
    techStackGroups: [
      {
        items: ["Vercel AI SDK", "Google Gemini API", "Claude Code", "Streaming UI"],
        labelKey: "techLabels.aiDev",
      },
      {
        items: ["Next.js 15", "TypeScript", "TanStack Query", "Tailwind CSS"],
        labelKey: "techLabels.frontend",
      },
    ],
  },
  {
    achievements: [
      {
        descriptionKey: "eucare.achievements.telemedicine.description",
        titleKey: "eucare.achievements.telemedicine.title",
      },
      { descriptionKey: "eucare.achievements.video.description", titleKey: "eucare.achievements.video.title" },
      { descriptionKey: "eucare.achievements.cost.description", titleKey: "eucare.achievements.cost.title" },
      { descriptionKey: "eucare.achievements.dataflow.description", titleKey: "eucare.achievements.dataflow.title" },
      { descriptionKey: "eucare.achievements.upgrade.description", titleKey: "eucare.achievements.upgrade.title" },
      { descriptionKey: "eucare.achievements.aiTools.description", titleKey: "eucare.achievements.aiTools.title" },
    ],
    companyKey: "eucare.company",
    logoUrl: "/images/logos/eucare.png",
    periodKey: "eucare.period",
    roleKey: "eucare.role",
    techStackGroups: [
      {
        items: ["Nextjs", "TypeScript", "styled-components", "MUI", "Nxjs(mono)", "React-Query", "Line LIFF"],
        labelKey: "techLabels.frontend",
      },
      {
        items: ["GitHub", "Clickup", "Figma", "Twilio"],
        labelKey: "techLabels.other",
      },
    ],
  },
  {
    achievements: [
      {
        descriptionKey: "wishmobile.achievements.mentoring.description",
        titleKey: "wishmobile.achievements.mentoring.title",
      },
      {
        descriptionKey: "wishmobile.achievements.modular.description",
        titleKey: "wishmobile.achievements.modular.title",
      },
      {
        descriptionKey: "wishmobile.achievements.standards.description",
        titleKey: "wishmobile.achievements.standards.title",
      },
      { descriptionKey: "wishmobile.achievements.docs.description", titleKey: "wishmobile.achievements.docs.title" },
    ],
    companyKey: "wishmobile.company",
    logoUrl: "/images/logos/wishmobile.png",
    periodKey: "wishmobile.period",
    roleKey: "wishmobile.role",
    techStackGroups: [
      {
        items: ["React", "React Hook", "Redux toolkit", "Redux saga", "styled-components", "Tailwind"],
        labelKey: "techLabels.frontend",
      },
      {
        items: ["GitHub", "Jira", "Clickup", "Figma", "Zeplin"],
        labelKey: "techLabels.other",
      },
    ],
  },
  {
    achievements: [
      {
        descriptionKey: "arisan.achievements.performance.description",
        titleKey: "arisan.achievements.performance.title",
      },
      { descriptionKey: "arisan.achievements.migration.description", titleKey: "arisan.achievements.migration.title" },
      {
        descriptionKey: "arisan.achievements.efficiency.description",
        titleKey: "arisan.achievements.efficiency.title",
      },
      {
        descriptionKey: "arisan.achievements.components.description",
        titleKey: "arisan.achievements.components.title",
      },
    ],
    companyKey: "arisan.company",
    logoUrl: "/images/logos/arisan.png",
    periodKey: "arisan.period",
    roleKey: "arisan.role",
    techStackGroups: [
      {
        items: ["React", "React Router", "React Hook", "Redux", "SCSS", "Jest"],
        labelKey: "techLabels.frontend",
      },
      {
        items: ["Express.js", "TypeScript", "MongoDB", "DDD Architecture", "Mocha"],
        labelKey: "techLabels.backend",
      },
      {
        items: ["GitLab", "GitLab CI/CD", "Adobe XD", "Zeplin"],
        labelKey: "techLabels.tools",
      },
    ],
  },
];

export { experiences };
