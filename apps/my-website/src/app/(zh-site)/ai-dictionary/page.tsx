import { AIDictionaryFeature } from "@packages/ai-dictionary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "運用人工智慧，以繁體中文理解中英文詞彙的常見意思與字源",
  title: "AI 中英字源字典 - Henry Lee",
};

/**
 * AI Dictionary Page (Server Component)
 *
 * ❌ 不使用 HydrationBoundary
 * 理由：此頁面僅使用 React Query mutations (POST requests)，
 * 不需要 server-side data prefetch，所有資料獲取都在 client-side 進行。
 *
 * Dynamic rendering required for client-only mutations
 */
export const dynamic = "force-dynamic";

const AIDictionaryPage: React.FC = () => {
  return <AIDictionaryFeature />;
};

export default AIDictionaryPage;
