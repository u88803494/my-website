"use client";

import { motion } from "framer-motion";

interface LoadMoreButtonProps {
  isLoading: boolean;
  onLoadMore: () => void;
}

const LoadMoreButton = ({ isLoading, onLoadMore }: LoadMoreButtonProps) => {
  if (isLoading) {
    return (
      <motion.div animate={{ opacity: 1 }} className="py-8 text-center" initial={{ opacity: 0 }}>
        <span aria-hidden="true" className="loading loading-spinner loading-md text-primary" />
        <p aria-live="polite" className="text-base-content/70 mt-4" role="status">
          載入更多文章中...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.button
      aria-label="載入更多文章"
      className="btn btn-primary btn-lg shadow-lg transition-shadow hover:shadow-xl"
      onClick={onLoadMore}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      載入更多文章
    </motion.button>
  );
};

export default LoadMoreButton;
