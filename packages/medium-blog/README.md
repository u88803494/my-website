# @packages/medium-blog

Medium 文章展示 package，服務 `/medium-blog` 路由（無限捲動列表）。

## 功能

- Medium 文章列表展示
- 文章卡片組件
- 響應式網格布局

## 使用方式

```typescript
import { BlogFeature } from "@packages/medium-blog";

export default function MediumBlogPage() {
  return <BlogFeature />;
}
```

## API

- `BlogFeature` - 主要組件
- `useMediumArticles` - 獲取文章的 hook
