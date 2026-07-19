"use client";

import { motion } from "framer-motion";
import React from "react";
import { SiMedium } from "react-icons/si";

import type { MediumArticlesContent } from "../../types/resumeContent.types";

interface SectionHeaderProps {
  content: MediumArticlesContent;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ content }) => {
  return (
    <motion.div
      className="mb-16 text-center"
      initial={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* 桌面版：圖標和文字在同一行 */}
      <h2 className="mb-4 hidden items-center justify-center gap-3 text-4xl font-bold md:flex">
        <SiMedium className="text-base-content h-10 w-10" />
        {content.heading}
      </h2>

      {/* 手機版：圖標在上，文字分兩行 */}
      <div className="mb-4 md:hidden">
        <SiMedium className="text-base-content mx-auto mb-3 h-10 w-10" />
        <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
          <div>{content.mobileHeadingLines[0]}</div>
          <div className="text-2xl sm:text-3xl">{content.mobileHeadingLines[1]}</div>
        </h2>
      </div>

      <div className="bg-primary mx-auto mb-6 h-1 w-20" />
      <p className="text-base-content/80 mx-auto max-w-2xl px-4 text-lg">{content.description}</p>
    </motion.div>
  );
};

export default SectionHeader;
