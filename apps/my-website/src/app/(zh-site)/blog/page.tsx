import type { Metadata } from "next";

import { BlogFeature } from "@/features/blog";
import { getAllPosts, toPostSummary } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "技術筆記與想法分享",
  openGraph: {
    title: "Blog",
    description: "技術筆記與想法分享",
    type: "website",
    url: "https://henryleelab.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toPostSummary);

  return <BlogFeature posts={posts} />;
}
