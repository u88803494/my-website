"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const BlogHero = () => {
  const t = useTranslations("Blog");

  return (
    <section className="from-primary/10 via-base-100 to-secondary/10 bg-gradient-to-br py-20">
      <div className="container mx-auto px-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-base-content mb-4 text-4xl font-bold md:text-5xl">{t("hero.title")}</h1>
          <p className="text-base-content/70 mx-auto max-w-2xl text-lg leading-relaxed">{t("hero.subtitle")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;
