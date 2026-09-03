import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AdjacentPost {
  slug: string;
  title: string;
}

interface PostNavigationProps {
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav aria-label="文章導覽" className="border-base-200 mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          className="group border-base-200 hover:border-primary/50 hover:bg-base-200/50 flex flex-col gap-1 rounded-lg border p-4 transition-colors"
          href={`/blog/${prev.slug}`}
        >
          <span className="text-base-content/50 group-hover:text-primary flex items-center gap-1 text-xs transition-colors">
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
            上一篇
          </span>
          <span className="line-clamp-2 text-sm font-medium">{prev.title}</span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {next ? (
        <Link
          className="group border-base-200 hover:border-primary/50 hover:bg-base-200/50 flex flex-col gap-1 rounded-lg border p-4 text-right transition-colors sm:items-end"
          href={`/blog/${next.slug}`}
        >
          <span className="text-base-content/50 group-hover:text-primary flex items-center gap-1 text-xs transition-colors">
            下一篇
            <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </span>
          <span className="line-clamp-2 text-sm font-medium">{next.title}</span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
