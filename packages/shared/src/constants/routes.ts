import { type NavRoute } from "@packages/shared/types";

// Route configuration with i18n translation keys (Navigation namespace)
export const routes: NavRoute[] = [
  { href: "/", labelKey: "home" },
  { href: "/blog", labelKey: "blog" },
  { href: "/ai-dictionary", labelKey: "aiDictionary" },
  { href: "/ai-analyzer", labelKey: "aiAnalyzer" },
  { href: "/ai-chat", labelKey: "aiChat" },
  { href: "/time-tracker", labelKey: "timeTracker" },
  { href: "/about", labelKey: "about" },
];
