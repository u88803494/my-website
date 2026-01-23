import { AIDictionaryFeature } from "@packages/ai-dictionary";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface AIDictionaryPageProps {
  params: Promise<{ locale: Locale }>;
}

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

const AIDictionaryPage = async ({ params }: AIDictionaryPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <AIDictionaryFeature />;
};

export default AIDictionaryPage;
