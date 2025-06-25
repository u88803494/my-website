"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { articleList } from "@/data/articleData";
import { useCarousel } from "./useCarousel";
import { SOCIAL_LINKS } from "@/constants/socialLinks";
import SectionHeader from "./SectionHeader";
import FeaturedSection from "./FeaturedSection";
import CarouselSection from "./CarouselSection";

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
    items: carouselArticles,
    autoplayInterval: 4000,
  });

  return (
    <section className={clsx("py-20", backgroundClass)} id={sectionId}>
      <div className="container mx-auto px-4">
        <SectionHeader />

        <FeaturedSection articles={featuredArticles} />

        <CarouselSection articles={carouselArticles} {...carousel} />

        {/* 前往 Medium 文章頁面 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.a
            href={SOCIAL_LINKS.MEDIUM}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx("btn btn-primary btn-lg", "shadow-lg hover:shadow-xl transition-all")}
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
