import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/**
 * Server-side QueryClient factory using React's cache()
 *
 * This ensures that each request gets its own QueryClient instance
 * while maintaining singleton behavior within a single server render.
 *
 * Based on TanStack Query's official Server Components pattern:
 * https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */
export const getQueryClient = cache(() => new QueryClient());
