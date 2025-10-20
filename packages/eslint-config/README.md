# @packages/eslint-config

Monorepo 共享的 ESLint 配置，提供一致的程式碼品質標準和最佳實踐。

## 📦 可用配置

### 1. Base Config (`index.js`)

**適用**: 所有 TypeScript 專案的基礎配置

```javascript
import { config } from "@packages/eslint-config";

export default [...config];
```

**包含的規則集**:

- ✅ `@eslint/js` - JavaScript 推薦規則
- ✅ `typescript-eslint` - TypeScript 推薦規則
- ✅ `eslint-config-prettier` - 與 Prettier 相容
- ✅ `sonarjs` - 程式碼品質和複雜度檢查
- ✅ `perfectionist` - 自動排序 imports/exports/types
- ✅ `simple-import-sort` - Import 自動排序
- ✅ `unused-imports` - 自動移除未使用的 imports
- ✅ `turbo` - Turborepo 特定規則

### 2. Next.js Config (`next.js`)

**適用**: Next.js 專案

```javascript
import { nextConfig } from "@packages/eslint-config/next";

export default [...nextConfig];
```

**額外包含**:

- ✅ Next.js 推薦規則
- ✅ React 最佳實踐
- ✅ React Hooks 規則

### 3. React Internal Config (`react-internal.js`)

**適用**: React 組件庫或內部 React packages

```javascript
import { reactInternalConfig } from "@packages/eslint-config/react-internal";

export default [...reactInternalConfig];
```

**專注於**:

- ✅ React 組件開發規則
- ✅ 無 Next.js 特定規則

## 🚀 使用方式

### 在新 Package 中使用

1. **安裝依賴**:

```json
{
  "devDependencies": {
    "@packages/eslint-config": "workspace:*",
    "eslint": "^9"
  }
}
```

2. **創建 `eslint.config.mjs`**:

```javascript
import { config } from "@packages/eslint-config";

export default [
  ...config,
  {
    // 可以在這裡覆寫或新增規則
    rules: {
      // 例如: 關閉某個規則
      "no-console": "off",
    },
  },
];
```

3. **添加 npm scripts**:

```json
{
  "scripts": {
    "lint": "eslint src --fix"
  }
}
```

### 在 Next.js App 中使用

```javascript
// apps/my-website/eslint.config.mjs
import { nextConfig } from "@packages/eslint-config/next";

export default [...nextConfig];
```

## 🔧 主要規則說明

### Import 排序

自動按以下順序排序 imports：

```typescript
// 1. React 相關
import React from "react";
import { useState } from "react";

// 2. 第三方套件
import { useQuery } from "@tanstack/react-query";

// 3. Monorepo packages
import { cn } from "@packages/shared/utils";

// 4. 相對路徑
import { Header } from "./components/Header";
```

### 未使用的 Imports

自動移除未使用的 imports：

```typescript
// ❌ 會被移除
import { unused } from "some-package";

// ✅ 保留
import { used } from "some-package";

const result = used();
```

### TypeScript 嚴格模式

```typescript
// ❌ 錯誤 - 未明確指定型別
const data = fetchData();

// ✅ 正確
const data: UserData = fetchData();
```

## 📋 完整 Plugin 列表

| Plugin                             | 用途                               |
| ---------------------------------- | ---------------------------------- |
| `@eslint/js`                       | JavaScript 基礎規則                |
| `typescript-eslint`                | TypeScript 語法檢查                |
| `eslint-config-prettier`           | Prettier 整合                      |
| `eslint-plugin-sonarjs`            | 程式碼品質和複雜度                 |
| `eslint-plugin-perfectionist`      | 自動排序                           |
| `eslint-plugin-simple-import-sort` | Import 排序                        |
| `eslint-plugin-unused-imports`     | 清理未使用的 imports               |
| `eslint-plugin-turbo`              | Turborepo 最佳實踐                 |
| `eslint-plugin-react`              | React 規則（Next.js config）       |
| `eslint-plugin-react-hooks`        | React Hooks 規則（Next.js config） |
| `@next/eslint-plugin-next`         | Next.js 規則（Next.js config）     |

## 🎨 與 Prettier 整合

此配置已包含 `eslint-config-prettier`，確保 ESLint 不會與 Prettier 衝突。

推薦的 workflow：

```bash
# 1. ESLint 修正程式碼問題
pnpm lint

# 2. Prettier 格式化程式碼
pnpm format

# 或使用整合指令
pnpm check  # 同時執行 type-check, lint, format
```

## 🔍 常見問題

### Q: 如何覆寫某個規則？

在你的 `eslint.config.mjs` 中：

```javascript
import { config } from "@packages/eslint-config";

export default [
  ...config,
  {
    rules: {
      // 關閉規則
      "no-console": "off",

      // 修改規則嚴格度
      "@typescript-eslint/no-explicit-any": "warn",

      // 自訂規則
      "max-lines": ["error", { max: 300 }],
    },
  },
];
```

### Q: 如何忽略特定檔案？

```javascript
export default [
  ...config,
  {
    ignores: ["dist/**", "build/**", "*.config.js"],
  },
];
```

### Q: 為什麼要用 `.mjs` 副檔名？

ESLint 9 使用 ES Modules，`.mjs` 明確告訴 Node.js 這是 ES Module。

## 📚 配置檔案結構

```
packages/eslint-config/
├── index.js              # Base config
├── next.js              # Next.js config
├── react-internal.js    # React library config
├── package.json
└── README.md
```

## 🎯 最佳實踐

1. **在 pre-commit hook 中執行 lint**:

   ```bash
   # lint-staged.config.js
   {
     "**/*.{js,jsx,ts,tsx}": ["eslint --fix"]
   }
   ```

2. **在 CI/CD 中執行嚴格檢查**:

   ```bash
   eslint src --max-warnings 0
   ```

3. **定期更新依賴**:
   ```bash
   pnpm update @packages/eslint-config
   ```

## 📖 參考資料

- [ESLint 官方文件](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)
