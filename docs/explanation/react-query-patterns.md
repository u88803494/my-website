---
title: React Query Patterns with Next.js SSG（React Query 與 Next.js SSG 的模式）
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
  解釋整合 React Query 與 Next.js SSG 的策略，
  涵蓋兩種模式：用於 SEO 的 server prefetch 和用於 mutations 的 client-only。
---

# React Query Patterns with Next.js SSG（React Query 與 Next.js SSG 的模式）

## 概述

本專案使用 **React Query**（TanStack Query）進行客戶端資料管理，並搭配 **Next.js SSG**（Static Site Generation）。

**挑戰**：React Query 是客戶端的，Next.js SSG 是伺服器端的。它們如何協同工作？

**解決方案**：基於 SEO 需求的兩種模式。

---

## 為什麼使用 React Query？

### 沒有 React Query 的問題

傳統的 Next.js 資料獲取：

```typescript
// ❌ 沒有 React Query
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

**問題**：

- 手動管理 loading/error 狀態
- 沒有快取（每次 mount 都重新獲取）
- 沒有背景更新
- 沒有 pagination/infinite scroll 支援
- 每個元件都需要樣板程式碼

### 使用 React Query 的解決方案

```typescript
// ✅ 使用 React Query
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

**優勢**：

- ✅ 自動快取和去重
- ✅ 背景重新獲取
- ✅ Stale-while-revalidate 策略
- ✅ 內建 pagination/infinite scroll
- ✅ 最少的樣板程式碼

---

## Pattern 1：Server Prefetch（有 SEO 需求）

**使用時機**：需要 SEO 優化的 GET requests。

**範例**：部落格文章列表頁面。

### Server Component（page.tsx）

```typescript
// apps/my-website/src/app/blog/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export default async function BlogPage() {
  const queryClient = getQueryClient();

  // 在伺服器上預取資料
  await queryClient.prefetchInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    pages: 1,
  });

  // 將脫水狀態傳遞給客戶端
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

### Client Component（BlogFeature.tsx）

```typescript
// apps/my-website/src/features/blog/BlogFeature.tsx
"use client";

export const BlogFeature: React.FC = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    ...mediumArticlesQueryConfig,
  });

  // 資料已經從 server prefetch 中獲得！
  return <ArticleList data={data} loadMore={fetchNextPage} />;
};
```

### 運作原理

1. **Server（建置時）**：
   - Next.js 將 `page.tsx` 作為 Server Component 執行
   - `prefetchInfiniteQuery` 在伺服器上獲取資料
   - `dehydrate(queryClient)` 將快取序列化為 JSON
   - 生成嵌入資料的 HTML

2. **Client（執行時）**：
   - 瀏覽器接收帶有資料的 HTML
   - React Query 從脫水狀態中 hydrate
   - 沒有 loading 狀態的閃爍
   - 進一步的互動使用 React Query 快取

### 優勢

- ✅ **SEO**：爬蟲看到完整的 HTML 內容
- ✅ **效能**：沒有客戶端的 loading spinner
- ✅ **UX**：首次載入時立即顯示內容
- ✅ **互動性**：hydration 後的客戶端更新

---

## Pattern 2：Client-Only（無 SEO 需求）

**使用時機**：POST/PUT/DELETE mutations 或沒有 SEO 需求的頁面。

**範例**：AI Dictionary（基於 mutation，沒有 SEO 價值）。

### Server Component（page.tsx）

```typescript
// apps/my-website/src/app/ai-dictionary/page.tsx
export default function AIDictionaryPage() {
  // 只渲染 client component
  return <AIDictionaryFeature />;
}
```

### Client Component（AIDictionaryFeature.tsx）

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

### 優勢

- ✅ **簡單性**：不需要 server prefetch
- ✅ **Mutations**：POST/PUT/DELETE 自然運作
- ✅ **快取控制**：React Query 處理所有事情

---

## 決策流程

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

## 核心概念

### Query Keys

**目的**：快取條目的唯一識別符。

```typescript
// ✅ 好：階層式 query keys
const mediumArticlesKeys = {
  all: ["medium-articles"] as const,
  lists: () => [...mediumArticlesKeys.all, "list"] as const,
  list: (limit: number) => [...mediumArticlesKeys.lists(), { limit }] as const,
};

