import { setRequestLocale } from "next-intl/server";

import ResumeFeature from "@/features/resume";
import type { Locale } from "@/i18n/routing";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <ResumeFeature />;
};

export default HomePage;
