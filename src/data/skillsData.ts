export interface SkillCategory {
  title: string;
  level: 'expert' | 'proficient' | 'familiar';
  skills: string[];
  description: string;
}

export const skillsData: SkillCategory[] = [
  {
    title: "核心專長",
    level: "expert",
    description: "Expert",
    skills: [
      "Next.js",
      "React", 
      "TypeScript",
      "JavaScript (ES6+)",
      "狀態管理：Redux、Zustand",
      "Tailwind CSS",
      "Ai 輔助開發"
    ]
  },
  {
    title: "熟悉使用", 
    level: "proficient",
    description: "Proficient",
    skills: [
      "React-Query / TanStack Query",
      "Material UI",
      "Styled-components", 
      "SASS / SCSS",
      "Git & GitHub / GitLab",
      "AJAX(RESTful API)",
      "Figma / Zeplin"
    ]
  },
  {
    title: "有涉獵",
    level: "familiar", 
    description: "Familiar",
    skills: [
      "Line LIFF",
      "Jest",
      "MongoDB",
      "Express.js", 
      "PHP / MySQL",
      "CI/CD",
      "Mocha"
    ]
  }
]; 