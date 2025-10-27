import { type Article } from "@packages/shared/types";

/**
 * useCarousel hook 的選項
 */
export interface UseCarouselProps {
  autoplayInterval?: number;
  items: Article[];
}

/**
 * useCarousel hook 的回傳值
 */
export interface UseCarouselReturn {
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
