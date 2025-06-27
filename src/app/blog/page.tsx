"use client";

import { BlogHero } from "@/components/blog";
import ArticlesSection from "@/components/blog/ArticlesSection";
import { useMediumArticles } from "@/hooks/useMediumArticles";

const BlogPage = () => {
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
