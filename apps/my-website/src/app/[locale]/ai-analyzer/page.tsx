import { AIAnalyzerFeature } from "@packages/ai-analyzer";
import { setRequestLocale } from "next-intl/server";

interface AIAnalyzerPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * AI Analyzer Page (Server Component)
 *
 * ❌ 不使用 HydrationBoundary
 * 理由：此頁面僅使用 React Query mutations (POST requests)，
 * 不需要 server-side data prefetch，所有資料獲取都在 client-side 進行。
 */
const AIAnalyzerPage = async ({ params }: AIAnalyzerPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <AIAnalyzerFeature />;
};

export default AIAnalyzerPage;
