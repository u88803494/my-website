import { useInfiniteQuery } from "@tanstack/react-query";

import { API_PATHS } from "@/lib/api-paths";
import { Article } from "@/types/article.types";

/**
 * Medium 文章 API 回應格式
 */
interface MediumArticlesResponse {
  /** 下一頁的 cursor */
  nextCursor: null | string;
  /** 文章列表 */
  posts: Article[];
}

/**
 * 獲取 Medium 文章的 API 函式
 */
const fetchMediumArticles = async ({
  limit = 8,
  pageParam,
}: {
  limit?: number;
  pageParam?: string;
}): Promise<MediumArticlesResponse> => {
  const params = new URLSearchParams();

  if (pageParam) {
    params.append("cursor", pageParam);
  }

  if (limit !== 8) {
    params.append("limit", limit.toString());
  }

  const url = `${API_PATHS.MEDIUM_ARTICLES}${params.toString() ? "?" + params.toString() : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Medium articles: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * useMediumArticles 的選項
 */
interface UseMediumArticlesOptions {
  /** 每頁文章數量，預設為 8，最大為 20 */
  limit?: number;
}

/**
 * 使用 React Query 的無限查詢來獲取 Medium 文章
 */
export const useMediumArticles = (options: UseMediumArticlesOptions = {}) => {
  const { limit = 8 } = options;

  return useInfiniteQuery({
    gcTime: 30 * 60 * 1000, // 30 分鐘
    getNextPageParam: (lastPage: MediumArticlesResponse) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    queryKey: ["mediumArticles", limit],
    staleTime: 5 * 60 * 1000, // 5 分鐘
  });
};
