import { BlogFeature } from "@packages/blog";
import { API_PATHS } from "@packages/shared";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = {
  description: "Henry Lee 的技術文章與開發心得分享",
  title: "技術部落格 - Henry Lee",
};

/**
 * Fetch Medium articles for prefetching
 */
async function fetchMediumArticles({
  limit = 9,
  pageParam,
}: {
  limit?: number;
  pageParam?: string;
} = {}) {
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
}

/**
 * Server Component: Blog Page with React Query Prefetching
 *
 * This page uses Server Component prefetching to improve performance:
 * 1. Prefetch data on the server using `prefetchInfiniteQuery`
 * 2. Dehydrate the state and pass it to the client
 * 3. Use `HydrationBoundary` to hydrate the client-side QueryClient
 *
 * Reference: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */
export default async function BlogPage() {
  const queryClient = getQueryClient();

  // Prefetch initial articles on the server
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["mediumArticles", 9],
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit: 9, pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    pages: 1, // Only prefetch the first page
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
