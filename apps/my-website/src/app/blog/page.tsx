import { BlogFeature } from "@packages/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Henry Lee 的技術文章與開發心得分享",
  title: "技術部落格 - Henry Lee",
};

const BlogPage: React.FC = () => {
  return <BlogFeature />;
};

export default BlogPage;
