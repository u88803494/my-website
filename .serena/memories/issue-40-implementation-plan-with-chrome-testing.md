# Issue #40: React Query Prefetching Pattern 實作計畫（含 Chrome DevTools 測試）

## 📋 環境準備狀態

- ✅ Dev server 已啟動: http://localhost:3001
- ✅ Chrome DevTools MCP 已連接
- ✅ React Query: 5.90.5
- ✅ Next.js: 15.4.7
- ✅ React: 19.2.0

## 🎯 完整實作計畫

### Phase 1: 建立 Server-side QueryClient

**建立檔案**: `apps/my-website/src/lib/query-client.ts`

```typescript
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 分鐘（與現有 QueryProvider 一致）
          gcTime: 30 * 60 * 1000, // 30 分鐘
        },
      },
    }),
);
```

**Chrome DevTools 測試**:

- Console: 確認無錯誤
- 現有功能不受影響

---

### Phase 2: 重構 Blog 頁面

**目標**: 將 `/blog` 從 force-dynamic 改為 SSG + prefetching

**步驟 2.1: 修改 `app/blog/page.tsx`**

```typescript
// ✅ 新版本 (Server Component with prefetching)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BlogFeature } from "@packages/blog";
import type { Metadata } from "next";
import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = {
  description: "Henry Lee 的技術文章與開發心得分享",
  title: "技術部落格 - Henry Lee",
};

// ❌ 移除這行
// export const dynamic = "force-dynamic";

const BlogPage: React.FC = async () => {
  const queryClient = getQueryClient();

  // 預取第一頁資料
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["mediumArticles", 9],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/api/medium-articles?limit=9");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    initialPageParam: undefined,
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
};

export default BlogPage;
```

**Chrome DevTools 測試 2.1**:

1. **Network Tab**:
   - 確認 `/api/medium-articles?limit=9` 請求
   - 檢查 response 格式
   - 記錄載入時間
2. **Console**:
   - 無 QueryClient 錯誤
   - 無 hydration 錯誤
3. **Elements Tab**:
   - 確認文章列表正確渲染

**步驟 2.2: 測試無限滾動**

**Chrome DevTools 測試 2.2**:

1. 滾動到頁面底部
2. **Network Tab**: 確認第二頁請求（帶 cursor）
3. **Console**: 無錯誤
4. **Elements Tab**: 新文章正確添加

---

### Phase 3: 移除 AI 頁面的 force-dynamic

**步驟 3.1: AI Dictionary**

修改 `apps/my-website/src/app/ai-dictionary/page.tsx`:

- 移除 `export const dynamic = "force-dynamic";`

**Chrome DevTools 測試 3.1**:

1. 導航到 `/ai-dictionary`
2. 輸入測試詞彙（例如："測試"）
3. **Network Tab**: 確認 `/api/define` POST 請求
4. **Console**: 無錯誤
5. 確認結果正確顯示

**步驟 3.2: AI Analyzer**

修改 `apps/my-website/src/app/ai-analyzer/page.tsx`:

- 移除 `export const dynamic = "force-dynamic";`

**Chrome DevTools 測試 3.2**:

1. 導航到 `/ai-analyzer`
2. 輸入測試提示詞
3. **Network Tab**: 確認 `/api/ai-analyzer` POST 請求
4. **Console**: 無錯誤
5. 確認結果正確顯示

---

### Phase 4: Build 驗證與效能測試

**步驟 4.1: Build 輸出檢查**

```bash
pnpm build
```

**預期輸出**:

```
Route (app)                              Size
┌ ○ /blog                                123 kB  ← 應該是 ○ (Static)
├ ○ /ai-dictionary                       456 kB
└ ○ /ai-analyzer                         456 kB
```

**步驟 4.2: Chrome DevTools 效能測試**

使用 Performance Insights:

```javascript
// 在 Chrome DevTools 執行
performance.mark("page-start");
// 等待頁面載入
performance.mark("page-end");
performance.measure("page-load", "page-start", "page-end");
```

**步驟 4.3: Lighthouse 測試**

1. 開啟 Lighthouse
2. 測試 `/blog` 頁面
3. 記錄分數:
   - Performance: \_\_\_\_ 分
   - SEO: \_\_\_\_ 分
   - Best Practices: \_\_\_\_ 分

---

### Phase 5: Commit & PR

**Commit 策略**:

```bash
# Commit 1: 建立 QueryClient
git add apps/my-website/src/lib/query-client.ts
git commit -m "feat(query): add server-side QueryClient setup"

# Commit 2: Blog 重構
git add apps/my-website/src/app/blog/page.tsx
git commit -m "refactor(blog): implement React Query prefetching pattern

- Remove force-dynamic export
- Add prefetchInfiniteQuery for first page
- Wrap with HydrationBoundary for SSG support
- Related to Issue #40"

# Commit 3: AI 頁面優化
git add apps/my-website/src/app/ai-dictionary/page.tsx
git add apps/my-website/src/app/ai-analyzer/page.tsx
git commit -m "refactor(ai): remove unnecessary force-dynamic exports

- AI features use mutations (no prefetching needed)
- Related to Issue #40"
```

**建立 PR**:

```bash
git push -u origin feat/react-query-prefetching
gh pr create --title "refactor: Implement React Query prefetching pattern" \
  --body "Closes #40" \
  --label enhancement
```

---

## 🔍 測試檢查清單

### Blog 頁面

- [ ] Console 無錯誤
- [ ] 初始文章正確顯示
- [ ] 無限滾動正常運作
- [ ] Network 請求時機正確
- [ ] Build 輸出為 Static (○)

### AI Dictionary

- [ ] Console 無錯誤
- [ ] 查詢功能正常
- [ ] Mutation 正常運作

### AI Analyzer

- [ ] Console 無錯誤
- [ ] 分析功能正常
- [ ] Mutation 正常運作

### 效能

- [ ] Lighthouse 分數改善
- [ ] 初次載入時間減少
- [ ] SEO meta tags 預渲染

---

## ⚠️ 潛在問題與解決方案

### 問題 1: Server Component fetch URL

**問題**: Server Component 中 fetch 需要完整 URL

```typescript
// ❌ 相對路徑在 Server Component 不行
fetch("/api/medium-articles");

// ✅ 需要完整 URL
fetch("http://localhost:3001/api/medium-articles");
```

**解決**: 在 production 使用環境變數

```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
fetch(`${baseUrl}/api/medium-articles`);
```

### 問題 2: Hydration Mismatch

**症狀**: Console 出現 hydration 錯誤

**解決**:

1. 確認 queryKey 一致
2. 確認 fetch 函式邏輯一致
3. 檢查 initialPageParam

### 問題 3: 無限滾動失效

**症狀**: 第二頁無法載入

**解決**:

1. 檢查 getNextPageParam 邏輯
2. 確認 cursor 傳遞正確
3. Network tab 檢查請求參數

---

## 📚 參考資料

- [TanStack Query SSR Guide](https://tanstack.com/query/v5/docs/react/guides/advanced-ssr)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
- [HydrationBoundary API](https://tanstack.com/query/v5/docs/react/reference/HydrationBoundary)

---

## 📝 記錄

### 2025-10-31

- 建立實作計畫
- 準備開發環境
- Chrome DevTools MCP 已連接

**備註**: 用戶發現之前上傳的版本有問題，計畫已儲存，等待問題說明。
