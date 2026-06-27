import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AIChatFeature } from "@/features/ai-chat";
import { type Locale, routing } from "@/i18n/routing";

interface AIChatPageProps {
  params: Promise<{ locale: Locale }>;
}

const baseUrl = "https://henryleelab.com";
const pagePath = "/ai-chat";

const getLocalizedUrl = (locale: Locale) => {
  const localizedPath =
    locale === routing.defaultLocale && routing.localePrefix === "as-needed" ? pagePath : `/${locale}${pagePath}`;

  return `${baseUrl}${localizedPath}`;
};

export async function generateMetadata({ params }: AIChatPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.pages.aiChat" });
  const canonicalUrl = getLocalizedUrl(locale);

  return {
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}${pagePath}`,
        "x-default": `${baseUrl}${pagePath}`,
        "zh-TW": `${baseUrl}/zh-TW${pagePath}`,
      },
    },
    description: t("description"),
    openGraph: {
      description: t("description"),
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
      title: t("title"),
      type: "website",
      url: canonicalUrl,
    },
    title: t("title"),
    twitter: {
      card: "summary",
      description: t("description"),
      title: t("title"),
    },
  };
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
