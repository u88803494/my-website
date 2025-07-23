import { useEffect, useState } from "react";

import type { UseLocalStorageReturn } from "@/types/time-tracker.types";

/**
 * 通用的 localStorage hook
 * 處理資料的序列化、反序列化和錯誤處理
 */
export const useLocalStorage = <T>(key: string, defaultValue: T): UseLocalStorageReturn<T> => {
  const [value, setValue] = useState<T>(() => {
    // Initializer function to read from localStorage only on first render
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return defaultValue;
    }
  });

  // Effect to update localStorage when value changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, value]);

  const [loading, setLoading] = useState(true);
  const [error] = useState<null | string>(null);

  // 從 localStorage 讀取資料
  useEffect(() => {
    setLoading(false); // Simplified loading state
  }, []);

  return {
    error,
    loading,
    setValue,
    value,
  };
};

export default useLocalStorage;
