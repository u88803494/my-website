import { API_PATHS } from "@/lib/api-paths";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { MediumArticlesResponse, UseMediumArticlesOptions } from "../types";

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
