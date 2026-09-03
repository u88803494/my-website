"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import type { PostSummary } from "../types";

const MAX_VISIBLE_TAGS = 3;

interface ArticleCardProps {
  post: PostSummary;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = useMemo(
    () =>
      new Date(post.date).toLocaleDateString("zh-TW", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [post.date],
  );

  const visibleTags = post.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = post.tags.length - visibleTags.length;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="border-base-300 group relative border-b py-8 first:pt-0 last:border-b-0"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <time className="text-base-content/50 text-xs" dateTime={post.date}>
        {formattedDate}
      </time>

      {/* The entire list item is clickable (stretched link); an internal nav link
          doesn't need an extra "Read article" button */}
      <h3 className="group-hover:text-primary mt-2 text-xl font-bold transition-colors sm:text-2xl">
        <Link className="after:absolute after:inset-0" href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h3>

      <p className="text-base-content/70 mt-2 line-clamp-2 text-sm sm:text-base">{post.description}</p>

      <div className="text-base-content/50 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span>{post.readTime}</span>
        {visibleTags.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>
              {visibleTags.join(" · ")}
              {hiddenTagCount > 0 && ` +${hiddenTagCount}`}
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
}
