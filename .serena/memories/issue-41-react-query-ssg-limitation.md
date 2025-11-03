# Issue #41: React Query + React 19 SSG Limitation

## Problem

When upgrading to React 19.2.0, pages using React Query fail during SSG (Static Site Generation) build with the error:

```
Error: No QueryClient set, use QueryClientProvider to set one
```

## Root Cause

React 19's Server Components rendering behavior changed:

- During SSG build time, Next.js attempts to pre-render Client Components
- Client Components using React Query hooks (`useMutation`, `useInfiniteQuery`) need QueryClient context
- QueryClientProvider is only available at runtime, not at build time
- This causes the build to fail when trying to statically generate these pages

## Affected Pages

Three pages use React Query in Client Components:

1. `/ai-dictionary` - Uses `useMutation` for word analysis
2. `/ai-analyzer` - Uses `useMutation` for AI analysis
3. `/blog` - Uses `useInfiniteQuery` for infinite scrolling

## Solution

Added `export const dynamic = 'force-dynamic'` to these three pages:

- `apps/my-website/src/app/ai-dictionary/page.tsx`
- `apps/my-website/src/app/ai-analyzer/page.tsx`
- `apps/my-website/src/app/blog/page.tsx`

This forces Next.js to render these pages dynamically at runtime instead of at build time, avoiding the QueryClient context error.

## Trade-offs

**Pros:**

- ✅ Build succeeds
- ✅ All functionality works correctly
- ✅ Simple solution (no code refactoring needed)
- ✅ Uses latest React 19.2.0

**Cons:**

- ❌ These pages become Dynamic (ƒ) instead of Static (○)
- ❌ Slightly slower initial page load (server-rendered instead of pre-rendered)

## Notes

- This is a known limitation of React Query + React 19 + SSG
- The project was always on React 19 since initial commit (never used React 18)
- Alternative solutions would require significant refactoring to remove React Query or restructure components
- For future optimization, consider:
  - Using dynamic imports with `ssr: false` for Client Components
  - Restructuring to pure Server Components + Server Actions
  - This can be a separate issue if SSG optimization is needed

## Related Issues

- Issue #40: Blog SSG with React Query prefetching (still works with dynamic rendering)
- Issue #41: Dependencies upgrade (this issue)

## Date

2025-11-03
