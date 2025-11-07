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

Fetch cached Medium articles with pagination.

## Endpoint

```
GET /api/medium-articles?offset=0&limit=10
```

## Description

Returns cached Medium articles from `@packages/shared/data/articleData.ts`. Articles are synced via `sync:all-articles` script before builds.

## Request

### Query Parameters

| Parameter | Type   | Required | Default | Description        |
| --------- | ------ | -------- | ------- | ------------------ |
| offset    | number | No       | 0       | Pagination offset  |
| limit     | number | No       | 10      | Number of articles |

### Example

```bash
# First page (10 articles)
curl https://henryleelab.com/api/medium-articles?offset=0&limit=10

# Second page
curl https://henryleelab.com/api/medium-articles?offset=10&limit=10
```

## Response

### Success (200)

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
  publishedAt: string; // ISO 8601 date
  readingTime: number; // minutes
  tags: string[];
  claps: number;
}
```

### Example Response

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

### Error (400)

```json
{
  "success": false,
  "error": "Invalid parameters: offset must be >= 0"
}
```

## Implementation

### Location

```
apps/my-website/src/app/api/medium-articles/route.ts
```

### Data Source

```
packages/shared/data/articleData.ts
```

### Update Process

1. **Manually**: Run `pnpm sync:all-articles`
2. **Automatically**: Runs before `pnpm build`
3. **Scripts**:
   - `scripts/sync-latest-articles.ts` - Fetch latest 2 articles
   - `scripts/batch-parse-articles.ts` - Parse full content

### Caching

- Articles cached at build time
- No runtime API calls to Medium
- Data embedded in bundle

## Pagination

### Infinite Scroll Pattern

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

### Manual Pagination

```javascript
// Page 1
const page1 = await fetch("/api/medium-articles?offset=0&limit=10");

// Page 2
const page2 = await fetch("/api/medium-articles?offset=10&limit=10");

// Page 3
const page3 = await fetch("/api/medium-articles?offset=20&limit=10");
```

## SSG Integration

### Server Prefetch

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

See: [React Query Patterns](../../explanation/react-query-patterns.md)

## Article Sync Scripts

### Sync Latest Articles

```bash
pnpm sync:all-articles
```

Fetches latest 2 articles and updates `article-urls.json`.

### Batch Parse All Articles

```bash
pnpm parse:all-articles
```

Parses full content for all articles in `article-urls.json`.

## Error Handling

| Code           | Description           | Status |
| -------------- | --------------------- | ------ |
| INVALID_OFFSET | offset < 0            | 400    |
| INVALID_LIMIT  | limit < 1 or > 100    | 400    |
| NO_DATA        | articleData not found | 500    |

## Performance

- **Response time**: <10ms (cached data)
- **Data size**: ~2KB per article
- **Bundle impact**: Articles embedded in build

## Related

- [API Overview](./README.md)
- [React Query Patterns](../../explanation/react-query-patterns.md)
- [Architecture Reference](../architecture.md)
- [Medium Article Sync Guide](../../../MEDIUM-ARTICLES-GUIDE.md) _(deprecated)_
