"use client";

import { motion } from "framer-motion";

interface ArticleStatsProps {
  hasNextPage: boolean;
  totalCount: number;
}

const ArticleStats = ({ hasNextPage, totalCount }: ArticleStatsProps) => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="mb-12 text-center"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="stats bg-base-100 shadow">
        <div className="stat">
          <div className="stat-title">已載入文章</div>
          <div className="stat-value text-primary">{totalCount}</div>
          <div className="stat-desc">
            {hasNextPage && "向下滾動載入更多"}
            {!hasNextPage && totalCount > 0 && "已載入所有文章"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleStats;
