# @packages/shared

共享的工具、類型、組件和常數，供所有 feature packages 使用。

## 包含內容

### Components

- `AnimatedWrapper` - 動畫包裝組件

### Utils

- `cn` - Tailwind CSS 類名合併工具

### Types

- `NavRoute` - 導航路由類型
- `BaseComponent` - 基礎組件類型
- `ApiResponse` - API 響應類型

### Constants

- `routes` - 應用路由配置
- `SOCIAL_LINKS` - 社交媒體連結
- `CONTACT_LINKS` - 聯絡方式連結

## 使用方式

```typescript
import { AnimatedWrapper, cn, routes, SOCIAL_LINKS } from "@packages/shared";
```

## 開發

```bash
# 構建
pnpm build

# 開發模式
pnpm dev

# 類型檢查
pnpm check-types

# Lint
pnpm lint
```
