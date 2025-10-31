import { API_PATHS } from "@packages/shared";

import type { MediumArticlesResponse } from "../types";
import { DEFAULT_ARTICLES_LIMIT } from "../constants";

export interface FetchMediumArticlesParams {
  limit?: number;
  pageParam?: string;
}

/**
 * Fetch Medium articles from API
 * Shared function used by both Server Components and Client hooks
 */
export async function fetchMediumArticles({
  limit = DEFAULT_ARTICLES_LIMIT,
  pageParam,
}: FetchMediumArticlesParams = {}): Promise<MediumArticlesResponse> {
  const params = new URLSearchParams();

  if (pageParam) {
    params.append("cursor", pageParam);
  }

  // Only add limit param if it's different from default (8 is API default)
  if (limit !== 8) {
    params.append("limit", limit.toString());
  }

  const url = `${API_PATHS.MEDIUM_ARTICLES}${params.toString() ? "?" + params.toString() : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Medium articles: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
