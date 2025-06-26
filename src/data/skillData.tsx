import React, { ReactNode } from "react";
import {
  SiExpress,
  SiFigma,
  SiGithub,
  SiJavascript,
  SiJest,
  SiMocha,
  SiMongodb,
  SiMui,
  SiNextdotjs,
  SiOpenai,
  SiPhp,
  SiReact,
  SiReactquery,
  SiRedux,
  SiSass,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbApi, TbBrandLine, TbSettings } from "react-icons/tb";

// 簡潔的圖標包裝函數，避免重複 className
const icon = (IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>): ReactNode => (
  <IconComponent className="h-4 w-4" />
);

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

export const skillData: SkillCategory[] = [
  {
    description: "Expert",
    level: "expert",
    skills: [
      { icon: icon(SiNextdotjs), name: "Next.js" },
      { icon: icon(SiReact), name: "React" },
      { icon: icon(SiTypescript), name: "TypeScript" },
      { icon: icon(SiJavascript), name: "JavaScript (ES6+)" },
      { icon: icon(SiRedux), name: "狀態管理：Redux、Zustand" },
      { icon: icon(SiTailwindcss), name: "Tailwind CSS" },
      { icon: icon(SiOpenai), name: "Ai 輔助開發" },
    ],
    title: "核心專長",
  },
  {
    description: "Proficient",
    level: "proficient",
    skills: [
      { icon: icon(SiReactquery), name: "React-Query / TanStack Query" },
      { icon: icon(SiMui), name: "Material UI" },
      { icon: icon(SiStyledcomponents), name: "Styled-components" },
      { icon: icon(SiSass), name: "SASS / SCSS" },
      { icon: icon(SiGithub), name: "Git & GitHub / GitLab" },
      { icon: icon(TbApi), name: "AJAX(RESTful API)" },
      { icon: icon(SiFigma), name: "Figma / Zeplin" },
    ],
    title: "熟悉使用",
  },
  {
    description: "Familiar",
    level: "familiar",
    skills: [
      { icon: icon(TbBrandLine), name: "Line LIFF" },
      { icon: icon(SiJest), name: "Jest" },
      { icon: icon(SiMongodb), name: "MongoDB" },
      { icon: icon(SiExpress), name: "Express.js" },
      { icon: icon(SiPhp), name: "PHP / MySQL" },
      { icon: icon(TbSettings), name: "CI/CD" },
      { icon: icon(SiMocha), name: "Mocha" },
    ],
    title: "有涉獵",
  },
];
