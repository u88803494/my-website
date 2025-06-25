"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { articleList } from '@/data/articleData';
import ArticleCard from './ArticleCard';
import { SiMedium } from 'react-icons/si';

const MediumArticles: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedArticles = showAll ? articleList : articleList.slice(0, 4);

  return (
    <section className="py-20 bg-base-200" id="medium-articles">
      <div className="container mx-auto px-4">
        {/* 標題區域 */}
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

        {/* 文章網格 */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {displayedArticles.map((article, idx) => (
            <motion.div
              key={article.title + idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: idx * 0.1 
              }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>

        {/* 顯示更多按鈕 */}
        {articleList.length > 4 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-outline btn-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? '顯示較少' : `查看全部 ${articleList.length} 篇文章`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MediumArticles; 