import { AIAnalyzerFeature } from "@packages/ai-analyzer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  description: "想不到怎麼下提示詞嗎？用用這個工具，或許你可以釐清你的需求。",
  title: "AI Prompt 生成器 | Henry Lee",
};

// Force dynamic rendering for this page (uses React Query)
export const dynamic = "force-dynamic";

const AIAnalyzerPage = () => {
  return <AIAnalyzerFeature />;
};

export default AIAnalyzerPage;
