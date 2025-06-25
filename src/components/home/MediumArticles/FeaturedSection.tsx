"use client";

import React from "react";
import { motion } from "framer-motion";
import { Article } from "@/types/article.types";
import ArticleCard from "./ArticleCard";

interface FeaturedSectionProps {
  articles: Article[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <h3 className="text-xl font-semibold text-base-content">最新文章</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full">
        {articles.map((article, idx) => (
          <motion.div
            key={article.title + idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: idx * 0.1,
            }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedSection;
