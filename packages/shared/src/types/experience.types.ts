import type React from "react";

export interface ExperienceAchievement {
  title: string;
  description: React.ReactNode;
}

export interface TechStackGroup {
  label: string;
  items: string[];
}

export interface Experience {
  achievements: ExperienceAchievement[];
  company: string;
  logoUrl?: string;
  period?: string;
  role?: string;
  techStackGroups?: TechStackGroup[];
  // 兼容舊格式
  description?: string;
  endDate?: string;
  position?: string;
  startDate?: string;
  techStack?: string[];
}