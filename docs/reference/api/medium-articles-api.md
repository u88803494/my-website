---
title: "GET /api/medium-articles - Medium Articles API"
type: reference
status: stable
audience: [developer, ai]
tags: [api, medium, blog, articles, pagination]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/api/README.md
  - reference/architecture.md
  - explanation/react-query-patterns.md
ai_context: |
  API endpoint for fetching cached Medium articles with pagination support,
  used by the blog feature with infinite scroll.
---

# GET /api/medium-articles

取得快取的 Medium 文章,支援分頁功能。

## 端點

```
GET /api/medium-articles?offset=0&limit=10
```

## 說明

從 `@packages/shared/data/articleData.ts` 回傳快取的 Medium 文章。文章會在建置前透過 `sync:all-articles` 腳本同步。

## 請求

### Query Parameters

| 參數   | 類型   | 必填 | 預設值 | 說明       |
| ------ | ------ | ---- | ------ | ---------- |
| offset | number | 否   | 0      | 分頁偏移量 |
| limit  | number | 否   | 10     | 文章數量   |

### 範例

```bash
# 第一頁（10 篇文章）
curl https://henryleelab.com/api/medium-articles?offset=0&limit=10

# 第二頁
curl https://henryleelab.com/api/medium-articles?offset=10&limit=10
```

## 回應

### 成功 (200)

```typescript
interface MediumArticlesResponse {
  data: Article[];
  hasMore: boolean;
  total: number;
}

interface Article {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  publishedAt: string; // ISO 8601 日期格式
  readingTime: number; // 分鐘數
  tags: string[];
  claps: number;
}
```

### 範例回應

```json
{
  "data": [
    {
      "id": "abc123",
      "title": "Understanding React Hooks",
      "subtitle": "A deep dive into useState and useEffect",
      "url": "https://medium.com/@henrylee/understanding-react-hooks-abc123",
      "publishedAt": "2025-01-15T10:30:00Z",
      "readingTime": 5,
      "tags": ["React", "JavaScript", "Frontend"],
      "claps": 120
    }
  ],
  "hasMore": true,
  "total": 25
}
```

### 錯誤 (400)

```json
{
  "success": false,
  "error": "Invalid parameters: offset must be >= 0"
}
```

## 實作

### 位置

```
apps/my-website/src/app/api/medium-articles/route.ts
```

### 資料來源

```
packages/shared/data/articleData.ts
```

### 更新流程

1. **手動方式**: 執行 `pnpm sync:all-articles`
2. **自動方式**: 在 `pnpm build` 之前執行
3. **相關腳本**:
   - `scripts/sync-latest-articles.ts` - 取得最新 2 篇文章
   - `scripts/batch-parse-articles.ts` - 解析完整內容

### 快取機制

- 文章在建置時快取
- 執行期不會呼叫 Medium API
- 資料嵌入在打包檔案中

## 分頁

### 無限捲動模式

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["medium-articles", limit],
  queryFn: ({ pageParam = 0 }) =>
    fetch(`/api/medium-articles?offset=${pageParam}&limit=${limit}`).then(
      (res) => res.json(),
    ),
  getNextPageParam: (lastPage, allPages, lastPageParam) =>
    lastPage.hasMore ? lastPageParam + lastPage.data.length : undefined,
  initialPageParam: 0,
});
```

### 手動分頁

```javascript
// 第 1 頁
const page1 = await fetch("/api/medium-articles?offset=0&limit=10");

// 第 2 頁
const page2 = await fetch("/api/medium-articles?offset=10&limit=10");

// 第 3 頁
const page3 = await fetch("/api/medium-articles?offset=20&limit=10");
```

## SSG 整合

### 伺服器端預取

```typescript
// apps/my-website/src/app/blog/page.tsx
export default async function BlogPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["medium-articles", limit],
    queryFn: ({ pageParam }) =>
      fetchMediumArticles({ limit, pageParam }),
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

參考：[React Query Patterns](../../explanation/react-query-patterns.md)

## 文章同步腳本

### 同步最新文章

```bash
pnpm sync:all-articles
```

取得最新 2 篇文章並更新 `article-urls.json`。

### 批次解析所有文章

```bash
pnpm parse:all-articles
```

解析 `article-urls.json` 中所有文章的完整內容。

## 錯誤處理

| 代碼           | 說明               | 狀態碼 |
| -------------- | ------------------ | ------ |
| INVALID_OFFSET | offset < 0         | 400    |
| INVALID_LIMIT  | limit < 1 或 > 100 | 400    |
| NO_DATA        | 找不到 articleData | 500    |

## 效能

- **回應時間**: <10ms（快取資料）
- **資料大小**: 每篇文章約 2KB
- **打包影響**: 文章嵌入在建置檔案中

## 相關文件

- [API 概覽](./README.md)
- [React Query Patterns](../../explanation/react-query-patterns.md)
- [架構參考](../architecture.md)
- [Medium Article Sync Guide](../../../MEDIUM-ARTICLES-GUIDE.md) _（已棄用）_
