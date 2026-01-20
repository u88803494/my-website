"use client";

import { cn } from "@packages/shared/utils";
import { motion } from "framer-motion";
import { Calendar, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface EducationItem {
  highlight: boolean;
  key: string;
}

const educationItems: EducationItem[] = [
  {
    highlight: true,
    key: "mentorProgram",
  },
  {
    highlight: false,
    key: "minghsin",
  },
  {
    highlight: false,
    key: "isu",
  },
];

interface EducationProps {
  backgroundClass: string;
  sectionId: string;
}

const Education: React.FC<EducationProps> = ({ backgroundClass, sectionId }) => {
  const t = useTranslations("Education");

  return (
    <section className={cn("pt-10 pb-16", backgroundClass)} id={sectionId}>
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base-content mb-4 text-4xl font-bold">{t("title")}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">{t("subtitle")}</p>
        </motion.div>

        <div className="mx-auto max-w-2xl space-y-4">
          {educationItems.map((edu, index) => (
            <motion.div
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors duration-200 ${
                edu.highlight
                  ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  : "bg-base-100 border-base-content/10 hover:bg-base-200/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              key={edu.key}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`${edu.highlight ? "text-primary" : "text-base-content/60"}`}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className={`font-medium ${edu.highlight ? "text-primary" : "text-base-content"}`}>
                    {t(`items.${edu.key}.title`)}
                  </h3>
                  <p className="text-base-content/70 text-sm">{t(`items.${edu.key}.description`)}</p>
                </div>
              </div>
              <div className="text-base-content/60 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span className="text-sm">{t(`items.${edu.key}.period`)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
