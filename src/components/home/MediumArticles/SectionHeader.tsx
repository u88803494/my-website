"use client";

import React from "react";
import { motion } from "framer-motion";
import { SiMedium } from "react-icons/si";

const SectionHeader: React.FC = () => {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* 桌面版：圖標和文字在同一行 */}
      <h2 className="hidden md:flex text-4xl font-bold mb-4 items-center justify-center gap-3">
        <SiMedium className="w-10 h-10 text-base-content" />
        技術文章 Medium Articles
      </h2>

      {/* 手機版：圖標在上，文字分兩行 */}
      <div className="md:hidden mb-4">
        <SiMedium className="w-10 h-10 text-base-content mx-auto mb-3" />
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          <div>技術文章</div>
          <div className="text-2xl sm:text-3xl">Medium Articles</div>
        </h2>
      </div>

      <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
      <p className="text-lg text-base-content/80 max-w-2xl mx-auto px-4">
        分享我在軟體開發路上的學習心得與技術見解，記錄成長的每一步
      </p>
    </motion.div>
  );
};

export default SectionHeader;
