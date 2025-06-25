"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/types/article.types";
import ArticleCard from "./ArticleCard";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface CarouselSectionProps {
  articles: Article[];
  currentSlide: number;
  isPlaying: boolean;
  itemsPerSlide: number;
  totalSlides: number;
  setIsPlaying: (playing: boolean) => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  getCurrentSlideItems: () => Article[];
}

const CarouselSection: React.FC<CarouselSectionProps> = ({
  articles,
  currentSlide,
  isPlaying,
  itemsPerSlide,
  totalSlides,
  setIsPlaying,
  goToSlide,
  nextSlide,
  prevSlide,
  getCurrentSlideItems,
}) => {
  if (articles.length === 0) return null;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* 標題和控制 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <h3 className="text-xl font-semibold text-base-content">更多文章</h3>
        </div>

        {/* 播放控制 */}
        {totalSlides > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn btn-circle btn-sm btn-ghost"
              title={isPlaying ? "暫停" : "播放"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button onClick={prevSlide} className="btn btn-circle btn-sm btn-ghost" title="上一頁">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button onClick={nextSlide} className="btn btn-circle btn-sm btn-ghost" title="下一頁">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 輪播內容 */}
      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={`grid gap-6 w-full ${itemsPerSlide === 1 ? "grid-cols-1" : "md:grid-cols-2"}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {getCurrentSlideItems().map((article, idx) => (
              <motion.div
                key={article.title + currentSlide + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.1,
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
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-8" : "bg-base-300 hover:bg-base-content/30"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* 進度條 */}
      {isPlaying && totalSlides > 1 && (
        <div className="mt-4 w-full bg-base-300 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
            key={currentSlide}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CarouselSection;
