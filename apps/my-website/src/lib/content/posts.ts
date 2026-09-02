// Value import uses the "@velite/*" tsconfig path alias (not the
// "#site/content" subpath import) because Turbopack (Next.js 16.1.1) fails
// to resolve package.json "imports" field entries at runtime, silently
// producing `undefined` for the module. "@velite/*" avoids the "#"-prefixed
// specifier entirely, going through the same resolver-alias mechanism that
// "@/*" already uses successfully elsewhere in this app. The type-only
// import above is erased at compile time and unaffected either way.
import type { PostSummary } from "@packages/blog/types";
import { posts as allPostsData } from "@velite/index.js";

import type { Post } from "#site/content";

/**
 * 取得所有非草稿文章，按日期遞減排序
 */
export function getAllPosts(): Post[] {
  return (allPostsData as Post[])
    .filter((post) => process.env.NODE_ENV === "development" || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 根據 slug 取得單篇文章
 *
 * slug 含中文時，Next.js 從路由傳進來的 params.slug 是 percent-encoded
 * （例如 "%E7%AC%AC%E4%B8%80..."），但 Velite 存的是原始中文，直接比對會找不到。
 * 這裡統一解碼，純 ASCII slug 解碼後不變，不受影響。
 */
export function getPostBySlug(slug: string): Post | undefined {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // 格式錯誤的 percent-encoding（例如單獨的 "%"）：沿用原字串，讓它走 404
  }

  return (allPostsData as Post[]).find(
    (post) => post.slug === decoded && (process.env.NODE_ENV === "development" || !post.draft),
  );
}

/**
 * 轉換為 UI 所需的精簡格式
 */
export function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: new Date(post.date).toISOString().slice(0, 10),
    updatedDate: post.updatedDate ? new Date(post.updatedDate).toISOString().slice(0, 10) : undefined,
    tags: post.tags,
    readTime: post.readTime,
    thumbnail: post.thumbnail,
    mediumUrl: post.mediumUrl,
  };
}
