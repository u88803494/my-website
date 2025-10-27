// 使用 shared package 的類型定義
export type { Article } from "@packages/shared/types";

// Script 專用的類型定義
export interface ArticleConfig {
  articles: string[];
}

export interface ParseStats {
  failed: number;
  success: number;
  total: number;
}
