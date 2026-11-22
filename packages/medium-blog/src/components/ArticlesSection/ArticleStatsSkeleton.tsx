"use client";

import { motion } from "framer-motion";

const ArticleStatsSkeleton = () => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="mb-12 text-center"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="stats bg-base-100 shadow">
        <div className="stat">
          <div className="stat-title">
            <div className="skeleton mx-auto h-4 w-20" />
          </div>
          <div className="stat-value flex justify-center pt-2">
            <div className="skeleton h-8 w-12" />
          </div>
          <div className="stat-desc pt-2">
            <div className="skeleton mx-auto h-3 w-32" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleStatsSkeleton;
