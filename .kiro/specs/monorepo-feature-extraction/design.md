# Design Document

## Overview

本設計文件描述如何將現有的 my-website 應用重構為一個更加模組化的 monorepo 架構。重構的核心目標是將 `src/features` 目錄下的各個功能模組抽取為獨立的 packages，同時保持現有功能的完整性和 API 一致性。

### 重構前後對比

**重構前結構：**

```
apps/my-website/
└── src/
    ├── features/           # 所有功能混在一起
    ├── components/         # 共享組件
    ├── utils/             # 工具函數
    ├── types/             # 類型定義
    └── constants/         # 常數定義
```

**重構後結構：**

```
├── packages/
│   ├── shared/            # 共享的 utilities, types, constants
│   ├── ai-analyzer/       # AI 分析器功能
│   ├── ai-dictionary/     # AI 字典功能
│   ├── blog/             # 部落格功能
│   ├── resume/           # 履歷功能
│   ├── time-tracker/     # 時間追蹤功能
│   ├── about/            # 關於頁面
│   └── not-found/        # 404 頁面
└── apps/
    └── my-website/        # 簡化的主應用
        └── src/
            ├── app/       # Next.js 路由
            └── components/ # 僅保留 layout 相關組件
```

## Architecture

### 1. Package 分層架構

```mermaid
graph TD
    A[my-website App] --> B[@packages/shared]
    A --> C[@packages/ai-analyzer]
    A --> D[@packages/ai-dictionary]
    A --> E[@packages/blog]
    A --> F[@packages/resume]
    A --> G[@packages/time-tracker]
    A --> H[@packages/about]
    A --> I[@packages/not-found]

    C --> B
    D --> B
    E --> B
    F --> B
    G --> B
    H --> B
    I --> B
```

### 2. 依賴關係設計

- **my-website**: 主應用，依賴所有 feature packages
- **@packages/shared**: 基礎 package，被所有其他 packages 依賴
- **Feature packages**: 功能 packages，只依賴 shared package，彼此獨立

### 3. 命名規範

所有 packages 使用 `@packages/` 命名空間：

- `@packages/shared` - 共享工具和類型
- `@packages/ai-analyzer` - AI 分析器
- `@packages/ai-dictionary` - AI 字典
- `@packages/blog` - 部落格
- `@packages/resume` - 履歷
- `@packages/time-tracker` - 時間追蹤
- `@packages/about` - 關於頁面
- `@packages/not-found` - 404 頁面

## Components and Interfaces

### 1. Shared Package (@packages/shared)

**目的**: 提供所有 feature packages 共用的工具、類型和常數

**結構**:

```
packages/shared/
├── src/
│   ├── components/        # 共享 UI 組件
│   │   ├── AnimatedWrapper.tsx
│   │   └── index.ts
│   ├── utils/            # 工具函數
│   │   ├── cn.ts
│   │   └── index.ts
│   ├── types/            # 共享類型
│   │   ├── common.types.ts
│   │   └── index.ts
│   ├── constants/        # 共享常數
│   │   ├── routes.ts
│   │   ├── socialLinks.ts
│   │   └── index.ts
│   └── index.ts          # 主要 export
├── package.json
├── tsconfig.json
└── README.md
```

**Public API**:

```typescript
// packages/shared/src/index.ts
export * from "./components";
export * from "./utils";
export * from "./types";
export * from "./constants";
```

### 2. Feature Package 標準結構

每個 feature package 遵循統一的結構：

```
packages/{feature-name}/
├── src/
│   ├── components/       # 功能專用組件
│   ├── hooks/           # 功能專用 hooks
│   ├── types/           # 功能專用類型
│   ├── constants/       # 功能專用常數
│   ├── utils/           # 功能專用工具
│   ├── services/        # API 服務邏輯 (新增)
│   ├── {FeatureName}Feature.tsx  # 主要組件
│   └── index.ts         # Public API
├── package.json
├── tsconfig.json
└── README.md
```

**Public API 範例**:

```typescript
// packages/ai-analyzer/src/index.ts
export { AIAnalyzerFeature } from "./AIAnalyzerFeature";
export { analyzeWithAI } from "./services";
export type * from "./types";
```

**API 服務整合範例**:

```typescript
// packages/ai-analyzer/src/services/aiAnalyzer.service.ts
export async function analyzeWithAI(need: string, prompt: string) {
  // 原本在 API route 中的邏輯
}

// apps/my-website/src/app/api/ai-analyzer/route.ts
import { analyzeWithAI } from "@packages/ai-analyzer";

export async function POST(request: NextRequest) {
  const { need, prompt } = await request.json();
  const result = await analyzeWithAI(need, prompt);
  return NextResponse.json(result);
}
```

### 3. 主應用簡化

**my-website 應用職責**:

- Next.js 路由管理
- 全域 layout 組件 (Navbar, Footer)
- 全域狀態管理 (如果需要)
- 環境配置和提供者
- API 路由聚合和代理

**簡化後結構**:

```
apps/my-website/
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API 路由聚合
│   │   │   ├── ai-analyzer/
│   │   │   ├── define/
│   │   │   └── medium-articles/
│   │   ├── layout.tsx   # 根 layout
│   │   ├── page.tsx     # 首頁
│   │   └── {route}/     # 各功能路由
│   └── components/      # 僅保留 layout 相關
│       ├── layout/
│       └── providers/
├── package.json
└── tsconfig.json
```

### 4. API 路由處理策略

**選項 1: API 路由保留在主應用** (推薦)

- API 路由繼續放在 `apps/my-website/src/app/api/`
- 但將 API 邏輯抽取到對應的 feature packages
- 主應用的 API 路由只負責路由和調用 feature packages 的服務

**選項 2: API 路由移到 feature packages**

