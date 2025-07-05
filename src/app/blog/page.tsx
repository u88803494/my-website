import type { Metadata } from "next";

import { BlogPage } from "@/features/blog";

export const metadata: Metadata = {
  description: "探索 Henry Lee 的技術文章與開發心得，涵蓋前端開發、React、Next.js、TypeScript 等主題。",
  title: "技術文章 | Henry Lee",
};

// 路由級別的頁面組件
const Page = () => {
  return <BlogPage />;
};

export default Page;
