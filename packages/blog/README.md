# @packages/blog

部落格功能 package，整合 Medium 文章展示。

## 功能

- Medium 文章列表展示
- 文章卡片組件
- 響應式網格布局

## 使用方式

```typescript
import { BlogFeature } from "@packages/blog";

export default function BlogPage() {
  return <BlogFeature />;
}
```

## API

- `BlogFeature` - 主要組件
- `useMediumArticles` - 獲取文章的 hook
