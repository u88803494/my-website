---
title: React Query Patterns with Next.js SSG
type: explanation
status: stable
audience: [developer, ai]
tags: [react-query, nextjs, ssg, data-fetching, hydration]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/architecture.md
  - adr/001-react-query-ssg-pattern.md
  - explanation/feature-based-architecture.md
ai_context: |
  Explains the strategy for integrating React Query with Next.js SSG, covering
  two patterns: server prefetch for SEO and client-only for mutations.
---

# React Query Patterns with Next.js SSG

## Overview

This project uses **React Query** (TanStack Query) for client-side data management with **Next.js SSG** (Static Site Generation).

**Challenge**: React Query is client-side, Next.js SSG is server-side. How do they work together?

**Solution**: Two patterns based on SEO needs.

---

## Why React Query?

### Problems Without React Query

Traditional Next.js data fetching:

```typescript
// ❌ Without React Query
export default function BlogPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

**Problems:**

- Manual loading/error state management
- No caching (refetch on every mount)
- No background updates
- No pagination/infinite scroll support
- Boilerplate code in every component

### Solution With React Query

```typescript
// ✅ With React Query
export default function BlogPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  return <ArticleList data={data} />;
}
```

**Benefits:**

- ✅ Automatic caching and deduplication
- ✅ Background refetching
- ✅ Stale-while-revalidate strategy
- ✅ Built-in pagination/infinite scroll
- ✅ Minimal boilerplate

---

## Pattern 1: Server Prefetch (With SEO)

**Use when**: GET requests that need SEO optimization.

**Example**: Blog article listing page.

### Server Component (page.tsx)

```typescript
// apps/my-website/src/app/blog/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export default async function BlogPage() {
  const queryClient = getQueryClient();

  // Prefetch data on server
  await queryClient.prefetchInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    pages: 1,
  });

  // Pass dehydrated state to client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

### Client Component (BlogFeature.tsx)

```typescript
// apps/my-website/src/features/blog/BlogFeature.tsx
"use client";

export const BlogFeature: React.FC = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    ...mediumArticlesQueryConfig,
  });

  // Data is already available from server prefetch!
  return <ArticleList data={data} loadMore={fetchNextPage} />;
};
```

### How It Works

1. **Server (Build Time)**:
   - Next.js runs `page.tsx` as Server Component
   - `prefetchInfiniteQuery` fetches data on server
   - `dehydrate(queryClient)` serializes cache to JSON
   - HTML is generated with data embedded

2. **Client (Runtime)**:
   - Browser receives HTML with data
   - React Query hydrates from dehydrated state
   - No flash of loading state
   - Further interactions use React Query cache

### Benefits

- ✅ **SEO**: Bots see full HTML with content
- ✅ **Performance**: No client-side loading spinner
- ✅ **UX**: Instant content on first load
- ✅ **Interactivity**: Client-side updates after hydration

---

## Pattern 2: Client-Only (No SEO)

**Use when**: POST/PUT/DELETE mutations or pages without SEO needs.

**Example**: AI Dictionary (mutation-based, no SEO value).

### Server Component (page.tsx)

```typescript
// apps/my-website/src/app/ai-dictionary/page.tsx
export default function AIDictionaryPage() {
  // Just render the client component
  return <AIDictionaryFeature />;
}
```

### Client Component (AIDictionaryFeature.tsx)

```typescript
// apps/my-website/src/features/ai-dictionary/AIDictionaryFeature.tsx
"use client";

export const AIDictionaryFeature: React.FC = () => {
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: (word: string) => analyzeWord(word),
  });

  return (
    <form onSubmit={(e) => mutate(formData)}>
      {isPending && <LoadingState />}
      {error && <ErrorState />}
      {data && <ResultDisplay data={data} />}
    </form>
  );
};
```

### Benefits

- ✅ **Simplicity**: No server prefetch needed
- ✅ **Mutations**: POST/PUT/DELETE work naturally
- ✅ **Cache control**: React Query handles everything

---

## Decision Flow

