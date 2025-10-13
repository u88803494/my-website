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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  // 同步到 localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
        setError(null);
      }
    } catch (err) {
      const errorMessage = "儲存到 localStorage 失敗";
      console.error(errorMessage, err);
      setError(errorMessage);
    }
  }, [key, value]);

  // 初始化完成後設定 loading 為 false
  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    error,
    loading,
    setValue,
    value,
  };
};

export default useLocalStorage;
