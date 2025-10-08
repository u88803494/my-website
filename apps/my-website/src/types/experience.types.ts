import { type ReactNode } from "react";

export interface Achievement {
  description: ReactNode;
  title: string;
}

export interface Experience {
  achievements: Achievement[];
  company: string;
  logoUrl: string;
  period: string;
  role: string;
  techStackGroups: TechStackGroup[];
}

export interface TechStackGroup {
  items: string[];
  label: string;
}
