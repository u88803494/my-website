import type React from "react";

export interface Skill {
  icon: React.ReactNode;
  name: string;
}

export interface SkillCategory {
  description: string;
  level: "expert" | "familiar" | "proficient";
  skills: Skill[];
  title: string;
}