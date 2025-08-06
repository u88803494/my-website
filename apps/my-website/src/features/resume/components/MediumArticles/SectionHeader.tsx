"use client";

import { m } from "framer-motion";
import React from "react";
import { SiMedium } from "react-icons/si";

const SectionHeader: React.FC = () => {
  return (
    <m.div
      className="mb-16 text-center"
      initial={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* 桌面版：圖標和文字在同一行 */}
      <h2 className="mb-4 hidden items-center justify-center gap-3 text-4xl font-bold md:flex">
        <SiMedium className="text-base-content h-10 w-10" />
        技術文章 Medium Articles
      </h2>

      {/* 手機版：圖標在上，文字分兩行 */}
      <div className="mb-4 md:hidden">
        <SiMedium className="text-base-content mx-auto mb-3 h-10 w-10" />
        <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
          <div>技術文章</div>
          <div className="text-2xl sm:text-3xl">Medium Articles</div>
        </h2>
      </div>

      <div className="bg-primary mx-auto mb-6 h-1 w-20" />
      <p className="text-base-content/80 mx-auto max-w-2xl px-4 text-lg">
        分享我在軟體開發路上的學習心得與技術見解，記錄成長的每一步
      </p>
    </m.div>
  );
};

export default SectionHeader;
