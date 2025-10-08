import type { NavRoute } from "../types/route.types";

// 路由設定
export const routes: NavRoute[] = [
  {
    href: "/",
    label: "首頁",
  },
  {
    href: "/blog",
    label: "部落格",
  },
  {
    href: "/ai-dictionary",
    label: "AI 字典",
  },
  {
    href: "/ai-analyzer",
    label: "AI 需求分析器",
  },
  {
    href: "/time-tracker",
    label: "時間追蹤器",
  },
  {
    href: "/about",
    label: "關於我",
  },
];
