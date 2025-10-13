# @packages/shared

共用的工具函數、類型定義、常數和組件。

## 內容

- `utils/` - 工具函數（如 cn）
- `types/` - TypeScript 類型定義
- `constants/` - 常數定義
- `data/` - 共用資料
- `components/` - 共用 React 組件

## 使用方式

```typescript
// Import utils
import { cn } from "@packages/shared/utils";

// Import types
import type { Article, Experience } from "@packages/shared/types";

// Import constants
import { ROUTES, AI_MODELS } from "@packages/shared/constants";

// Import data
import { articleList, skillData } from "@packages/shared/data";
```
