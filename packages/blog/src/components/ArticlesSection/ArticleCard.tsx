"use client";

import { cn } from "@packages/shared/utils";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { SiMedium } from "react-icons/si";

import type { MediumPost } from "../../types";

interface ArticleCardProps {
  article: MediumPost;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const t = useTranslations("Blog");
  const locale = useLocale();

  // Format date based on current locale
  const formattedDate = useMemo(() => {
    return new Date(article.firstPublishedAt).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [article.firstPublishedAt, locale]);

  // Generate article summary for SEO and accessibility
  const articleSummary = useMemo(() => {
    const subtitle = article.extendedPreviewContent?.subtitle;
    const collection = article.collection?.name;
    return t("articleCard.articleSummary", {
      title: article.title,
      subtitle: subtitle ? `, ${subtitle}` : "",
      collection: collection ? `, ${collection}` : "",
      author: article.creator.name,
      date: formattedDate,
    });
  }, [
    t,
    article.title,
    article.extendedPreviewContent?.subtitle,
    article.collection?.name,
    article.creator.name,
    formattedDate,
  ]);

  return (
    <motion.article
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
            <span className="text-sm text-gray-500">{t("articleCard.mediumLabel")}</span>
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
          <span>{t("articleCard.authorLabel", { name: article.creator.name })}</span>
        </div>

        {/* Read Button */}
        <div className="mt-auto">
          <motion.a
            aria-label={t("articleCard.readArticleAria", { title: article.title })}
            className="btn btn-outline btn-sm hover:btn-primary focus:btn-primary flex w-full items-center gap-2"
            href={article.mediumUrl}
            rel="noopener noreferrer"
            target="_blank"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            {t("articleCard.readArticle")}
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
