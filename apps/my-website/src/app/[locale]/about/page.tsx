import { setRequestLocale } from "next-intl/server";

import { AboutFeature } from "@/features/about";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

const AboutPage = async ({ params }: AboutPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <AboutFeature />;
};

export default AboutPage;
