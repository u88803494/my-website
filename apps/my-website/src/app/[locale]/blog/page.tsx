import {
  BlogFeature,
  DEFAULT_ARTICLES_LIMIT,
  fetchMediumArticles,
  mediumArticlesKeys,
  mediumArticlesQueryConfig,
} from "@packages/blog";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import { getQueryClient } from "@/lib/query-client";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Blog Page (Server Component with React Query Prefetching)
 *
 * ✅ 使用 HydrationBoundary + Server-side Prefetch
 * 理由：
 * 1. Blog 頁面需要 SEO 優化（搜尋引擎索引文章列表）
 * 2. Infinite query 需要初始資料以提升 FCP/LCP 性能
 * 3. Server-side prefetch 減少 client-side loading 時間
 *
 * 流程：
 * 1. Server-side prefetch data using `prefetchInfiniteQuery`
 * 2. Dehydrate the QueryClient state
 * 3. Pass dehydrated state to client via `HydrationBoundary`
 * 4. Client-side QueryClient hydrates with server data
 *
 * TEMPORARY: Using dynamic rendering due to React 19.2.3 SSG compatibility issue
 * TODO: Remove after React Query + React 19.2.3 SSG issue is resolved
 *
 * Reference: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */
export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

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
