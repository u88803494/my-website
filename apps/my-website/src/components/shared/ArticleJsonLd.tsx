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
      // Must match the canonical URL from generateMetadata exactly. A raw CJK
      // slug here would disagree with the percent-encoded canonical, showing
      // Google two different URLs for the same page.
      "@id": `https://henryleelab.com/blog/${encodeURIComponent(post.slug)}`,
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
