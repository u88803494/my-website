import {
  BlogFeature,
  DEFAULT_ARTICLES_LIMIT,
  fetchMediumArticles,
  mediumArticlesKeys,
  mediumArticlesQueryConfig,
} from "@packages/blog";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = {
  description: "Henry Lee 的技術文章與開發心得分享",
  title: "技術部落格 - Henry Lee",
};

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
    queryKey: mediumArticlesKeys.list(DEFAULT_ARTICLES_LIMIT),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit: DEFAULT_ARTICLES_LIMIT, pageParam }),
    ...mediumArticlesQueryConfig,
    pages: 1, // Only prefetch the first page
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
