import { setRequestLocale } from "next-intl/server";

import { AIChatFeature } from "@/features/ai-chat";
import type { Locale } from "@/i18n/routing";

interface AIChatPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * AI Chat Page (Server Component)
 *
 * 此頁面使用 Vercel AI SDK 的 useChat hook 進行 streaming 對話，
 * 屬於純 client-side 互動，不需要 server-side prefetch。
 */
const AIChatPage = async ({ params }: AIChatPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <AIChatFeature />;
};

export default AIChatPage;
