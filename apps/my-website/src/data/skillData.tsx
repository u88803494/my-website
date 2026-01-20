import { type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  SiExpress,
  SiGithub,
  SiGooglegemini,
  SiMongodb,
  SiNextdotjs,
  SiOpenai,
  SiReact,
  SiReactquery,
  SiSupabase,
  SiTailwindcss,
  SiTurborepo,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { TbApi, TbBrandDaysCounter, TbMessageChatbot, TbPaw } from "react-icons/tb";

// Wrapper function to apply consistent icon styling
const icon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>): ReactNode => (
  <IconComponent className="h-4 w-4" />
);

export interface Skill {
  icon: ReactNode;
  nameKey: string; // Translation key for skill name
}

export interface SkillCategory {
  level: "expert" | "familiar" | "proficient";
  skills: Skill[];
  titleKey: string; // Translation key for category title
}

export const skillData: SkillCategory[] = [
  {
    level: "expert",
    skills: [
      { icon: icon(SiVercel), nameKey: "vercelAiSdk" },
      { icon: icon(SiGooglegemini), nameKey: "geminiApi" },
      { icon: icon(TbMessageChatbot), nameKey: "promptEngineering" },
      { icon: icon(TbApi), nameKey: "streamingUi" },
    ],
    titleKey: "aiDev",
  },
  {
    level: "expert",
    skills: [
      { icon: icon(SiNextdotjs), nameKey: "nextjs" },
      { icon: icon(SiReact), nameKey: "react" },
      { icon: icon(SiTypescript), nameKey: "typescript" },
      { icon: icon(SiReactquery), nameKey: "tanstackQuery" },
      { icon: icon(TbPaw), nameKey: "zustand" },
    ],
    titleKey: "frontend",
  },
  {
    level: "proficient",
    skills: [
      { icon: icon(SiTailwindcss), nameKey: "tailwind" },
      { icon: icon(SiTurborepo), nameKey: "turborepo" },
      { icon: icon(SiOpenai), nameKey: "claudeCode" },
      { icon: icon(SiGithub), nameKey: "git" },
      { icon: icon(TbBrandDaysCounter), nameKey: "figma" },
    ],
    titleKey: "tools",
  },
  {
    level: "familiar",
    skills: [
      { icon: icon(SiExpress), nameKey: "nodejs" },
      { icon: icon(SiMongodb), nameKey: "mongodb" },
      { icon: icon(SiSupabase), nameKey: "supabase" },
    ],
    titleKey: "backend",
  },
];
