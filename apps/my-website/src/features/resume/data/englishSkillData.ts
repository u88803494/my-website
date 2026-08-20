import { skillData } from "@/data/skillData";

const englishSkillTitles = {
  "ai-development": "AI Application Development",
  backend: "Backend Experience",
  "frontend-architecture": "Modern Frontend Architecture",
  "ui-tools": "UI and Development Tools",
} as const;

export const englishSkills = skillData.map((category) => ({
  ...category,
  skills: category.skills.map((skill) => ({
    ...skill,
    name: skill.name === "Claude Code 輔助開發" ? "Claude Code-Assisted Development" : skill.name,
  })),
  title: englishSkillTitles[category.id],
}));
