import { AIDictionaryFeature } from "@packages/ai-dictionary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = {
  description: "運用人工智慧技術，讓中文詞彙含義與字源更容易理解",
  title: "AI 智能中文字典 - Henry Lee",
};

// Force dynamic rendering due to React Query usage in Client Components
export const dynamic = 'force-dynamic';

/**
 * Server Component: AI Dictionary Page with React Query Hydration
 *
 * This page uses HydrationBoundary to enable React Query mutations
 * without causing SSG errors. No data prefetching is needed since
 * the feature uses mutations (not queries).
 */
export default function AIDictionaryPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AIDictionaryFeature />
    </HydrationBoundary>
  );
}
