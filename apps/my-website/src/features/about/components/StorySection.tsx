"use client";

import { motion } from "framer-motion";
import React from "react";

const StorySection = () => {
  const paragraphs = [
    "我的工程師之旅始於對解決問題的純粹熱愛。從早期使用 React 和 Redux 建構全端部落格，到後來在專業領域中主導複雜的系統開發，我始終享受著將抽象概念轉化為具體產品的過程。",
    "在「健康益友」，我主導了遠距醫療系統的 Web 介面開發，透過導入 Mono Repo 架構與優化數據流，不僅顯著提升了開發效率，更將開發成本降低了 50%。在「威許移動」，我建立了前端團隊的技術標準，並設計了模組化架構，為快速迭代的業務需求提供了穩固的技術基礎。",
    "我相信，最優秀的程式碼不僅僅是能運作的程式碼，更是清晰、可擴展且易於協作的。這份信念驅使我持續學習、樂於分享，並將 AI 輔助開發等新興技術融入我的工作流程中，不斷探索軟體開發的更高效率與可能性。",
  ];

  return (
    <section className="mb-12">
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        我的故事
      </motion.h3>
      <div className="text-base-content/90 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            key={index}
            transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
            whileHover={{ x: 5 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </section>
  );
};

export default StorySection;
