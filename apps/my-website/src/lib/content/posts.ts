import type { Post } from "#site/content";
import { posts as allPostsData } from "#site/content";

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  tags: string[];
  readTime: string;
  thumbnail?: string;
  mediumUrl?: string;
}

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
 */
export function getPostBySlug(slug: string): Post | undefined {
  return (allPostsData as Post[]).find((post) => post.slug === slug);
}

/**
 * 轉換為 UI 所需的精簡格式
 */
export function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: new Date(post.date).toISOString().split("T")[0],
    updatedDate: post.updatedDate ? new Date(post.updatedDate).toISOString().split("T")[0] : undefined,
    tags: post.tags,
    readTime: post.readTime,
    thumbnail: post.thumbnail,
    mediumUrl: post.mediumUrl,
  };
}
