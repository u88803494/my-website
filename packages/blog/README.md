# @packages/blog

自架 MDX blog UI package，服務 `/blog` 路由（Velite 靜態生成，非 Medium）。

## 功能

- 文章列表呈現
- 文章卡片組件

## 使用方式

```typescript
import { BlogFeature } from "@packages/blog";
import type { PostSummary } from "@packages/blog/types";

export default function BlogPage() {
  const posts: PostSummary[] = getAllPosts();
  return <BlogFeature posts={posts} />;
}
```

資料取得（Velite content）在 `apps/my-website/src/lib/content/posts.ts`，這個 package 只負責 UI 呈現，不直接依賴 Velite 輸出。
