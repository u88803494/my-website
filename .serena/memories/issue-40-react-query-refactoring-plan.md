# Issue #40: React Query Prefetching Pattern 重構計畫

## 📋 Issue 資訊

- **Issue ID**: #40
- **標題**: refactor: Implement React Query prefetching pattern for better performance
- **連結**: https://github.com/u88803494/my-website/issues/40
- **標籤**: enhancement
- **狀態**: Open
- **建立時間**: 2025-10-30
- **相關 Issue**: #30 (Dependencies Upgrade)

---

## 🎯 問題背景

在完成 Issue #30 的依賴升級後，發現專案中 React Query 的使用方式不符合 TanStack Query 官方最佳實踐。

### 當前架構問題

**目前做法（不符合最佳實踐）：**

```tsx
// ❌ app/blog/page.tsx
export const dynamic = "force-dynamic"; // 強制動態渲染
export default function BlogPage() {
  return <BlogFeature />; // Client Component 直接 fetch
}
```

**影響：**

- ❌ 無法利用 Static Site Generation (SSG)
- ❌ 存在 Request Waterfall 問題（深層瀑布）
- ❌ 初次載入效能較差
- ⚠️ SEO 表現不佳（內容無法預渲染）

### 受影響頁面

1. **`/blog`** - Medium 文章列表（無限滾動）
   - 使用 `useInfiniteQuery`
   - 當前使用 `force-dynamic`
2. **`/ai-dictionary`** - AI 字典功能
   - 使用 `useMutation`
   - 當前使用 `force-dynamic`
3. **`/ai-analyzer`** - AI 分析工具
   - 使用 `useMutation`
   - 當前使用 `force-dynamic`

### 為什麼需要 force-dynamic

在 Issue #30 升級後（React Query 5.81.2 → 5.90.5），SSG 時會出現錯誤：

```
Error: No QueryClient set, use QueryClientProvider to set one
```

**原因：**

- SSG 在 build 時執行，沒有客戶端環境
- `QueryClientProvider` 在 `layout.tsx`，但 SSG 不執行 Client Components
- 直接使用 `useQuery`/`useMutation` 找不到 QueryClient

**臨時解法：**
使用 `export const dynamic = "force-dynamic"` 強制動態渲染，避開 SSG。

---

## ✅ 目標架構（TanStack Query 官方推薦）

### 方案 A: Server Component Prefetching（推薦）

**Blog 頁面範例：**

