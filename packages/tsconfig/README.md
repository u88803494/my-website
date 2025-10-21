# @packages/tsconfig

Monorepo 共享的 TypeScript 配置，提供一致的型別檢查和編譯設定。

## 📦 可用配置

### 1. Base Config (`base.json`)

**適用**: 所有 TypeScript 專案的基礎配置

```json
{
  "extends": "@packages/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**特性**:

- ✅ 嚴格模式 (`strict: true`)
- ✅ ES2022 目標和函式庫
- ✅ Bundler 模組解析（支援 Next.js/Vite）
- ✅ 未使用變數檢查
- ✅ JSX 支援 (`preserve`)
- ✅ 型別宣告生成

### 2. Next.js Config (`nextjs.json`)

**適用**: Next.js 應用程式

```json
{
  "extends": "@packages/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**額外配置**:

- ✅ Next.js 特定設定
- ✅ `@/*` 路徑別名
- ✅ `.next` 增量編譯

### 3. React Library Config (`react-library.json`)

**適用**: React 組件庫或內部 React packages

```json
{
  "extends": "@packages/tsconfig/react-library.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**專注於**:

- ✅ React 組件開發
- ✅ 宣告檔案生成
- ✅ 適合打包成 npm packages

## 🚀 使用方式

### 在新 Package 中使用

1. **安裝依賴**:

```json
{
  "devDependencies": {
    "@packages/tsconfig": "workspace:*",
    "typescript": "^5"
  }
}
```

2. **創建 `tsconfig.json`**:

```json
{
  "extends": "@packages/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

3. **添加 type-check script**:

```json
{
  "scripts": {
    "check-types": "tsc --noEmit"
  }
}
```

### 選擇正確的配置

| 專案類型      | 使用配置             |
| ------------- | -------------------- |
| Next.js App   | `nextjs.json`        |
| React Package | `react-library.json` |
| 通用 Package  | `base.json`          |

## 🔧 Base Config 詳細設定

### Compiler Options

```json
{
  "target": "ES2022", // 編譯目標
  "lib": ["ES2022", "DOM", "DOM.Iterable"],
  "module": "ESNext", // 模組系統
  "moduleResolution": "Bundler", // Bundler 解析（Next.js/Vite）
  "strict": true, // 啟用所有嚴格檢查
  "noEmit": true, // 不產生輸出檔案
  "jsx": "preserve", // 保留 JSX（由 Next.js 處理）
  "skipLibCheck": true, // 跳過 .d.ts 檢查（加速）
  "esModuleInterop": true, // CommonJS/ES Module 互通
  "resolveJsonModule": true, // 允許 import JSON
  "isolatedModules": true, // 每個檔案獨立轉譯
  "incremental": true, // 增量編譯
  "forceConsistentCasingInFileNames": true,
  "declaration": true, // 生成 .d.ts 檔案
  "declarationMap": true // 生成 .d.ts.map
}
```

### 嚴格模式檢查

```json
{
  "noUncheckedIndexedAccess": true, // 陣列存取需要 undefined 檢查
  "noUnusedLocals": true, // 禁止未使用的區域變數
  "noUnusedParameters": true, // 禁止未使用的參數
  "noFallthroughCasesInSwitch": true // switch 必須有 break
}
```

## 📋 配置對比

| 功能         | base.json | nextjs.json | react-library.json |
| ------------ | --------- | ----------- | ------------------ |
| React JSX    | ✅        | ✅          | ✅                 |
| Next.js 特定 | ❌        | ✅          | ❌                 |
| 型別宣告     | ✅        | ✅          | ✅                 |
| 增量編譯     | ✅        | ✅          | ✅                 |
| Bundler 解析 | ✅        | ✅          | ✅                 |

## 🎯 常見使用案例

### Case 1: Feature Package

```json
// packages/blog/tsconfig.json
{
  "extends": "@packages/tsconfig/react-library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Case 2: Next.js App

```json
// apps/my-website/tsconfig.json
{
  "extends": "@packages/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@packages/*": ["../../packages/*/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### Case 3: 工具 Package（無 React）

```json
// packages/utils/tsconfig.json
{
  "extends": "@packages/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022"], // 移除 DOM
    "jsx": undefined // 移除 JSX
  },
  "include": ["src/**/*"]
}
```

## 🔍 型別檢查最佳實踐

### 1. 使用路徑別名

```typescript
// ✅ 好 - 使用別名
import { Button } from "@/components/Button";

// ❌ 差 - 相對路徑
import { Button } from "../../../components/Button";
```

### 2. 明確型別註解

```typescript
// ✅ 好
const user: User = await fetchUser();

// ❌ 差 - any 型別
const user = await fetchUser();
```

### 3. 使用 strictNullChecks

```typescript
// ✅ 好 - 處理 null/undefined
const name = user?.name ?? "Anonymous";

// ❌ 差 - 可能拋出錯誤
const name = user.name;
```

## 🐛 常見問題

### Q: "Cannot find module '@packages/xxx'" 錯誤？

確保在 `tsconfig.json` 中設定了 paths：

```json
{
  "compilerOptions": {
    "paths": {
      "@packages/*": ["../../packages/*/src"]
    }
  }
}
```

### Q: 為什麼使用 `moduleResolution: "Bundler"`？

Bundler 模式是 TypeScript 5.0+ 專為現代 bundlers（Next.js、Vite）設計的，支援：

- Package exports
- 條件式 imports
- 更好的 monorepo 支援

### Q: `noEmit: true` 的作用？

在 monorepo 中，編譯通常由 Next.js/Vite 處理，TypeScript 只負責**型別檢查**，不產生輸出檔案。

## 📚 配置檔案結構

```
packages/tsconfig/
├── base.json           # 基礎配置
├── nextjs.json        # Next.js 配置
├── react-library.json # React 組件庫配置
├── package.json
└── README.md
```

## 🎨 與其他工具整合

### ESLint

```bash
# TypeScript 和 ESLint 一起執行
pnpm check      # check-types + lint + format
```

### Turbo

```json
// turbo.json
{
  "tasks": {
    "check-types": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 📖 參考資料

- [TypeScript 官方文件](https://www.typescriptlang.org/docs/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [Next.js TypeScript 支援](https://nextjs.org/docs/basic-features/typescript)
