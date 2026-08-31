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
 * Returns all non-draft posts, sorted by date descending.
 */
export function getAllPosts(): Post[] {
  return (allPostsData as Post[])
    .filter((post) => process.env.NODE_ENV === "development" || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Returns a single post by slug.
 */
export function getPostBySlug(slug: string): Post | undefined {
  return (allPostsData as Post[]).find(
    (post) => post.slug === slug && (process.env.NODE_ENV === "development" || !post.draft),
  );
}

/**
 * Returns the previous (earlier) and next (later) post relative to the given slug.
 * getAllPosts() sorts newest-to-oldest, so "prev" has a larger array index and
 * "next" has a smaller one.
 */
export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

/**
 * Converts a post into the trimmed-down shape the UI needs.
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