- 每個 feature package 包含自己的 API 邏輯
- 主應用通過某種機制聚合這些 API

**推薦使用選項 1 的原因**:

- Next.js API 路由需要在 app 目錄下
- 保持 API 路由的統一管理
- 避免複雜的路由聚合邏輯

## API Integration Strategy

### 1. API 路由與 Feature 的對應關係

| API 路由               | 對應 Feature              | 說明            |
| ---------------------- | ------------------------- | --------------- |
| `/api/ai-analyzer`     | `@packages/ai-analyzer`   | AI 分析功能     |
| `/api/define`          | `@packages/ai-dictionary` | AI 字典查詢     |
| `/api/medium-articles` | `@packages/blog`          | Medium 文章獲取 |

### 2. API 重構策略

**重構前**:

```
apps/my-website/src/app/api/
├── ai-analyzer/route.ts     # 包含完整業務邏輯
├── define/route.ts          # 包含完整業務邏輯
└── medium-articles/route.ts # 包含完整業務邏輯
```

**重構後**:

```
# API 路由 (保留在主應用)
apps/my-website/src/app/api/
├── ai-analyzer/route.ts     # 只負責路由和調用服務
├── define/route.ts          # 只負責路由和調用服務
└── medium-articles/route.ts # 只負責路由和調用服務

# 業務邏輯 (移到對應 packages)
packages/ai-analyzer/src/services/
packages/ai-dictionary/src/services/
packages/blog/src/services/
```

### 3. 服務層抽取範例

**AI Analyzer 服務**:

```typescript
// packages/ai-analyzer/src/services/aiAnalyzer.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_2_5_FLASH_LITE } from "../constants";

export async function analyzeWithAI(need: string, prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("伺服器設定錯誤：缺少 GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

  const result = await model.generateContent(`${prompt}\n\n用戶需求：${need}`);
  const response = await result.response;

  return {
    analysisResult: response.text(),
  };
}
```

**簡化的 API 路由**:

```typescript
// apps/my-website/src/app/api/ai-analyzer/route.ts
import { analyzeWithAI } from "@packages/ai-analyzer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { need, prompt } = await request.json();

    if (!need || !prompt) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const result = await analyzeWithAI(need, prompt);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "分析失敗，請稍後再試",
      },
      { status: 500 },
    );
  }
}
```

### 4. 環境變數和配置

由於 API 服務需要存取環境變數，需要考慮：

**選項 1: 在主應用中處理環境變數**

- API 路由讀取環境變數
- 將必要的配置傳遞給 package 服務

**選項 2: Package 直接讀取環境變數**

- 需要確保 packages 能存取到環境變數
- 可能需要額外的配置管理

推薦使用選項 1，保持環境變數的統一管理。

## Data Models

### 1. Package.json 結構

**Shared Package**:

```json
{
  "name": "@packages/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src",
    "check-types": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**Feature Package**:

```json
{
  "name": "@packages/ai-analyzer",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@packages/shared": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**主應用**:

```json
{
  "name": "my-website",
  "dependencies": {
    "@packages/shared": "workspace:*",
    "@packages/ai-analyzer": "workspace:*",
    "@packages/ai-dictionary": "workspace:*",
    "@packages/blog": "workspace:*",
    "@packages/resume": "workspace:*",
    "@packages/time-tracker": "workspace:*",
    "@packages/about": "workspace:*",
    "@packages/not-found": "workspace:*"
  }
}
```

### 2. TypeScript 配置

**根目錄 tsconfig.json**:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@packages/*": ["packages/*/src"]
    }
  }
}
```

**Package tsconfig.json**:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

## Error Handling

### 1. 依賴管理錯誤

**問題**: Package 之間的循環依賴
**解決方案**:

- 使用依賴圖分析工具
- 將共享邏輯提取到 shared package
- 嚴格的 import 規則檢查

### 2. 版本衝突

**問題**: 不同 packages 依賴不同版本的相同套件
**解決方案**:

- 使用 peerDependencies 管理共享依賴
- 在根目錄統一管理版本
- 使用 workspace 協議

### 3. 構建失敗

**問題**: Package 構建順序或依賴問題
**解決方案**:

- Turbo 自動處理構建順序
- 明確的 build 依賴關係
- 增量構建和緩存

## Testing Strategy

### 1. Package 級別測試

每個 package 包含自己的測試：

```
packages/{feature}/
├── src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── jest.config.js
```

### 2. 整合測試

在主應用中測試 packages 的整合：

```
apps/my-website/
├── __tests__/
│   ├── integration/
│   └── e2e/
└── jest.config.js
```

### 3. 測試工具配置

**Jest 配置**:

```javascript
// packages/{feature}/jest.config.js
module.exports = {
  preset: "../../jest.preset.js",
  testEnvironment: "jsdom",
  moduleNameMapping: {
    "^@packages/(.*)$": "<rootDir>/../../packages/$1/src",
  },
};
```

### 4. CI/CD 整合

**Turbo 測試配置**:

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Migration Strategy

### 1. 漸進式遷移

**階段 1**: 建立基礎設施

- 創建 packages 目錄結構
- 設置 shared package
- 配置 workspace 和 Turbo

**階段 2**: 遷移獨立功能

- 從最簡單的功能開始 (about, not-found)
- 逐一遷移複雜功能 (ai-analyzer, blog 等)
- 每次遷移後進行完整測試

**階段 3**: 優化和清理

- 移除舊的 features 目錄
- 優化 import 路徑
- 更新文檔和配置

### 2. 風險控制

- 每次只遷移一個 feature
- 保持功能分支進行測試
- 自動化測試確保功能一致性
- 可回滾的遷移步驟

這個設計確保了重構過程的安全性和可維護性，同時展示了現代 monorepo 的最佳實踐。
