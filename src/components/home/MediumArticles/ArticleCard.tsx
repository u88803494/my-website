"use client";

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Article } from '@/types/article.types';
import { ExternalLink, Calendar, Clock, Eye, Heart } from 'lucide-react';
import { SiMedium } from 'react-icons/si';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className={clsx(
        'card bg-base-100 shadow-xl h-full w-full max-w-full',
        'border border-base-200/50 hover:border-base-200 transition-colors duration-200 group'
      )}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <div className="card-body flex flex-col h-full">
        {/* Header with Medium icon */}
        <div className="flex items-center gap-2 mb-3">
          <SiMedium className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-500">Medium Article</span>
        </div>

        {/* Title and Subtitle */}
        <h3 className={clsx(
          'card-title text-lg font-bold mb-2 line-clamp-2',
          'group-hover:text-primary transition-colors'
        )}>
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 italic line-clamp-1">
          {article.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
          {article.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="badge badge-outline badge-sm text-xs"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="badge badge-ghost badge-sm text-xs">
              +{article.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          {(article.views || article.claps) && (
            <div className="flex items-center gap-3">
              {article.views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              )}
              {article.claps && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{article.claps}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Read Button */}
        <div className="mt-auto">
          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm w-full flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4" />
            閱讀文章
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard; 