import { setRequestLocale } from "next-intl/server";

import ResumeFeature from "@/features/resume";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <ResumeFeature />;
};

export default HomePage;
