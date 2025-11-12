# Monorepo 配置文檔

> ⚠️ **DEPRECATED** - This document will be migrated to Diataxis framework.
>
> **Future location**: `docs/reference/configuration.md` (Phase 3)
>
> This file will be archived after migration.

---

本文檔說明 my-website monorepo 的 TypeScript、ESLint 和 AI 工具配置架構。

## AI 工具配置

本專案採用 [AGENTS.md](https://agents.md/) 業界標準進行 AI 編碼助手配置。

### 配置檔案結構

```
my-website/
├── AGENTS.md                    # 主配置檔（業界標準）
├── CLAUDE.md                    # Claude Code 入口檔（@AGENTS.md + 專屬功能）
├── .cursorrules → AGENTS.md     # Symbolic link（Cursor IDE）
├── .windsurfrules → AGENTS.md   # Symbolic link（Windsurf IDE）
└── .gemini/
    └── settings.json            # Gemini CLI 設定（contextFileName: "AGENTS.md"）
```

### 檔案說明

- **AGENTS.md** - 所有 AI 工具的共同配置（專案概述、開發命令、編碼標準、架構規範）
- **CLAUDE.md** - Claude Code 專屬功能（React Query 模式、API 路由、Subagents、MCP 伺服器）
- **.cursorrules** - Cursor IDE 配置（符號連結到 AGENTS.md）
- **.windsurfrules** - Windsurf IDE 配置（符號連結到 AGENTS.md）
- **.gemini/settings.json** - Gemini CLI 設定（指向 AGENTS.md）

### 支援的 AI 工具

- ✅ **Claude Code** - 透過 `@AGENTS.md` 引用讀取主配置
- ✅ **Cursor IDE** - 原生支援 `.cursorrules` 符號連結
- ✅ **Windsurf IDE** - 原生支援 `.windsurfrules` 符號連結
- ✅ **Gemini CLI** - 透過 `settings.json` 設定讀取 AGENTS.md

### 設計理念

採用 **單一來源真相（Single Source of Truth）** 原則：

- 共同規範統一維護在 AGENTS.md
- 工具專屬功能各自獨立（如 CLAUDE.md）
- 透過符號連結或引用自動同步
- 減少重複內容，降低維護成本

### 詳細說明

參閱 [ADR 002: Adopt AGENTS.md Standard](./adr/002-agents-md-adoption.md) 瞭解完整的設計決策、實作細節和遷移指南。

---

## TypeScript 和 ESLint 配置

## 配置架構概覽

本 monorepo 採用模塊化配置方式，將共享配置集中管理於 `packages` 目錄，各個應用和套件再根據需要引用和擴展。

### 目錄結構

```
my-website/
├── packages/
│   ├── eslint-config/          # 共享 ESLint 配置
│   │   ├── index.js            # 基礎配置
│   │   ├── next.js             # Next.js 應用配置
│   │   └── react-internal.js   # React 套件配置
│   └── tsconfig/               # 共享 TypeScript 配置
│       ├── base.json           # 基礎配置
│       ├── nextjs.json         # Next.js 應用配置
│       └── react-library.json  # React 套件配置
├── apps/
│   └── my-website/             # 主應用
│       ├── eslint.config.mjs   # 應用專屬 ESLint 配置
│       └── tsconfig.json       # 應用專屬 TypeScript 配置
└── packages/
    ├── shared/                 # 共享組件套件
    ├── about/                  # About 頁面套件
    └── not-found/              # 404 頁面套件
```

## TypeScript 配置

### 基礎配置 (`packages/tsconfig/base.json`)

提供所有專案的基礎 TypeScript 配置，採用嚴格模式：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
    // ... 其他選項
  }
}
```

**重要特性：**

- ✅ 啟用嚴格模式 (`strict: true`)
- ✅ 索引訪問檢查 (`noUncheckedIndexedAccess`)
- ✅ 未使用變數檢查 (`noUnusedLocals`, `noUnusedParameters`)
- ✅ Switch 語句完整性檢查 (`noFallthroughCasesInSwitch`)

### Next.js 應用配置 (`packages/tsconfig/nextjs.json`)

針對 Next.js 應用的特定配置：

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "allowJs": true,
    "jsx": "preserve",
    "noEmit": true
  }
}
```

### React 套件配置 (`packages/tsconfig/react-library.json`)

