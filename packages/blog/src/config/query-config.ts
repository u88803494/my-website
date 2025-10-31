import type { MediumArticlesResponse } from "../types";
import { ARTICLES_CACHE_TIME, ARTICLES_STALE_TIME } from "../constants";

/**
 * Query key factory for medium articles
 */
export const mediumArticlesKeys = {
  all: ["mediumArticles"] as const,
  list: (limit: number) => [...mediumArticlesKeys.all, limit] as const,
};

/**
 * Get next page parameter from last page response
 */
export function getNextPageParam(lastPage: MediumArticlesResponse): string | undefined {
  return lastPage.nextCursor ?? undefined;
}

/**
 * Shared query configuration for medium articles
 */
export const mediumArticlesQueryConfig = {
  gcTime: ARTICLES_CACHE_TIME,
  staleTime: ARTICLES_STALE_TIME,
  getNextPageParam,
  initialPageParam: undefined as string | undefined,
} as const;
