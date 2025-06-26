"use client";

import { motion } from "framer-motion";
import React from "react";

import { SOCIAL_LINKS } from "@/constants/socialLinks";
import { articleList } from "@/data/articleData";
import { cn } from "@/utils/cn";

import CarouselSection from "./CarouselSection";
import FeaturedSection from "./FeaturedSection";
import SectionHeader from "./SectionHeader";
import { useCarousel } from "./useCarousel";

interface MediumArticlesProps {
  /** 背景樣式，預設為 'bg-base-200' */
  backgroundClass: string;
  /** section id，預設為 'medium-articles' */
  sectionId: string;
}

const MediumArticles: React.FC<MediumArticlesProps> = ({ backgroundClass, sectionId }) => {
  // 文章分組：最新兩篇固定，其餘輪播
  const featuredArticles = articleList.slice(0, 2);
  const carouselArticles = articleList.slice(2);

  // 使用輪播 hook
  const carousel = useCarousel({
    autoplayInterval: 4000,
    items: carouselArticles,
  });

  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="container mx-auto px-4">
        <SectionHeader />

        <FeaturedSection articles={featuredArticles} />

        <CarouselSection articles={carouselArticles} {...carousel} />

        {/* 前往 Medium 文章頁面 */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <motion.a
            className={cn("btn btn-primary btn-lg", "shadow-lg transition-all hover:shadow-xl")}
            href={SOCIAL_LINKS.MEDIUM}
            rel="noopener noreferrer"
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            前往我的 Medium 文章頁面
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default MediumArticles;
