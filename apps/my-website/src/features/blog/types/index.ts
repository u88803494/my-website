/**
 * Medium 文章 API 回應格式
 * @internal - 僅供 useMediumArticles hook 內部使用
 */
export interface MediumArticlesResponse {
  /** 下一頁的 cursor */
  nextCursor: null | string;
  /** 文章列表 */
  posts: MediumPost[];
}

/**
 * Medium 文章資料格式 (從 API 回傳)
 */
export interface MediumPost {
  collection?: {
    id?: string;
    name: string;
  };
  creator: {
    id?: string;
    name: string;
    username: string;
  };
  extendedPreviewContent?: {
    subtitle: string;
  };
  firstPublishedAt: number | string;
  id: string;
  mediumUrl: string;
  previewImage?: {
    id: string;
  };
  title: string;
}

/**
 * useMediumArticles 的選項
 * @internal - 僅供 useMediumArticles hook 內部使用
 */
export interface UseMediumArticlesOptions {
  /** 每頁文章數量，預設為 8，最大為 20 */
  limit?: number;
}
