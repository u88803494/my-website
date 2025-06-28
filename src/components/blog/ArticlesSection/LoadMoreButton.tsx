"use client";

import { motion } from "framer-motion";

import SkeletonCard from "./SkeletonCard";

interface LoadMoreButtonProps {
  isLoading: boolean;
  onLoadMore: () => void;
}

const LoadMoreButton = ({ isLoading, onLoadMore }: LoadMoreButtonProps) => {
  if (isLoading) {
    return (
      <div className="py-8">
        {/* Loading skeleton cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard index={index} key={index} />
          ))}
        </div>
      </div>
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
