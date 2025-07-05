import type { Metadata } from "next";

import { AIDictionaryPage } from "@/features/ai-dictionary";

export const metadata: Metadata = {
  description:
    "AI 智能中文字典，運用人工智慧技術深度解析中文詞彙含義與字源。支援詞彙、成語及專有名詞查詢，讓學習中文更輕鬆有趣。",
  title: "AI 智能中文字典 | Henry Lee",
};

// 路由級別的頁面組件
const Page: React.FC = () => {
  return <AIDictionaryPage />;
};

export default Page;