針對 React 套件的配置：

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "noEmit": false,
    "composite": true
  }
}
```

**重要特性：**

- ✅ 使用新的 JSX 轉換 (`react-jsx`)，不需要顯式導入 React
- ✅ 啟用複合專案模式 (`composite: true`) 支援 Project References

## ESLint 配置

### 基礎配置 (`packages/eslint-config/index.js`)

提供所有專案的基礎 ESLint 規則：

**包含的插件：**

- `eslint-plugin-turbo` - Turborepo 特定規則
- `eslint-plugin-unused-imports` - 自動移除未使用的 imports
- `eslint-plugin-simple-import-sort` - Import 排序
- `eslint-plugin-sonarjs` - 代碼質量檢查
- `eslint-plugin-perfectionist` - 代碼排序和組織

**主要規則：**

```javascript
{
  // TypeScript
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/consistent-type-imports": "warn",

  // Import 管理
  "unused-imports/no-unused-imports": "error",
  "simple-import-sort/imports": "error",
  "simple-import-sort/exports": "error",

  // 代碼質量
  "sonarjs/cognitive-complexity": ["warn", 15],
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "prefer-const": "error"
}
```

### Next.js 應用配置 (`packages/eslint-config/next.js`)

擴展基礎配置，加入 React 和 Next.js 特定規則：

**額外插件：**

- `eslint-plugin-react` - React 規則
- `eslint-plugin-react-hooks` - React Hooks 規則
- `@next/eslint-plugin-next` - Next.js 特定規則

**重要規則：**

```javascript
{
  "react/react-in-jsx-scope": "off",      // 新 JSX 轉換不需要
  "react/prop-types": "off",              // 使用 TypeScript
  ...pluginNext.configs.recommended.rules,
  ...pluginNext.configs["core-web-vitals"].rules
}
```

### React 套件配置 (`packages/eslint-config/react-internal.js`)

針對內部 React 套件的配置，與 Next.js 配置類似但不包含 Next.js 特定規則。

## 使用方式

### 新建 Next.js 應用

**tsconfig.json:**

```json
{
  "extends": "@packages/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**eslint.config.mjs:**

```javascript
import { nextJsConfig } from "@packages/eslint-config/next";

export default nextJsConfig;
```

### 新建 React 套件

**tsconfig.json:**

```json
{
  "extends": "@packages/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

**eslint.config.js:**

```javascript
import { config } from "@packages/eslint-config/react-internal";

export default config;
```

## 代碼檢查命令

### Monorepo 層級

```bash
# 運行所有檢查（類型檢查 + Lint）
pnpm run check

# 僅類型檢查
pnpm run check-types

# 僅 Lint
pnpm run lint
```

### 應用層級（apps/my-website）

```bash
# 完整檢查 + 自動修復
pnpm run check

# 組成部分
pnpm run check-types  # TypeScript 檢查
pnpm run lint --fix   # ESLint 檢查並修復
prettier --write .    # 格式化代碼
```

## 遷移指南

### 從舊配置遷移

如果您有使用舊的 ESLint 8 或較寬鬆的 TypeScript 配置：

1. **移除不必要的 React imports**

   ```typescript
   // ❌ 舊方式
   import React from "react";

   // ✅ 新方式（使用 JSX 時會自動導入）
   // 不需要顯式導入
   ```

2. **處理索引訪問**

   ```typescript
   // ❌ 舊方式
   const item = array[0];
   item.property; // 可能是 undefined

   // ✅ 新方式
   const item = array[0];
   if (item) {
     item.property;
   }
   // 或使用 optional chaining
   array[0]?.property;
   ```

3. **移除未使用的變數**

   ```typescript
   // ❌ 會產生錯誤
   const unusedVar = "value";

   // ✅ 使用底線前綴表示故意未使用
   const _unusedVar = "value";
   ```

## 配置優勢

✅ **類型安全增強**：嚴格的 TypeScript 配置捕捉更多潛在錯誤  
✅ **代碼一致性**：自動排序 imports 和統一代碼風格  
✅ **開發體驗**：自動修復大部分格式問題  
✅ **維護性**：集中管理配置，易於更新和維護  
✅ **最佳實踐**：遵循 React 19、Next.js 15 和 TypeScript 5+ 的最佳實踐

## 參考資源

- [TypeScript 編譯選項](https://www.typescriptlang.org/tsconfig)
- [ESLint 配置](https://eslint.org/docs/latest/use/configure/)
- [Turborepo 文檔](https://turbo.build/repo/docs)
- [Next.js ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [React 19 文檔](https://react.dev/)
