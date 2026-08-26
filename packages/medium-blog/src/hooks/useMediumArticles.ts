import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchMediumArticles } from "../api/medium-articles";
import { mediumArticlesKeys, mediumArticlesQueryConfig } from "../config/query-config";
import { DEFAULT_ARTICLES_LIMIT } from "../constants";
import type { UseMediumArticlesOptions } from "../types";

/**
 * React Query hook for fetching Medium articles with infinite scroll
 *
 * @param options - Query options including custom limit
 * @returns Infinite query result with Medium articles
 */
export const useMediumArticles = (options: UseMediumArticlesOptions = {}) => {
  const { limit = DEFAULT_ARTICLES_LIMIT } = options;

  return useInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    ...mediumArticlesQueryConfig,
  });
};
