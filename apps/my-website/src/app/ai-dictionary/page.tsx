import { AIDictionaryFeature } from "@packages/ai-dictionary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "運用人工智慧技術，讓中文詞彙含義與字源更容易理解",
  title: "AI 智能中文字典 - Henry Lee",
};

/**
 * AI Dictionary Page (Server Component)
 *
 * ❌ 不使用 HydrationBoundary
 * 理由：此頁面僅使用 React Query mutations (POST requests)，
 * 不需要 server-side data prefetch，所有資料獲取都在 client-side 進行。
 */
const AIDictionaryPage: React.FC = () => {
  return <AIDictionaryFeature />;
};

export default AIDictionaryPage;
