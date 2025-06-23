import { ReactNode } from 'react';

export interface Achievement {
  title: string;
  description: ReactNode;
}

export interface TechStackGroup {
  label: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  logoUrl: string;
  achievements: Achievement[];
  techStackGroups: TechStackGroup[];
};