```
需要 React Query？
  ├─ 是 → 是 GET request？
  │      ├─ 是 → 需要 SEO？
  │      │      ├─ 是 → ✅ Pattern 1 (Server Prefetch)
  │      │      └─ 否 → ❌ Pattern 2 (Client-only)
  │      └─ 否 (POST/PUT/DELETE) → ❌ Pattern 2 (Client-only)
  └─ 否 → 一般 Server Component
```

---

## Key Concepts

### Query Keys

**Purpose**: Unique identifier for cache entries.

```typescript
// ✅ Good: Hierarchical query keys
const mediumArticlesKeys = {
  all: ["medium-articles"] as const,
  lists: () => [...mediumArticlesKeys.all, "list"] as const,
  list: (limit: number) => [...mediumArticlesKeys.lists(), { limit }] as const,
};

// Use in queries
useInfiniteQuery({
  queryKey: mediumArticlesKeys.list(10),
  // ...
});
```

**Benefits:**

- Type-safe query keys
- Easy cache invalidation
- Hierarchical organization

### Query Configuration

```typescript
// apps/my-website/src/lib/query-config.ts
export const mediumArticlesQueryConfig = {
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) =>
    lastPage.hasMore ? lastPageParam + lastPage.data.length : undefined,
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes
};
```

**Key options:**

- `staleTime`: How long data is considered fresh
- `gcTime`: How long unused data stays in cache
- `initialPageParam`: Starting parameter for infinite queries
- `getNextPageParam`: Logic for determining next page

---

## Common Patterns

### Infinite Scroll

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: ({ pageParam = 0 }) => fetchArticles(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

// Render
<InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
  {data.pages.map((page) => page.data.map((item) => <Item key={item.id} />))}
</InfiniteScroll>;
```

### Mutations with Optimistic Updates

```typescript
const { mutate } = useMutation({
  mutationFn: updateArticle,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["articles"] });

    // Snapshot current value
    const previous = queryClient.getQueryData(["articles"]);

    // Optimistically update cache
    queryClient.setQueryData(["articles"], (old) => [...old, newData]);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(["articles"], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ["articles"] });
  },
});
```

---

## Important Version Note

**⚠️ React Query 5.84.1+ Required**

Earlier versions had SSG compatibility issues:

```json
// package.json
{
  "dependencies": {
    "@tanstack/react-query": "^5.84.1"
  }
}
```

**Bug fixed**: Server prefetch + HydrationBoundary now works correctly with SSG.

**Do NOT use**: `force-dynamic` or `'use client'` on page level (not needed with 5.84.1+).

---

## Alternatives Considered

### 1. SWR

**Pros**: Simpler API, lighter weight

**Cons**: Less features (no infinite scroll, weaker mutations)

**Why not chosen**: React Query more powerful for complex use cases.

### 2. Apollo Client

**Pros**: Full GraphQL solution

**Cons**: Overkill for REST APIs, heavier bundle

**Why not chosen**: No GraphQL in this project.

### 3. Plain fetch + useEffect

**Pros**: No dependencies

**Cons**: Manual cache management, lots of boilerplate

**Why not chosen**: React Query provides too much value.

---

## Trade-offs

### What We Gain

- ✅ Powerful caching and invalidation
- ✅ Built-in loading/error states
- ✅ Optimistic updates
- ✅ Background refetching

### What We Accept

- ⚠️ Bundle size (+13KB gzipped)
- ⚠️ Learning curve (query keys, config options)
- ⚠️ Server/client split (Pattern 1 requires careful setup)

---

## Best Practices

### ✅ Do

1. Use **query keys** consistently
2. Configure `staleTime` and `gcTime` appropriately
3. Handle loading/error states explicitly
4. Use Pattern 1 for SEO-critical pages

### ❌ Don't

1. Don't use `'use client'` on page level
2. Don't skip `HydrationBoundary` for server prefetch
3. Don't forget `initialPageParam` for infinite queries
4. Don't use Pattern 1 for mutations

---

## Related Documentation

- [ADR 001: React Query SSG Pattern](../adr/001-react-query-ssg-pattern.md) - Decision record
- [Architecture Reference](../reference/architecture.md) - Complete architecture
- [Feature-Based Architecture](./feature-based-architecture.md) - Code organization

---

## Further Reading

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server/Client Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
