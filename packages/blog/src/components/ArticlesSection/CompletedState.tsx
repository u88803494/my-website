"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface CompletedStateProps {
  totalCount: number;
}

const CompletedState = ({ totalCount }: CompletedStateProps) => {
  const t = useTranslations("Blog");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="py-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.5 }}
    >
      <div className="card bg-base-100 mx-auto max-w-md shadow-xl">
        <div className="card-body text-center">
          <div className="mb-4 text-4xl">🎉</div>
          <h3 className="card-title justify-center">{t("completedState.title")}</h3>
          <p className="text-base-content/70">{t("completedState.description", { count: totalCount })}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CompletedState;
