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

// 簡潔的圖標包裝函數，避免重複 className
const icon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>): ReactNode => (
  <IconComponent className="h-4 w-4" />
);

export interface Skill {
  icon: ReactNode;
  name: string;
}

export interface SkillCategory {
  id: "ai-development" | "backend" | "frontend-architecture" | "ui-tools";
  level: "expert" | "familiar" | "proficient";
  skills: Skill[];
  title: string;
}

export const skillData: SkillCategory[] = [
  {
    id: "ai-development",
    level: "expert",
    skills: [
      { icon: icon(SiVercel), name: "Vercel AI SDK" },
      { icon: icon(SiGooglegemini), name: "Google Gemini API" },
      { icon: icon(TbMessageChatbot), name: "Prompt Engineering" },
      { icon: icon(TbApi), name: "Streaming UI" },
    ],
    title: "AI 應用開發",
  },
  {
    id: "frontend-architecture",
    level: "expert",
    skills: [
      { icon: icon(SiNextdotjs), name: "Next.js 16" },
      { icon: icon(SiReact), name: "React 19" },
      { icon: icon(SiTypescript), name: "TypeScript" },
      { icon: icon(SiReactquery), name: "TanStack Query" },
      { icon: icon(TbPaw), name: "Zustand" },
    ],
    title: "現代前端架構",
  },
  {
    id: "ui-tools",
    level: "proficient",
    skills: [
      { icon: icon(SiTailwindcss), name: "Tailwind CSS / DaisyUI" },
      { icon: icon(SiTurborepo), name: "Turborepo (Monorepo)" },
      { icon: icon(SiOpenai), name: "Claude Code 輔助開發" },
      { icon: icon(SiGithub), name: "Git & GitHub" },
      { icon: icon(TbBrandDaysCounter), name: "Figma / Zeplin" },
    ],
    title: "UI / 開發工具",
  },
  {
    id: "backend",
    level: "familiar",
    skills: [
      { icon: icon(SiExpress), name: "Node.js / Express" },
      { icon: icon(SiMongodb), name: "MongoDB" },
      { icon: icon(SiSupabase), name: "Supabase" },
    ],
    title: "後端經驗",
  },
];
