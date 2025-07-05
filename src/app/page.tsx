import type { Metadata } from "next";

import { ResumePage } from "@/features/resume";

export const metadata: Metadata = {
  description:
    "Henry Lee 的個人履歷網站，展示前端開發技能、工作經歷、專案作品與技術文章。專精於 React、Next.js、TypeScript 等現代前端技術。",
  title: "Henry Lee - 前端工程師履歷",
};

// 路由級別的頁面組件
const Page: React.FC = () => {
  return <ResumePage />;
};

export default Page;
