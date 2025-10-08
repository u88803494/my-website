import { type ReactNode } from "react";

export interface Skill {
  icon: ReactNode;
  name: string;
}

export interface SkillCategory {
  description: string;
  level: "expert" | "familiar" | "proficient";
  skills: Skill[];
  title: string;
}