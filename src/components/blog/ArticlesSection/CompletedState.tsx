"use client";

import { motion } from "framer-motion";

interface CompletedStateProps {
  totalCount: number;
}

const CompletedState = ({ totalCount }: CompletedStateProps) => {
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
          <h3 className="card-title justify-center">所有文章已載入完成</h3>
          <p className="text-base-content/70">總共 {totalCount} 篇文章</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CompletedState;
