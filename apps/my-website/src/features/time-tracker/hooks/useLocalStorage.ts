import { useEffect, useState } from "react";

import type { UseLocalStorageReturn } from "@/features/time-tracker/types";

/**
 * 通用的 localStorage hook
 * 處理資料的序列化、反序列化和錯誤處理
 */
export const useLocalStorage = <T>(key: string, defaultValue: T): UseLocalStorageReturn<T> => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("從 localStorage 讀取資料時發生錯誤:", error);
      return defaultValue;
    }
  });

  const [loading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // 同步到 localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
        // 使用 queueMicrotask 延遲 setState，避免同步調用
        if (error !== null) {
          queueMicrotask(() => setError(null));
        }
      }
    } catch (err) {
      const errorMessage = "儲存到 localStorage 失敗";
      console.error(errorMessage, err);
      // 使用 queueMicrotask 延遲 setState
      queueMicrotask(() => setError(errorMessage));
    }
  }, [key, value, error]);

  return {
    error,
    loading,
    setValue,
    value,
  };
};

export default useLocalStorage;
