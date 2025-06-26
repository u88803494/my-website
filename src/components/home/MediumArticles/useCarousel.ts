import { useEffect, useState } from "react";

import { Article } from "@/types/article.types";

interface UseCarouselProps {
  autoplayInterval?: number;
  items: Article[];
}

interface UseCarouselReturn {
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

export const useCarousel = ({ autoplayInterval = 4000, items }: UseCarouselProps): UseCarouselReturn => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);

  // 計算總頁數
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  // 響應式設定
  useEffect(() => {
    const updateItemsPerSlide = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 2);
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // 自動播放
  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, totalSlides, autoplayInterval]);

  // 手動控制函數
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 獲取當前顯示的項目
  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    return items.slice(startIndex, endIndex);
  };

  return {
    currentSlide,
    getCurrentSlideItems,
    goToSlide,
    isPlaying,
    itemsPerSlide,
    nextSlide,
    prevSlide,
    setIsPlaying,
    totalSlides,
  };
};
