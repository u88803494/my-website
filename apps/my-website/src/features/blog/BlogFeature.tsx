"use client";

import ArticlesSection from "./components/ArticlesSection";
import BlogHero from "./components/BlogHero";

const BlogFeature: React.FC = () => {
  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero Section */}
      <BlogHero />

      {/* Articles Section */}
      <ArticlesSection />
    </div>
  );
};

export default BlogFeature;
