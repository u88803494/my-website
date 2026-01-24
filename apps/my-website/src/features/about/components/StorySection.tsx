"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

const StorySection = () => {
  const t = useTranslations("About");

  const paragraphs = [t("story.paragraph1"), t("story.paragraph2"), t("story.paragraph3")];

  return (
    <section className="mb-12">
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        {t("story.title")}
      </motion.h3>
      <div className="text-base-content/90 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            key={index}
            transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
            whileHover={{ x: 5 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </section>
  );
};

export default StorySection;
