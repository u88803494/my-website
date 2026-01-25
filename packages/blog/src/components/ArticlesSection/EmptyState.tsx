"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const EmptyState = () => {
  const t = useTranslations("Blog");

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="py-20 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card bg-base-100 border-base-200 mx-auto max-w-md border shadow-xl">
        <div className="card-body text-center">
          <motion.div
            animate={{ scale: 1 }}
            className="mb-6"
            initial={{ scale: 0 }}
            transition={{ delay: 0.2, stiffness: 200, type: "spring" }}
          >
            <FileText aria-hidden="true" className="text-base-content/30 mx-auto h-16 w-16" />
          </motion.div>
          <h3 className="card-title mb-2 justify-center text-xl">{t("emptyState.title")}</h3>
          <p className="text-base-content/70 whitespace-pre-line leading-relaxed">{t("emptyState.description")}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
