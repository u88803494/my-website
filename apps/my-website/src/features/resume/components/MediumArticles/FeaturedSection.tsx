"use client";

import { type Article } from "@packages/shared/types";
import { motion } from "framer-motion";

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
      transition={{ delay: 0.2, duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6 flex items-center gap-2">
        <h3 className="text-base-content text-xl font-semibold">📰 最新文章</h3>
      </div>

      <div className="grid w-full gap-6 md:grid-cols-2">
        {articles.map((article, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            key={article.title + idx}
            transition={{
              delay: idx * 0.1,
              duration: 0.5,
            }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedSection;
