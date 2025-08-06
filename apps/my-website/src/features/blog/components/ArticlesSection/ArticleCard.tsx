"use client";

import { m } from "framer-motion";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { useMemo } from "react";
import { SiMedium } from "react-icons/si";

import { cn } from "@/utils/cn";

import type { MediumPost } from "../../types";

interface ArticleCardProps {
  article: MediumPost;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // 使用 useMemo 優化日期格式化
  const formattedDate = useMemo(() => {
    return new Date(article.firstPublishedAt).toLocaleDateString("zh-TW", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [article.firstPublishedAt]);

  // 生成文章摘要用於 SEO 和可訪問性
  const articleSummary = useMemo(() => {
    const subtitle = article.extendedPreviewContent?.subtitle;
    const collection = article.collection?.name;
    return `文章標題：${article.title}${subtitle ? `，摘要：${subtitle}` : ""}${collection ? `，分類：${collection}` : ""}，作者：${article.creator.name}，發布日期：${formattedDate}`;
  }, [
    article.title,
    article.extendedPreviewContent?.subtitle,
    article.collection?.name,
    article.creator.name,
    formattedDate,
  ]);

  return (
    <m.article
      animate={{ opacity: 1, y: 0 }}
      aria-label={articleSummary}
      className={cn(
        "card bg-base-100 h-full w-full shadow-xl",
        "border-base-200/50 hover:border-base-200 group border transition-colors duration-200",
      )}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        scale: 1.02,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-body flex h-full flex-col p-6">
        {/* Header with Medium icon */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SiMedium aria-hidden="true" className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-500">Medium Article</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar aria-hidden="true" className="h-3 w-3" />
            <time dateTime={new Date(article.firstPublishedAt).toISOString()}>{formattedDate}</time>
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "card-title mb-3 line-clamp-3 text-lg leading-tight font-bold",
            "group-hover:text-primary transition-colors",
          )}
        >
          <a href={article.mediumUrl} rel="noopener noreferrer" target="_blank">
            {article.title}
          </a>
        </h3>

        {/* Subtitle/Description */}
        {article.extendedPreviewContent?.subtitle && (
          <p className="mb-4 line-clamp-4 flex-grow text-sm leading-relaxed text-gray-700">
            {article.extendedPreviewContent.subtitle}
          </p>
        )}

        {/* Collection Tag */}
        {article.collection && (
          <div className="mb-4">
            <span className="badge badge-outline badge-sm gap-1" role="tag">
              <Tag aria-hidden="true" className="h-3 w-3" />
              {article.collection.name}
            </span>
          </div>
        )}

        {/* Author */}
        <div className="mb-4 flex items-center text-xs text-gray-500">
          <span>作者：{article.creator.name}</span>
        </div>

        {/* Read Button */}
        <div className="mt-auto">
          <m.a
            aria-label={`在 Medium 上閱讀文章：${article.title}`}
            className="btn btn-outline btn-sm hover:btn-primary focus:btn-primary flex w-full items-center gap-2"
            href={article.mediumUrl}
            rel="noopener noreferrer"
            target="_blank"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            閱讀文章
          </m.a>
        </div>
      </div>
    </m.article>
  );
};

export default ArticleCard;
