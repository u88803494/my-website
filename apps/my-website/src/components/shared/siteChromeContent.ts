import type { NavRoute } from "@packages/shared/types";

export interface FooterContent {
  connectLabel: string;
  role: string;
  summary: string;
}

export interface SiteChromeContent {
  contactLabel: string;
  footer: FooterContent;
  locale: "en" | "zh-Hant";
  routes: NavRoute[];
}

// The site chrome remains in English across every route to keep the portfolio's
// brand and primary navigation consistent, independently of page content language.
const englishRoutes: NavRoute[] = [
  { href: "/", label: "Home" },
  { href: "/resume-zh", label: "Chinese Resume" },
  { href: "/blog", label: "Blog" },
  { href: "/ai-dictionary", label: "AI Dictionary" },
  { href: "/ai-analyzer", label: "AI Analyzer" },
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/time-tracker", label: "Time Tracker" },
  { href: "/about", label: "About" },
];

export const globalEnglishSiteChrome: SiteChromeContent = {
  contactLabel: "Contact",
  footer: {
    connectLabel: "Let's stay connected",
    role: "Senior Software Engineer",
    summary: "Specializing in Frontend, AI, and Full-Stack Web Development with Next.js, React, and TypeScript.",
  },
  locale: "en",
  routes: englishRoutes,
};
