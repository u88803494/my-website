import Link from "next/link";

import type { PostSummary } from "../types";

const MAX_VISIBLE_TAGS = 3;

interface ArticleCardProps {
  post: PostSummary;
}

// A server component with no entrance animation: the list renders 200+ cards,
// and an initial opacity:0 left the whole page blank until hydration finished
// (and permanently blank without JS).
export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("zh-TW", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const visibleTags = post.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = post.tags.length - visibleTags.length;

  return (
    <article className="border-base-300 group relative border-b py-8 first:pt-0 last:border-b-0">
      <time className="text-base-content/50 text-xs" dateTime={post.date}>
        {formattedDate}
      </time>

      {/* The entire list item is clickable (stretched link); an internal nav link
          doesn't need an extra "Read article" button */}
      <h3 className="group-hover:text-primary mt-2 text-xl font-bold transition-colors sm:text-2xl">
        {/* Encoded so a CJK slug matches the canonical URL and JSON-LD @id
            elsewhere on the site (see getPostPath() in apps/my-website) —
            this package deliberately doesn't import that, so it stays decoupled
            from Velite (see README), but the encoding itself must stay in sync. */}
        <Link className="after:absolute after:inset-0" href={`/blog/${encodeURIComponent(post.slug)}`}>
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
    </article>
  );
}
