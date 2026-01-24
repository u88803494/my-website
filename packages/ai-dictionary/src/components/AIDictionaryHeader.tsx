"use client";

import { useTranslations } from "next-intl";

const AIDictionaryHeader: React.FC = () => {
  const t = useTranslations("AIDictionary");

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-3xl font-light text-slate-800">
            {t("header.title")}
            <span className="ml-3 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
              {t("header.beta")}
            </span>
          </h1>
          <p className="text-slate-600">{t("header.subtitle")}</p>
        </div>
      </div>
    </div>
  );
};

export default AIDictionaryHeader;