// 在 queries 中使用
useInfiniteQuery({
  queryKey: mediumArticlesKeys.list(10),
  // ...
});
```

**優勢**：

- Type-safe query keys
- 易於快取失效
- 階層式組織

### Query Configuration

```typescript
// apps/my-website/src/lib/query-config.ts
export const mediumArticlesQueryConfig = {
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) =>
    lastPage.hasMore ? lastPageParam + lastPage.data.length : undefined,
  staleTime: 1000 * 60 * 5, // 5 分鐘
  gcTime: 1000 * 60 * 30, // 30 分鐘
};
```

**關鍵選項**：

- `staleTime`：資料被認為是新鮮的時間
- `gcTime`：未使用的資料保留在快取中的時間
- `initialPageParam`：infinite queries 的起始參數
- `getNextPageParam`：決定下一頁的邏輯

---

## 常見模式

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

// 渲染
<InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
  {data.pages.map((page) => page.data.map((item) => <Item key={item.id} />))}
</InfiniteScroll>;
```

### Mutations with Optimistic Updates

```typescript
const { mutate } = useMutation({
  mutationFn: updateArticle,
  onMutate: async (newData) => {
    // 取消進行中的 refetches
    await queryClient.cancelQueries({ queryKey: ["articles"] });

    // 快照當前值
    const previous = queryClient.getQueryData(["articles"]);

    // 樂觀更新快取
    queryClient.setQueryData(["articles"], (old) => [...old, newData]);

    return { previous };
  },
  onError: (err, newData, context) => {
    // 錯誤時回滾
    queryClient.setQueryData(["articles"], context.previous);
  },
  onSettled: () => {
    // mutation 後重新獲取
    queryClient.invalidateQueries({ queryKey: ["articles"] });
  },
});
```

---

## 重要版本說明

**⚠️ React Query 5.84.1+ 必需**

較早的版本有 SSG 相容性問題：

```json
// package.json
{
  "dependencies": {
    "@tanstack/react-query": "^5.84.1"
  }
}
```

**修復的 bug**：Server prefetch + HydrationBoundary 現在可以正確與 SSG 協作。

**不要使用**：`force-dynamic` 或頁面層級的 `'use client'`（5.84.1+ 不需要）。

---

## 考慮過的替代方案

### 1. SWR

**優點**：更簡單的 API，更輕量

**缺點**：較少功能（沒有 infinite scroll，較弱的 mutations）

**為什麼不選擇**：React Query 對複雜用例更強大。

### 2. Apollo Client

**優點**：完整的 GraphQL 解決方案

**缺點**：對 REST APIs 來說過度複雜，bundle 更重

**為什麼不選擇**：本專案沒有 GraphQL。

### 3. Plain fetch + useEffect

**優點**：沒有依賴

**缺點**：手動快取管理，大量樣板程式碼

**為什麼不選擇**：React Query 提供的價值太大。

---

## 權衡取捨

### 我們獲得的

- ✅ 強大的快取和失效機制
- ✅ 內建 loading/error 狀態
- ✅ 樂觀更新
- ✅ 背景重新獲取

### 我們接受的

- ⚠️ Bundle 大小（+13KB gzipped）
- ⚠️ 學習曲線（query keys、config 選項）
- ⚠️ Server/client 分離（Pattern 1 需要仔細設定）

---

## 最佳實踐

### ✅ 應該做的

1. 一致地使用 **query keys**
2. 適當配置 `staleTime` 和 `gcTime`
3. 明確處理 loading/error 狀態
4. 對 SEO 關鍵頁面使用 Pattern 1

### ❌ 不應該做的

1. 不要在頁面層級使用 `'use client'`
2. 不要跳過 server prefetch 的 `HydrationBoundary`
3. 不要忘記 infinite queries 的 `initialPageParam`
4. 不要對 mutations 使用 Pattern 1

---

## 相關文件

- [ADR 001: React Query SSG Pattern](../adr/001-react-query-ssg-pattern.md) - 決策記錄
- [Architecture Reference](../reference/architecture.md) - 完整架構
- [Feature-Based Architecture](./feature-based-architecture.md) - 程式碼組織

---

## 延伸閱讀

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server/Client Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
