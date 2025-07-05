"use client";

import { useMediumArticles } from "@/hooks/useMediumArticles";

import ArticlesSection from "./ArticlesSection";
import BlogHero from "./BlogHero";

const BlogPage: React.FC = () => {
  // 使用自定義 hook 獲取文章資料
  const mediumArticlesQuery = useMediumArticles({ limit: 9 });

  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero Section */}
      <BlogHero />

      {/* Articles Section */}
      <ArticlesSection {...mediumArticlesQuery} />
    </div>
  );
};

export default BlogPage;
