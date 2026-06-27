import "../globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import QueryProvider from "@/components/providers/QueryProvider";
import ConditionalFooter from "@/components/shared/ConditionalFooter";
import { Navbar } from "@/components/shared/Navbar";
import NProgressBar from "@/components/shared/NProgressBar";
import { type Locale, routing } from "@/i18n/routing";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const baseUrl = "https://henryleelab.com";

const getLocalizedPath = (locale: Locale, path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const localizedPath = normalizedPath === "/" ? "" : normalizedPath;

  if (locale === routing.defaultLocale && routing.localePrefix === "as-needed") {
    return localizedPath;
  }

  return `/${locale}${localizedPath}`;
};

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata based on locale
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const canonicalUrl = `${baseUrl}${getLocalizedPath(locale)}`;

  return {
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: baseUrl,
        "x-default": baseUrl,
        "zh-TW": `${baseUrl}/zh-TW`,
      },
    },
    authors: [{ name: "Henry Lee", url: baseUrl }],
    creator: "Henry Lee",
    description: t("description"),
    keywords: ["Henry Lee", "Frontend Engineer", "AI Engineer", "Next.js", "React", "TypeScript", "AI", "Portfolio"],
    openGraph: {
      description: t("description"),
      images: [
        {
          alt: "Henry Lee Portrait",
          height: 512,
          url: `${baseUrl}/images/my-photo.jpeg`,
          width: 512,
        },
      ],
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
      title: t("title"),
      type: "website",
      url: canonicalUrl,
    },
    publisher: "Henry Lee",
    robots: "index, follow",
    title: t("title"),
    twitter: {
      card: "summary",
      description: t("description"),
      images: [`${baseUrl}/images/my-photo.jpeg`],
      title: t("title"),
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html data-theme="corporate" lang={locale === "zh-TW" ? "zh-Hant" : "en"}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              image: "https://henryleelab.com/images/my-photo.jpeg",
              jobTitle: locale === "zh-TW" ? "資深 AI 前端工程師" : "Senior AI Frontend Engineer",
              name: "Henry Lee",
              sameAs: ["https://github.com/u88803494", "https://linkedin.com/in/henryleelab"],
              url: "https://henryleelab.com",
              worksFor: {
                "@type": "Organization",
                name: "Henry Lee Lab",
              },
            }),
          }}
          type="application/ld+json"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider>
          <QueryProvider>
            <Navbar />
            <NProgressBar />
            <main className="flex-1 overflow-x-hidden pt-16">{children}</main>
            <ConditionalFooter />
          </QueryProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default LocaleLayout;
