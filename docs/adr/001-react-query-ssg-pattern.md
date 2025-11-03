# ADR 001: React Query SSG Pattern

## 狀態

✅ 已採用 (2025-11-03)

## 背景

在 Next.js 15 App Router 環境中使用 React Query 時，需要正確處理 Static Site Generation (SSG)。不同的使用情境需要採用不同的 pattern：

### 問題

1. React Query 5.81.2 在處理 Client Components 的 SSG 時有 bug
2. 不是所有頁面都需要 server-side prefetch
3. 需要明確的指引來決定何時使用 HydrationBoundary

### 影響範圍

- Blog 頁面（infinite query with prefetch）
- AI Dictionary 頁面（mutation only）
- AI Analyzer 頁面（mutation only）
- 未來所有使用 React Query 的頁面

## 決策

### 1. React Query 版本要求

**最低版本：5.84.1**

- 理由：修復 SSG 相容性 bug
- package.json：`"@tanstack/react-query": "^5.84.1"`
- 透過 pnpm-lock.yaml 鎖定確切版本

### 2. Server-side Prefetch Pattern

**使用情境：**

- GET requests 需要 SEO
- Infinite queries 需要初始資料
- 提升 FCP/LCP 性能

**實作方式：**

```typescript
// page.tsx (Server Component)
export default async function BlogPage() {
  const queryClient = getQueryClient();

  // Server-side prefetch
  await queryClient.prefetchInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    ...queryConfig,
    pages: 1,
  });

  // 使用 HydrationBoundary 傳遞 dehydrated state
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

### 3. Client-only Mutation Pattern

**使用情境：**

- POST/PUT/DELETE mutations
- 完全動態的頁面
- 不需要 SEO 的功能頁面

**實作方式：**

```typescript
// page.tsx (Server Component)
export default function AIDictionaryPage() {
  // 直接返回 Client Component，不需要 HydrationBoundary
  return <AIDictionaryFeature />;
}

// Feature.tsx (Client Component)
"use client";

export const AIDictionaryFeature = () => {
  const mutation = useMutation({...});  // Client-side only
  return <div>...</div>;
};
```

### 4. 'use client' 使用原則

**需要使用：**

- 組件直接使用 React hooks (useState, useEffect, etc.)
- 組件使用 React Query hooks (useMutation, useQuery, etc.)
- 組件使用瀏覽器 APIs (localStorage, window, etc.)

**不需要使用：**

- 純容器組件（子組件已有 'use client'）
- Server Component
- 只做 routing 或 layout 的組件

### 5. 不使用 force-dynamic

**決策：完全移除 `export const dynamic = 'force-dynamic'`**

- 理由：React Query 5.84.1 已修復 SSG bug
- 所有頁面都應該能正確生成為 Static (○)
- 只在真正需要 dynamic rendering 時才使用

## 後果

### 正面影響 ✅

1. 所有頁面正確生成為 Static，提升性能
2. Blog 頁面有 server-side prefetch，改善 SEO 和 FCP
3. Pattern 清楚，易於理解和維護
4. 避免 React Query SSG bug

### 負面影響 ⚠️

1. 需要維護兩種不同的 pattern
2. 開發者需要理解何時使用哪種 pattern
3. React Query 版本被鎖定在 5.84.1+

### 中性影響 ℹ️

1. 專案複雜度略微增加
2. 需要定期檢查 React Query 和 React 版本相容性

## 範例對照表

| 頁面             | Pattern         | HydrationBoundary | 理由                  |
| ---------------- | --------------- | ----------------- | --------------------- |
| `/blog`          | Server Prefetch | ✅ 需要           | Infinite query + SEO  |
| `/ai-dictionary` | Client Mutation | ❌ 不需要         | POST mutation only    |
| `/ai-analyzer`   | Client Mutation | ❌ 不需要         | POST mutation only    |
| `/` (homepage)   | Server Prefetch | ✅ 需要           | 如有 data fetch + SEO |

## 相關文件

- React Query SSR Guide: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
- Next.js App Router: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Issue #41: Dependencies Upgrade

## 變更歷史

- 2025-11-03: Initial version
- 相關 Commit: e3ef0a1, d39dd79