```tsx
// ✅ app/blog/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { fetchMediumArticles } from "@/lib/api";

export default async function BlogPage() {
  const queryClient = getQueryClient();

  // 在 Server Component 預取資料
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["mediumArticles", 9],
    queryFn: () => fetchMediumArticles({ limit: 9 }),
    initialPageParam: undefined,
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

**優點：**

- ✅ 可以使用 SSG（預渲染）
- ✅ 扁平化 Request Waterfall
- ✅ SEO 友善
- ✅ 符合官方最佳實踐

### 方案 B: 混合方案（漸進式遷移）

```tsx
// ✅ app/blog/page.tsx
export default async function BlogPage() {
  // 使用原生 fetch 預取初始資料
  const initialArticles = await fetch("/api/medium-articles?limit=9").then(
    (r) => r.json(),
  );

  return <BlogFeature initialArticles={initialArticles} />;
}
```

**優點：**

- ✅ 實作更簡單
- ✅ 不需要大幅改動
- ✅ 仍可使用 SSG

---

## 📝 實作步驟

### Phase 1: 準備工作

**需要建立的檔案：**

1. **`lib/query-client.ts`** - Server-side QueryClient

```tsx
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// 使用 cache() 確保每個 request 只建立一個 QueryClient
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 分鐘
        },
      },
    }),
);
```

2. **研究項目：**
   - [ ] `HydrationBoundary` 用法
   - [ ] `dehydrate()` / `hydrate()` 機制
   - [ ] Server Component 中的 async/await

### Phase 2: Blog 頁面重構

**步驟：**

1. [ ] 建立 `getQueryClient` utility
2. [ ] 在 `app/blog/page.tsx` 實作 prefetching
3. [ ] 用 `HydrationBoundary` 包裹 `<BlogFeature />`
4. [ ] 測試 SSG 是否正常（檢查 build 輸出有 ○ 符號）
5. [ ] 移除 `export const dynamic = "force-dynamic"`
6. [ ] 驗證無限滾動功能仍正常運作
7. [ ] 測試效能改善（Lighthouse）

**預期結果：**

```bash
# Build 輸出應該顯示：
○ /blog     # ○ = Static，不是 ƒ (Dynamic)
```

### Phase 3: AI 功能評估

**AI Dictionary & Analyzer 評估：**

- ✅ **保持使用 React Query mutation** - 這是正確的！
- ⚠️ **不需要 prefetching** - 因為是用戶輸入驅動
- 🤔 **可能需要調整的地方**：
  - 移除 `force-dynamic`（如果只是用 mutation，不該需要）
  - 或者接受 `force-dynamic`（如果頁面需要其他動態內容）

### Phase 4: 效能驗證

**測試項目：**

1. [ ] Lighthouse 效能分數
   - 測試前：記錄當前分數
   - 測試後：比較改善幅度
2. [ ] Request Waterfall
   - 使用 Chrome DevTools Network tab
   - 確認請求是否扁平化
3. [ ] SEO Meta Tags
   - 檢查 View Page Source
   - 確認 Open Graph tags 被預渲染
4. [ ] Build 輸出
   - 確認有 ○ (Static) 符號
   - 不是 ƒ (Dynamic) 符號

---

## 🎯 預期效益

### 效能改進

- ✅ **首次載入時間減少** - 利用 SSG 預渲染
- ✅ **扁平化瀑布流** - 並行資料獲取
- ✅ **減少 JS Bundle** - Server Component 不傳送程式碼

### SEO 改進

- ✅ **完整預渲染** - 搜尋引擎可爬取完整內容
- ✅ **Open Graph** - 社群分享預覽正常
- ✅ **更快的 TTI** - Time to Interactive 改善

### 開發體驗

- ✅ **符合最佳實踐** - 遵循 TanStack Query 官方建議
- ✅ **清晰資料流** - Server → Client 資料流向明確
- ✅ **型別安全** - TypeScript 完整支援

---

## 📚 官方文件參考

### TanStack Query

- [Advanced SSR Guide](https://tanstack.com/query/v5/docs/react/guides/advanced-ssr)
- [Prefetching](https://tanstack.com/query/v5/docs/react/guides/prefetching)
- [HydrationBoundary API](https://tanstack.com/query/v5/docs/react/reference/HydrationBoundary)

### Next.js

- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
- [Static and Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering)

### 社群資源

- [Building a Fully Hydrated SSR App](https://sangwin.medium.com/building-a-fully-hydrated-ssr-app-with-next-js-app-router-and-tanstack-query-5970aaf822d2)

---

## 🔑 關鍵概念

### Prefetching Pattern 核心

```
Server Component (page.tsx)
    ↓
  prefetchQuery() - 在伺服器預取資料
    ↓
  dehydrate() - 將 QueryClient 狀態脫水
    ↓
  HydrationBoundary - 傳遞 dehydrated state
    ↓
Client Component (BlogFeature)
    ↓
  useQuery() - 使用預取的資料（不重複請求）
```

### 為什麼這樣更好？

**傳統做法（當前）：**

```
用戶訪問 → 下載 HTML → 下載 JS → 執行 JS → 呼叫 API → 顯示資料
                                    ↑ 這裡才開始取資料（慢）
```

**Prefetching 做法：**

```
Build 時 → 預取資料 → 生成包含資料的 HTML
用戶訪問 → 直接顯示資料 → Hydration（加入互動）
          ↑ 資料已經在 HTML 裡（快）
```

---

## ⚠️ 注意事項

### 1. AI 功能不需要 prefetching

- `useMutation` 用於用戶輸入驅動的操作
- 無法預測用戶會輸入什麼
- 保持使用 React Query 是正確的

### 2. 漸進式遷移

- 先從 `/blog` 開始（最明顯的效益）
- 確認效果後再決定是否擴展

### 3. 向下相容

- 確保無限滾動等功能不受影響
- 充分測試後再移除 `force-dynamic`

### 4. 不要過度優化

- 如果某些頁面真的需要動態渲染，保留 `force-dynamic` 是可以的
- 不是每個頁面都需要 SSG

---

## 🔄 與其他 Issue 的關聯

- **#30 (Dependencies Upgrade)**: 升級後暴露此架構問題
  - React Query: 5.81.2 → 5.90.5
  - 新版本對 SSG 的檢查更嚴格
  - 發現當前架構不符合最佳實踐

---

## 📊 實作優先級

### High Priority（高優先級）

- `/blog` 頁面重構 - 效益最明顯

### Medium Priority（中優先級）

- AI 功能評估 - 可能不需要改動

### Low Priority（低優先級）

- 其他使用 `force-dynamic` 的頁面評估

---

## 💡 學習重點

這次重構是一個很好的學習機會：

1. **理解 Server Components** - Next.js 15 的核心概念
2. **掌握 React Query SSR** - 官方推薦的整合方式
3. **效能優化思維** - 從架構層面思考效能
4. **最佳實踐** - 為什麼官方推薦這樣做

這不只是修 bug，而是提升整體架構品質！🚀
