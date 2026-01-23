import { setRequestLocale } from "next-intl/server";

import { AboutFeature } from "@/features/about";
import type { Locale } from "@/i18n/routing";

interface AboutPageProps {
  params: Promise<{ locale: Locale }>;
}

const AboutPage = async ({ params }: AboutPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <AboutFeature />;
};

export default AboutPage;
