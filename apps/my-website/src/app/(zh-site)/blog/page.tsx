import { BlogFeature } from "@packages/blog";
import type { Metadata } from "next";

import { DEFAULT_OG_IMAGE_URL } from "@/components/shared/rootMetadata";
import { getAllPosts, toPostSummary } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "部落格 - Henry Lee",
  description: "軟體工程、AI 應用與職涯成長的觀察與紀錄",
  openGraph: {
    title: "部落格 - Henry Lee",
    description: "軟體工程、AI 應用與職涯成長的觀察與紀錄",
    type: "website",
    url: "https://henryleelab.com/blog",
    images: [{ url: DEFAULT_OG_IMAGE_URL, width: 512, height: 512, alt: "Henry Lee 頭像" }],
  },
  twitter: {
    card: "summary",
    title: "部落格 - Henry Lee",
    description: "軟體工程、AI 應用與職涯成長的觀察與紀錄",
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toPostSummary);

  return <BlogFeature posts={posts} />;
}
