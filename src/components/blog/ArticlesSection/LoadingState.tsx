"use client";

import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <motion.div animate={{ opacity: 1 }} className="py-20 text-center" initial={{ opacity: 0 }}>
      <span className="loading loading-spinner loading-lg text-primary mb-4" />
      <p className="text-base-content/70">載入文章中...</p>
    </motion.div>
  );
};

export default LoadingState;
