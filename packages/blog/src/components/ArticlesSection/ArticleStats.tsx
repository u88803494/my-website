"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ArticleStatsProps {
  hasNextPage: boolean;
  totalCount: number;
}

const ArticleStats = ({ hasNextPage, totalCount }: ArticleStatsProps) => {
  const t = useTranslations("Blog");

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="mb-12 text-center"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="stats bg-base-100 shadow">
        <div className="stat">
          <div className="stat-title">{t("stats.title")}</div>
          <div className="stat-value text-primary">{totalCount}</div>
          <div className="stat-desc">
            {hasNextPage && t("stats.scrollForMore")}
            {!hasNextPage && totalCount > 0 && t("stats.allLoaded")}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleStats;
