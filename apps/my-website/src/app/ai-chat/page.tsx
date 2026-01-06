import type { Metadata } from "next";

import { AIChatFeature } from "@/features/ai-chat";

export const metadata: Metadata = {
  description: "與多種 AI 模型對話，支援 Gemini、Llama、Mistral 等多種模型切換",
  title: "AI Chat - Henry Lee",
};

/**
 * AI Chat Page (Server Component)
 *
 * 此頁面使用 Vercel AI SDK 的 useChat hook 進行 streaming 對話，
 * 屬於純 client-side 互動，不需要 server-side prefetch。
 */
const AIChatPage: React.FC = () => {
  return <AIChatFeature />;
};

export default AIChatPage;
