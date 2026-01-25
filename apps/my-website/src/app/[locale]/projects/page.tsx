import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface ProjectsPageProps {
  params: Promise<{ locale: Locale }>;
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations("ProjectsPage");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
      <p className="text-lg">{t("description")}</p>
    </div>
  );
};

export default ProjectsPage;
