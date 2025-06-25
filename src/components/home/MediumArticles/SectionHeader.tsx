"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SiMedium } from 'react-icons/si';

const SectionHeader: React.FC = () => {
  return (
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
        <SiMedium className="w-10 h-10 text-base-content" />
        技術文章 Medium Articles
      </h2>
      <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
      <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
        分享我在軟體開發路上的學習心得與技術見解，記錄成長的每一步
      </p>
    </motion.div>
  );
};

export default SectionHeader; 