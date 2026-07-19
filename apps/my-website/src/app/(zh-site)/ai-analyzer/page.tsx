import { AIAnalyzerFeature } from "@packages/ai-analyzer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  description: "想不到怎麼下提示詞嗎？用用這個工具，或許你可以釐清你的需求。",
  title: "AI Prompt 生成器 | Henry Lee",
};

/**
 * AI Analyzer Page (Server Component)
 *
 * ❌ 不使用 HydrationBoundary
 * 理由：此頁面僅使用 React Query mutations (POST requests)，
 * 不需要 server-side data prefetch，所有資料獲取都在 client-side 進行。
 */
const AIAnalyzerPage = () => {
  return <AIAnalyzerFeature />;
};

export default AIAnalyzerPage;
