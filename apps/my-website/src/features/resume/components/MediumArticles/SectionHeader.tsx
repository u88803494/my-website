"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";
import { SiMedium } from "react-icons/si";

const SectionHeader: React.FC = () => {
  const t = useTranslations("MediumArticles");

  return (
    <motion.div
      className="mb-16 text-center"
      initial={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Desktop: Icon and text in one line */}
      <h2 className="mb-4 hidden items-center justify-center gap-3 text-4xl font-bold md:flex">
        <SiMedium className="text-base-content h-10 w-10" />
        {t("sectionHeader.title")} {t("sectionHeader.titleMedium")}
      </h2>

      {/* Mobile: Icon on top, text in two lines */}
      <div className="mb-4 md:hidden">
        <SiMedium className="text-base-content mx-auto mb-3 h-10 w-10" />
        <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
          <div>{t("sectionHeader.title")}</div>
          <div className="text-2xl sm:text-3xl">{t("sectionHeader.titleMedium")}</div>
        </h2>
      </div>

      <div className="bg-primary mx-auto mb-6 h-1 w-20" />
      <p className="text-base-content/80 mx-auto max-w-2xl px-4 text-lg">{t("sectionHeader.subtitle")}</p>
    </motion.div>
  );
};

export default SectionHeader;
