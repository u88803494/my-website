"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import { skillData } from "@/data/skillData";
import { cn } from "@/utils/cn";

import SkillCategory from "./SkillCategory";

interface SkillsProps {
  backgroundClass: string;
  sectionId: string;
}

const Skills: React.FC<SkillsProps> = ({ backgroundClass, sectionId }) => {
  const t = useTranslations("Skills");

  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="prose prose-neutral container mx-auto max-w-6xl px-2 md:px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base-content mb-4 text-4xl font-bold">{t("title")}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">{t("subtitle")}</p>
        </motion.div>

        <div className="not-prose grid grid-cols-1 gap-8 md:grid-cols-2">
          {skillData.map((category, index) => (
            <SkillCategory
              index={index}
              key={index}
              level={category.level}
              skills={category.skills}
              titleKey={category.titleKey}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
