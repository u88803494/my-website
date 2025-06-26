/**
 * 集中管理所有 API 路徑
 */
export const API_PATHS = {
  /** Medium 文章相關 API */
  MEDIUM_ARTICLES: "/api/medium-articles",
} as const;

/**
 * API 路徑的型別定義
 */
export type ApiPath = (typeof API_PATHS)[keyof typeof API_PATHS];
