import { getPostUrl } from "@/lib/content/posts";
import { formatDateISO8601 } from "@/lib/date-formatting";
import type { Post } from "#site/content";

import { DEFAULT_OG_IMAGE_URL } from "./rootMetadata";

interface ArticleJsonLdProps {
  post: Post;
}

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.thumbnail ?? DEFAULT_OG_IMAGE_URL,
    datePublished: formatDateISO8601(post.date),
    dateModified: formatDateISO8601(post.updatedDate ?? post.date),
    author: {
      "@type": "Person",
      name: "Henry Lee",
      url: "https://henryleelab.com",
      image: "https://henryleelab.com/images/my-photo.jpeg",
    },
    publisher: {
      "@type": "Organization",
      name: "Henry Lee Lab",
      url: "https://henryleelab.com",
      logo: {
        "@type": "ImageObject",
        url: "https://henryleelab.com/images/my-photo.jpeg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      // Must match the canonical URL from generateMetadata exactly, or Google
      // sees two different URLs for the same page — getPostUrl() is the single
      // source both go through.
      "@id": getPostUrl(post),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}
