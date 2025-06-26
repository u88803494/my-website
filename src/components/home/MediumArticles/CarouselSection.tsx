"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import React from "react";

import { Article } from "@/types/article.types";

import ArticleCard from "./ArticleCard";

interface CarouselSectionProps {
  articles: Article[];
  currentSlide: number;
  getCurrentSlideItems: () => Article[];
  goToSlide: (index: number) => void;
  isPlaying: boolean;
  itemsPerSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  setIsPlaying: (playing: boolean) => void;
  totalSlides: number;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({
  articles,
  currentSlide,
  getCurrentSlideItems,
  goToSlide,
  isPlaying,
  itemsPerSlide,
  nextSlide,
  prevSlide,
  setIsPlaying,
  totalSlides,
}) => {
  if (articles.length === 0) return null;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* 標題和控制 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-secondary h-2 w-2 rounded-full" />
          <h3 className="text-base-content text-xl font-semibold">更多文章</h3>
        </div>

        {/* 播放控制 */}
        {totalSlides > 1 && (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-circle btn-sm btn-ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "暫停" : "播放"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button className="btn btn-circle btn-sm btn-ghost" onClick={prevSlide} title="上一頁">
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button className="btn btn-circle btn-sm btn-ghost" onClick={nextSlide} title="下一頁">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 輪播內容 */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={`grid w-full gap-6 ${itemsPerSlide === 1 ? "grid-cols-1" : "md:grid-cols-2"}`}
            exit={{ opacity: 0, x: -50 }}
            initial={{ opacity: 0, x: 50 }}
            key={currentSlide}
            transition={{
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {getCurrentSlideItems().map((article, idx) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={article.title + currentSlide + idx}
                transition={{
                  delay: idx * 0.1,
                  duration: 0.4,
                }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 指示器 */}
      {totalSlides > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-8" : "bg-base-300 hover:bg-base-content/30"
              }`}
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* 進度條 */}
      {isPlaying && totalSlides > 1 && (
        <div className="bg-base-300 mt-4 h-1 w-full overflow-hidden rounded-full">
          <motion.div
            animate={{ width: "100%" }}
            className="bg-primary h-full"
            initial={{ width: "0%" }}
            key={currentSlide}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CarouselSection;
