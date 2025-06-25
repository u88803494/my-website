import React, { ReactNode } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiRedux,
  SiTailwindcss,
  SiReactquery,
  SiMui,
  SiStyledcomponents,
  SiSass,
  SiGithub,
  SiFigma,
  SiJest,
  SiMongodb,
  SiExpress,
  SiPhp,
  SiMocha,
  SiOpenai,
} from "react-icons/si";
import { TbApi, TbBrandLine, TbSettings } from "react-icons/tb";

// 簡潔的圖標包裝函數，避免重複 className
const icon = (IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>): ReactNode => (
  <IconComponent className="w-4 h-4" />
);

export interface Skill {
  name: string;
  icon: ReactNode;
}

export interface SkillCategory {
  title: string;
  level: "expert" | "proficient" | "familiar";
  skills: Skill[];
  description: string;
}

export const skillData: SkillCategory[] = [
  {
    title: "核心專長",
    level: "expert",
    description: "Expert",
    skills: [
      { name: "Next.js", icon: icon(SiNextdotjs) },
      { name: "React", icon: icon(SiReact) },
      { name: "TypeScript", icon: icon(SiTypescript) },
      { name: "JavaScript (ES6+)", icon: icon(SiJavascript) },
      { name: "狀態管理：Redux、Zustand", icon: icon(SiRedux) },
      { name: "Tailwind CSS", icon: icon(SiTailwindcss) },
      { name: "Ai 輔助開發", icon: icon(SiOpenai) },
    ],
  },
  {
    title: "熟悉使用",
    level: "proficient",
    description: "Proficient",
    skills: [
      { name: "React-Query / TanStack Query", icon: icon(SiReactquery) },
      { name: "Material UI", icon: icon(SiMui) },
      { name: "Styled-components", icon: icon(SiStyledcomponents) },
      { name: "SASS / SCSS", icon: icon(SiSass) },
      { name: "Git & GitHub / GitLab", icon: icon(SiGithub) },
      { name: "AJAX(RESTful API)", icon: icon(TbApi) },
      { name: "Figma / Zeplin", icon: icon(SiFigma) },
    ],
  },
  {
    title: "有涉獵",
    level: "familiar",
    description: "Familiar",
    skills: [
      { name: "Line LIFF", icon: icon(TbBrandLine) },
      { name: "Jest", icon: icon(SiJest) },
      { name: "MongoDB", icon: icon(SiMongodb) },
      { name: "Express.js", icon: icon(SiExpress) },
      { name: "PHP / MySQL", icon: icon(SiPhp) },
      { name: "CI/CD", icon: icon(TbSettings) },
      { name: "Mocha", icon: icon(SiMocha) },
    ],
  },
];
