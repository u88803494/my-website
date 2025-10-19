"use client";

import { m } from "framer-motion";
import { Calendar, Clock, ExternalLink, Eye, Heart } from "lucide-react";
import React from "react";
import { SiMedium } from "react-icons/si";

import { Article } from "@/types/article.types";
import { cn } from "@/utils/cn";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString("zh-TW", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <m.div
      className={cn(
        "card bg-base-100 h-full w-full max-w-full shadow-xl",
        "border-base-200/50 hover:border-base-200 group border transition-colors duration-200",
      )}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        scale: 1.02,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-body flex h-full flex-col">
        {/* Header with Medium icon */}
        <div className="mb-3 flex items-center gap-2">
          <SiMedium className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-500">Medium Article</span>
        </div>

        {/* Title and Subtitle */}
        <h3
          className={cn("card-title mb-2 line-clamp-2 text-lg font-bold", "group-hover:text-primary transition-colors")}
        >
          <a href={article.url} rel="noopener noreferrer" target="_blank">
            {article.title}
          </a>
        </h3>
        <p className="mb-3 line-clamp-1 text-sm text-gray-600 italic">{article.subtitle}</p>

        {/* Description */}
        <p className="mb-4 line-clamp-3 flex-grow text-sm text-gray-700">{article.description}</p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span className="badge badge-outline badge-sm text-xs" key={idx}>
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="badge badge-ghost badge-sm text-xs">+{article.tags.length - 3}</span>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
          </div>

          {(article.views || article.claps) && (
            <div className="flex items-center gap-3">
              {article.views && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              )}
              {article.claps && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{article.claps}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Read Button */}
        <div className="mt-auto">
          <m.a
            className="btn btn-outline btn-sm flex w-full items-center gap-2"
            href={article.url}
            rel="noopener noreferrer"
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="h-4 w-4" />
            閱讀文章
          </m.a>
        </div>
      </div>
    </m.div>
  );
};

export default ArticleCard;
