import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import TimeTrackerFeature from "@/features/time-tracker";
import { type Locale, routing } from "@/i18n/routing";

interface TimeTrackerPageProps {
  params: Promise<{ locale: Locale }>;
}

const baseUrl = "https://henryleelab.com";
const pagePath = "/time-tracker";

const getLocalizedUrl = (locale: Locale) => {
  const localizedPath =
    locale === routing.defaultLocale && routing.localePrefix === "as-needed" ? pagePath : `/${locale}${pagePath}`;

  return `${baseUrl}${localizedPath}`;
};

export async function generateMetadata({ params }: TimeTrackerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.pages.timeTracker" });
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
 * 時間追蹤頁面
 * 提供完整的時間記錄和分析功能
 */
const TimeTrackerPage = async ({ params }: TimeTrackerPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <TimeTrackerFeature />;
};

export default TimeTrackerPage;
