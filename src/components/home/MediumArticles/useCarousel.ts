import { useState, useEffect } from 'react';

interface UseCarouselProps {
  items: any[];
  autoplayInterval?: number;
}

interface UseCarouselReturn {
  currentSlide: number;
  isPlaying: boolean;
  itemsPerSlide: number;
  totalSlides: number;
  setIsPlaying: (playing: boolean) => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  getCurrentSlideItems: () => any[];
}

export const useCarousel = ({ 
  items, 
  autoplayInterval = 4000 
}: UseCarouselProps): UseCarouselReturn => {
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
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
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
    isPlaying,
    itemsPerSlide,
    totalSlides,
    setIsPlaying,
    goToSlide,
    nextSlide,
    prevSlide,
    getCurrentSlideItems,
  };
}; 