import { AIAnalyzerFeature } from "@packages/ai-analyzer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type Metadata } from "next";

import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = {
  description: "想不到怎麼下提示詞嗎？用用這個工具，或許你可以釐清你的需求。",
  title: "AI Prompt 生成器 | Henry Lee",
};

// Force dynamic rendering due to React Query usage in Client Components
export const dynamic = "force-dynamic";

/**
 * Server Component: AI Analyzer Page with React Query Hydration
 *
 * This page uses HydrationBoundary to enable React Query mutations
 * without causing SSG errors. No data prefetching is needed since
 * the feature uses mutations (not queries).
 */
export default function AIAnalyzerPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AIAnalyzerFeature />
    </HydrationBoundary>
  );
}
