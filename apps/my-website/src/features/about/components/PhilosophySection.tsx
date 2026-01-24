"use client";

import { motion } from "framer-motion";
import { BrainCircuit, MessageSquareQuote, Share2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface Philosophy {
  descriptionKey: string;
  icon: React.ReactNode;
  titleKey: string;
}

const philosophyItems: Philosophy[] = [
  {
    descriptionKey: "philosophy.codeAsCommunication.description",
    icon: <MessageSquareQuote className="text-primary h-8 w-8" />,
    titleKey: "philosophy.codeAsCommunication.title",
  },
  {
    descriptionKey: "philosophy.userCentered.description",
    icon: <Users className="text-primary h-8 w-8" />,
    titleKey: "philosophy.userCentered.title",
  },
  {
    descriptionKey: "philosophy.aiCollaboration.description",
    icon: <BrainCircuit className="text-primary h-8 w-8" />,
    titleKey: "philosophy.aiCollaboration.title",
  },
  {
    descriptionKey: "philosophy.sharingGrowth.description",
    icon: <Share2 className="text-primary h-8 w-8" />,
    titleKey: "philosophy.sharingGrowth.title",
  },
];

const PhilosophyCard: React.FC<{
  description: string;
  index: number;
  item: Philosophy;
  title: string;
}> = ({ description, index, item, title }) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="card border-base-300 bg-base-100 h-full border shadow-sm transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
    whileHover={{
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      scale: 1.02,
      transition: { duration: 0.3 },
    }}
  >
    <div className="card-body">
      <motion.div className="mb-4" transition={{ duration: 0.3 }} whileHover={{ rotate: 5, scale: 1.1 }}>
        {item.icon}
      </motion.div>
      <h4 className="card-title mb-2">{title}</h4>
      <p className="text-base-content/80">{description}</p>
    </div>
  </motion.div>
);

const PhilosophySection = () => {
  const t = useTranslations("About");

  return (
    <section className="mb-12">
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        {t("philosophy.title")}
      </motion.h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {philosophyItems.map((item, index) => (
          <PhilosophyCard
            description={t(item.descriptionKey)}
            index={index}
            item={item}
            key={item.titleKey}
            title={t(item.titleKey)}
          />
        ))}
      </div>
    </section>
  );
};

export default PhilosophySection;
