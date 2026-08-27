import Link from "next/link";

import type { PostSummary } from "../types";

interface ArticleCardProps {
  post: PostSummary;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border-base-200 bg-base-100 dark:border-base-800 space-y-3 rounded-lg border p-4 transition hover:shadow-lg">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="group-hover:text-primary text-lg font-semibold">{post.title}</h3>
          <p className="text-base-content/60 line-clamp-2 text-sm">{post.description}</p>
        </div>

        {/* Metadata */}
        <div className="text-base-content/50 flex flex-wrap items-center gap-2 text-xs">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>{post.readTime}</span>
          {post.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="badge badge-sm">
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && <span className="badge badge-sm">+{post.tags.length - 2}</span>}
              </div>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
