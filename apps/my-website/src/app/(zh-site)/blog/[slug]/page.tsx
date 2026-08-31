import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleTableOfContents } from "@/components/blog/ArticleTableOfContents";
import { CodeBlockCopyScript } from "@/components/blog/CodeBlockCopyScript";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { ArticleJsonLd } from "@/components/shared/ArticleJsonLd";
import { DEFAULT_OG_IMAGE_URL } from "@/components/shared/rootMetadata";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/content/posts";
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
  const ogImageUrl = post.thumbnail ?? DEFAULT_OG_IMAGE_URL;

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
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
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

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <>
      <ArticleJsonLd post={post} />
      <CodeBlockCopyScript />
      <div className="mx-auto max-w-6xl px-4 py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-12">
        <article
          className={[
            "prose prose-sm sm:prose-base lg:prose-lg mx-auto max-w-2xl lg:mx-0",
            // Drop Typography's default grayscale palette in favor of DaisyUI semantic
            // colors, so it follows the corporate theme
            "prose-headings:text-base-content prose-p:text-base-content/90 prose-strong:text-base-content",
            "prose-a:text-primary prose-code:text-base-content",
            // Slightly looser line height for Chinese than the default, to improve
            // long-form reading rhythm (line height only, no font change)
            "prose-p:leading-[1.75] prose-li:leading-[1.75]",
            // Scroll offset on headings so they don't land under the fixed navbar
            // (applies to both TOC jumps and #hash navigation)
            "prose-headings:scroll-mt-24",
            // Let rehype-pretty-code's <figure>/<pre> styling fully take over; step
            // aside from Typography's defaults
            "prose-pre:bg-transparent prose-pre:p-0 prose-pre:text-inherit",
          ].join(" ")}
          id="article-content"
        >
          {/* Header: deliberately kept quiet — no animation, no extra icons */}
          <div className="not-prose border-base-200 mb-8 space-y-4 border-b pb-6">
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

          <div className="not-prose">
            <PostNavigation next={next} prev={prev} />
          </div>
        </article>

        <ArticleTableOfContents />
      </div>
    </>
  );
}
