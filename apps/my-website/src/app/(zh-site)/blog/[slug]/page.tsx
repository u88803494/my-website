import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleJsonLd } from "@/components/shared/ArticleJsonLd";
import { getAllPosts, getPostBySlug } from "@/lib/content/posts";
import { MdxContent } from "@/lib/mdx/renderMdx";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Only slugs returned by generateStaticParams() are servable — any other
// slug (including draft posts, which are excluded above) 404s at the
// routing layer instead of falling through to request-time rendering.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const url = `https://henryleelab.com/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: new Date(post.date).toISOString(),
      ...(post.updatedDate && { modifiedTime: new Date(post.updatedDate).toISOString() }),
      ...(post.thumbnail && { images: [{ url: post.thumbnail }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.thumbnail && { images: [post.thumbnail] }),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd post={post} />
      <article className="prose prose-sm dark:prose-invert sm:prose-base lg:prose-lg mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="not-prose mb-8 space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <p className="text-base-content/60 text-lg">{post.description}</p>

          {/* Metadata */}
          <div className="text-base-content/50 flex flex-wrap gap-4 text-sm">
            <time dateTime={new Date(post.date).toISOString()}>
              {new Date(post.date).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="badge badge-outline">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <MdxContent code={post.code} />
      </article>
    </>
  );
}
