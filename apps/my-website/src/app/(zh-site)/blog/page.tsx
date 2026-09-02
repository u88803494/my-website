import { BlogFeature } from "@packages/blog";
import type { Metadata } from "next";

import { getAllPosts, toPostSummary } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "部落格 - Henry Lee",
  description: "軟體工程、AI 應用與職涯成長的觀察與紀錄",
  openGraph: {
    title: "部落格 - Henry Lee",
    description: "軟體工程、AI 應用與職涯成長的觀察與紀錄",
    type: "website",
    url: "https://henryleelab.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toPostSummary);

  return <BlogFeature posts={posts} />;
}
