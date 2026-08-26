# Monorepo 重構完整執行計劃

> ⚠️ **DEPRECATED** - This document is a historical record that will be archived.
>
> **Status**: ✅ Completed (2025-10-20)
>
> **For current architecture**: See [docs/reference/architecture.md](../reference/architecture.md)
>
> This file will be moved to `docs/archive/` in Phase 6.

---

> **最後更新**: 2025-10-20
> **狀態**: ✅ 已完成
> **完成日期**: 2025-10-20
> **預估時間**: 4-6 小時
> **實際時間**: ~5 小時

---

## 📊 實際執行結果

### ✅ 完成項目

#### 1. Package 抽離與重構

- ✅ 創建 `@packages/blog` (21 files, 752+ insertions)
- ✅ 創建 `@packages/ai-dictionary` (32 files, 1183+ insertions)
- ✅ 創建 `@packages/ai-analyzer` (17 files, 586+ insertions)
- ✅ 創建 `@packages/tailwind-config` (解決 Tailwind v4 掃描問題)
- ✅ 清理空的 `packages/about` 和 `packages/not-found`
- ✅ 更新 `@packages/shared` exports 和依賴

#### 2. Git 提交優化

- ✅ 將原本 1 個大 commit (116 files) 拆分成 10 個 atomic commits
- ✅ 遵循 Conventional Commits 規範
- ✅ 所有 commits 通過 pre-commit hooks 和 TypeScript 檢查

#### 3. Tailwind CSS 配置集中化

- **問題**: Tailwind v4 自動掃描只支援子目錄，不支援 sibling directories
- **解決方案**: 創建集中式 `@packages/tailwind-config` package
- **配置**: 使用 `@source` 指令明確掃描 `packages/` 和 `apps/`
- **結果**: DaisyUI 樣式成功載入，所有頁面樣式正常

#### 4. 代碼品質驗證

- ✅ `pnpm install` - 所有依賴正確安裝
- ✅ `pnpm check-types` - TypeScript 類型檢查通過
- ✅ Build 驗證通過 (在關鍵 commits 後驗證)
- ✅ Dev server 正常運行 (port 3002)

### 📝 Git Commits 歷史

```
3da6b1d refactor(monorepo): centralize Tailwind CSS configuration
a0fc826 refactor(shared): update exports and dependencies
4fdf1df chore: remove not-found package
16c0bdb chore: remove empty about package
be162ef refactor(app): remove obsolete feature exports
90176f9 refactor(app): update imports to use extracted packages
a6974e6 feat(ai-analyzer): extract AI analyzer feature into independent package
49fb6b7 feat(ai-dictionary): extract AI dictionary feature into independent package
4dc42a2 feat(blog): extract blog feature into independent package
203b4fd docs: add comprehensive monorepo refactoring plan
```

### 🎯 架構決策

#### Web 專屬 Features（保留在 app 內）

- `features/resume/` - 個人履歷頁面
- `features/about/` - 個人介紹頁面
- `features/not-found/` - 404 頁面
- `features/time-tracker/` - 專用時間追蹤工具

#### 可重用 Packages（已抽離）

- `@packages/blog` - Medium 文章整合
- `@packages/ai-dictionary` - AI 字典工具
- `@packages/ai-analyzer` - AI 分析工具
- `@packages/shared` - 共享工具和組件
- `@packages/tailwind-config` - 集中式 Tailwind 配置

### ⚠️ 關鍵學習

1. **Tailwind v4 限制**: 自動掃描不支援 monorepo sibling directories
2. **解決方案**: 使用 `@source` 指令明確掃描路徑
3. **Commit 規範**: 小而專注的 commits 更易審查和回溯
4. **Workspace 協議**: 使用 `workspace:*` 保持內部依賴同步

---

## 📋 專案架構定義

### Web 專屬 Features（保留在 app 內）

這些功能高度客製化，不適合抽離為 package：

- **`features/resume/`** - Henry Lee 個人履歷頁面
- **`features/about/`** - Henry Lee 個人介紹頁面
- **`features/not-found/`** - 404 頁面（有品牌設計）
- **`features/time-tracker/`** - 高雄機構職員專用工具（加速員使用）

### 可重用 Packages（需要抽離）

這些功能邏輯獨立、可被其他專案重用：

- **`@packages/blog`** - 部落格功能（Medium 整合）
- **`@packages/ai-dictionary`** - AI 字典工具
- **`@packages/ai-analyzer`** - AI 分析工具

---

## Part 1: 補完 .kiro 文檔 (30 分鐘)

### 1.1 更新 `.kiro/specs/monorepo-feature-extraction/design.md`

**新增 Section: Web 專屬 Features 的識別與處理**

```markdown
### 5. Web 專屬 Features 的識別與處理

**判斷標準**：

- 內容高度客製化，不可能被其他網站重用
- 包含個人化數據或品牌特定設計
- 為特定客戶/機構開發的功能

**保留在 app 內的 features**：

- `resume/` - 個人履歷，100% 客製化
- `about/` - 個人介紹頁面，100% 客製化
- `not-found/` - 404 頁面，通常有品牌設計
- `time-tracker/` - 高雄機構職員專用工具

**修正說明**：
如果 about/not-found 被誤抽離到 packages/，需要移回：

- 從 `packages/about` 移回 `apps/my-website/src/features/about`
- 從 `packages/not-found` 移回 `apps/my-website/src/features/not-found`
- 更新 workspace 配置移除這些 packages
```

**新增 Section: Prompts 管理策略**

```markdown
### 6. Prompts 和配置文件管理

**策略**: Prompts 應該放在對應的 feature package 內

**結構**：
```

packages/ai-dictionary/
└── src/
└── prompts/
└── dictionary.prompt.ts

packages/ai-analyzer/
└── src/
└── prompts/
└── analyzer.prompt.ts

```

**理由**：
- Prompts 是業務邏輯的一部分
- 便於 package 的獨立性和可重用性
- 更容易維護和測試
```

**新增 Section: 環境變數處理模式**

````markdown
### 7. 環境變數和配置管理

**推薦模式**: API route 讀取環境變數，傳遞給 service 函數

**範例**：

```typescript
// Package service 簽名
export async function analyzeWord(
  word: string,
  apiKey: string,
): Promise<WordAnalysisResponse> {
  // Service 通過參數接收 API key
}

// API route 處理
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const result = await analyzeWord(word, apiKey);
}
```
````

**優點**：

- Package 保持純淨，不直接依賴環境變數
- 更容易測試（可以傳入 mock API key）
- 環境變數管理集中在主應用

````

**新增 Section: Package Build 策略**

```markdown
### 8. Package Build 和開發模式

**推薦**: 開發階段直接使用 TypeScript source

**package.json 配置**：
```json
{
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./services": "./src/services/index.ts"
  }
}
````

**優點**：

- 開發更快速，無需等待 build
- Hot reload 更即時
- 簡化 monorepo 配置
- Next.js 的 Turbopack 能直接處理 TS

**未來考慮**：

- 如果要發布到 npm，再添加 build 流程
- 目前是內部 monorepo，不需要 build

````

### 1.2 更新 `.kiro/specs/monorepo-feature-extraction/tasks.md`

**新增 Task 0: 修正錯誤結構**

```markdown
## Task 0: 修正錯誤結構

### 0.1 移回 Web 專屬 features
- [ ] 備份 `packages/about` 和 `packages/not-found`
- [ ] 比較差異，確認是否有更新內容
- [ ] 將差異合併到 `apps/my-website/src/features/about/`
- [ ] 將差異合併到 `apps/my-website/src/features/not-found/`
- [ ] 刪除 `packages/about` 和 `packages/not-found` 目錄
- [ ] 驗證 app 使用的是 `@/features/about` 和 `@/features/not-found`
- _Requirements: 設計修正_

### 0.2 更新 workspace 配置
- [ ] 從根 `package.json` 的 workspaces 移除 "packages/about" 和 "packages/not-found"
- [ ] 運行 `pnpm install` 更新 lockfile
- [ ] 測試 `pnpm check-types` 和 `pnpm build` 通過
- _Requirements: 配置修正_
````

**更新 Task 3: 移除 Time Tracker 抽離任務**

```markdown
## Task 3: 遷移可重用功能 packages

~~3.4 創建並遷移 @packages/time-tracker package~~ **已移除**

**說明**: Time Tracker 是高雄機構職員專用工具，保留在 `apps/my-website/src/features/time-tracker`

只需完成：

- [ ] 3.1 創建並遷移 @packages/blog package
- [ ] 3.2 創建並遷移 @packages/ai-dictionary package
- [ ] 3.3 創建並遷移 @packages/ai-analyzer package
```

**更新 Task 3.1: Blog Package（詳細步驟）**

```markdown
## Task 3.1: 創建並遷移 @packages/blog package

### 3.1.1 創建 package 結構

- [ ] 創建 `packages/blog` 目錄
- [ ] 創建 `src/` 子目錄結構: components/, hooks/, types/, services/
- [ ] 創建 `package.json` (main: "./src/index.ts")
- [ ] 創建 `tsconfig.json` (extends @packages/tsconfig/base.json)
- [ ] 創建 `README.md`

### 3.1.2 遷移 BlogFeature 組件

- [ ] 複製 `apps/my-website/src/features/blog/BlogFeature.tsx` → `packages/blog/src/`
- [ ] 複製 `apps/my-website/src/features/blog/components/` → `packages/blog/src/components/`
- [ ] 複製 `apps/my-website/src/features/blog/hooks/` → `packages/blog/src/hooks/`
- [ ] 複製 `apps/my-website/src/features/blog/types/` → `packages/blog/src/types/`

### 3.1.3 創建 Public API

- [ ] 創建 `packages/blog/src/index.ts` 導出主要組件和類型

### 3.1.4 處理 Medium Articles API (可選)

- [ ] 檢查 `/api/medium-articles/route.ts` 是否有業務邏輯需要抽離
- [ ] 如果有，創建 `packages/blog/src/services/mediumArticles.service.ts`
- [ ] 簡化 API route

### 3.1.5 更新主應用

- [ ] 刪除 `apps/my-website/src/features/blog/` 目錄
- [ ] 更新 `apps/my-website/src/app/blog/page.tsx`:
  - `import { BlogFeature } from "@/features/blog"`
  - → `import { BlogFeature } from "@packages/blog"`
- [ ] 更新根 `package.json` dependencies 添加: `"@packages/blog": "workspace:*"`
- [ ] 運行 `pnpm install`
- [ ] 測試 blog 頁面正常運行
- _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_
```

**更新 Task 3.2: AI Dictionary Package（詳細步驟）**

```markdown
## Task 3.2: 創建並遷移 @packages/ai-dictionary package

### 3.2.1 創建 package 結構

- [ ] 創建 `packages/ai-dictionary` 目錄
- [ ] 創建 `src/` 子目錄: components/, hooks/, types/, prompts/, services/, utils/
- [ ] 創建 `package.json` (依賴 @google/generative-ai)
- [ ] 創建 `tsconfig.json`
- [ ] 創建 `README.md`

### 3.2.2 遷移組件和邏輯

- [ ] 複製 `apps/my-website/src/features/ai-dictionary/AIDictionaryFeature.tsx`
- [ ] 複製 `apps/my-website/src/features/ai-dictionary/components/`
- [ ] 複製 `apps/my-website/src/features/ai-dictionary/hooks/`
- [ ] 複製 `apps/my-website/src/features/ai-dictionary/types/`

### 3.2.3 抽離 Prompts 到 Package（A 方案）

- [ ] 移動 `apps/my-website/src/lib/prompts/dictionary.prompt.ts`
  - → `packages/ai-dictionary/src/prompts/dictionary.prompt.ts`
- [ ] 創建 `packages/ai-dictionary/src/prompts/index.ts` 導出

### 3.2.4 抽離 API 業務邏輯

- [ ] 創建 `packages/ai-dictionary/src/services/dictionary.service.ts`
- [ ] 實現 `analyzeWord(word: string, apiKey: string)` 函數
  - 從 API route 移動主要邏輯
  - 參數接收 apiKey（A 方案）
- [ ] 移動 `cleanAIResponse` 到 `packages/ai-dictionary/src/utils/cleanAIResponse.ts`
- [ ] 移動 `validateResponse` 到 `packages/ai-dictionary/src/utils/validateResponse.ts`
- [ ] 創建 `packages/ai-dictionary/src/services/index.ts` 導出
- [ ] 創建 `packages/ai-dictionary/src/utils/index.ts` 導出

### 3.2.5 簡化 API Route

- [ ] 更新 `apps/my-website/src/app/api/define/route.ts`
- [ ] Import: `import { analyzeWord } from "@packages/ai-dictionary/services"`
- [ ] API route 只負責:
  - 讀取 `process.env.GEMINI_API_KEY`
  - 驗證輸入參數
  - 調用 `analyzeWord(word, apiKey)`
  - 處理錯誤並返回結果

### 3.2.6 更新主應用

- [ ] 刪除 `apps/my-website/src/features/ai-dictionary/` 目錄
- [ ] 刪除 `apps/my-website/src/lib/prompts/dictionary.prompt.ts`
- [ ] 更新 `apps/my-website/src/app/ai-dictionary/page.tsx` 的 import
- [ ] 更新根 `package.json` 添加依賴: `"@packages/ai-dictionary": "workspace:*"`
- [ ] 運行 `pnpm install`
- [ ] 測試 AI Dictionary 功能正常
- _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_
```

**更新 Task 3.3: AI Analyzer Package（詳細步驟）**

```markdown
## Task 3.3: 創建並遷移 @packages/ai-analyzer package

### 3.3.1 創建 package 結構

- [ ] 創建 `packages/ai-analyzer` 目錄
- [ ] 創建 `src/` 子目錄: components/, hooks/, types/, prompts/, services/
- [ ] 創建 `package.json` (依賴 @google/generative-ai)
- [ ] 創建 `tsconfig.json`
- [ ] 創建 `README.md`

### 3.3.2 遷移組件和邏輯

- [ ] 複製 `apps/my-website/src/features/ai-analyzer/AIAnalyzerFeature.tsx`
- [ ] 複製 `apps/my-website/src/features/ai-analyzer/components/`
- [ ] 複製 `apps/my-website/src/features/ai-analyzer/hooks/`
- [ ] 複製 `apps/my-website/src/features/ai-analyzer/types/`

### 3.3.3 抽離 Prompts（如果有的話）

- [ ] 檢查 `apps/my-website/src/lib/prompts/` 是否有 analyzer 相關 prompts
- [ ] 如果有，移動到 `packages/ai-analyzer/src/prompts/`
- [ ] 如果 prompts 直接寫在 hooks 內，可以保持原樣或抽離

### 3.3.4 抽離 API 業務邏輯

- [ ] 創建 `packages/ai-analyzer/src/services/aiAnalyzer.service.ts`
- [ ] 實現 `analyzeWithAI(need: string, prompt: string, apiKey: string)`
  - 從 API route 移動主要邏輯
  - 參數接收 apiKey（A 方案）
- [ ] 創建 `packages/ai-analyzer/src/services/index.ts` 導出

### 3.3.5 簡化 API Route

- [ ] 更新 `apps/my-website/src/app/api/ai-analyzer/route.ts`
- [ ] Import: `import { analyzeWithAI } from "@packages/ai-analyzer/services"`
- [ ] API route 只負責:
  - 讀取環境變數
  - 驗證輸入
  - 調用 service
  - 返回結果

### 3.3.6 更新主應用

- [ ] 刪除 `apps/my-website/src/features/ai-analyzer/` 目錄
- [ ] 刪除相關 prompts（如果有）
- [ ] 更新 `apps/my-website/src/app/ai-analyzer/page.tsx` 的 import
- [ ] 更新根 `package.json` 添加依賴: `"@packages/ai-analyzer": "workspace:*"`
- [ ] 運行 `pnpm install`
- [ ] 測試 AI Analyzer 功能正常
- _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_
```

**更新 Task 4.1: 確保 Web 專屬 features 功能完整**

```markdown
## Task 4.1: 確保 Web 專屬 features 功能完整

- [ ] 測試 `features/resume/` 所有子頁面和功能
  - [ ] Hero Section
  - [ ] Work Experience
  - [ ] Featured Projects
  - [ ] Medium Articles
  - [ ] **Skills Section (包含新配色: 綠/紫藍/青色)**
  - [ ] Education
  - [ ] Contact
- [ ] 測試 `features/about/` 頁面
- [ ] 測試 `features/not-found/` 404 頁面
- [ ] 測試 `features/time-tracker/` 完整功能（主視圖、週統計、設定）
- [ ] 驗證所有 @/features/\* imports 正確
- _Requirements: 1.4, 3.3_
```

---

## Part 2: 執行 Monorepo 重構 (4-6 小時)

### Phase 0: 修正錯誤結構 (30 分鐘)

#### 0.1 移回 Web 專屬 features

```bash
# 1. 比較差異
diff -r packages/about/src apps/my-website/src/features/about
diff -r packages/not-found/src apps/my-website/src/features/not-found

# 2. 如果有差異，手動合併更新的內容

# 3. 刪除 packages
rm -rf packages/about
rm -rf packages/not-found

# 4. 驗證 imports
grep -r "@packages/about" apps/my-website/src  # 應該沒有結果
grep -r "@packages/not-found" apps/my-website/src  # 應該沒有結果
grep -r "@/features/about" apps/my-website/src  # 應該有結果
grep -r "@/features/not-found" apps/my-website/src  # 應該有結果
```

#### 0.2 更新 workspace 配置

```bash
# 編輯根 package.json，移除 workspaces 中的:
# - "packages/about"
# - "packages/not-found"

# 重新安裝依賴
pnpm install

# 測試
pnpm check-types
pnpm build
```

---

### Phase 1: 創建 @packages/blog (1 小時)

#### 1.1 創建 package 結構

```bash
mkdir -p packages/blog/src/{components,hooks,types,services}
```

**創建 `packages/blog/package.json`**:

```json
{
  "name": "@packages/blog",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./services": "./src/services/index.ts"
  },
  "scripts": {
    "lint": "eslint src --fix",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@packages/shared": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5"
  },
  "devDependencies": {
    "@packages/eslint-config": "workspace:*",
    "@packages/tsconfig": "workspace:*",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "typescript": "^5"
  }
}
```

**創建 `packages/blog/tsconfig.json`**:

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

**創建 `packages/blog/README.md`**:

```markdown
# @packages/blog

部落格功能 package，整合 Medium 文章展示。

## 功能

- Medium 文章列表展示
- 文章卡片組件
- 響應式網格布局

## 使用方式

\`\`\`typescript
import { BlogFeature } from "@packages/blog";

export default function BlogPage() {
return <BlogFeature />;
}
\`\`\`

## API

- `BlogFeature` - 主要組件
- `useMediumArticles` - 獲取文章的 hook
```

#### 1.2 遷移文件

```bash
# 複製所有內容
cp -r apps/my-website/src/features/blog/* packages/blog/src/

# 創建 index.ts
cat > packages/blog/src/index.ts << 'EOF'
export { default as BlogFeature } from "./BlogFeature";
export * from "./hooks";
export type * from "./types";
EOF
```

#### 1.3 更新主應用

```bash
# 更新 blog page
# 編輯 apps/my-website/src/app/blog/page.tsx
# 將 import { BlogFeature } from "@/features/blog";
# 改為 import { BlogFeature } from "@packages/blog";

# 刪除舊的 feature 目錄
rm -rf apps/my-website/src/features/blog

# 更新根 package.json
# 在 dependencies 中添加: "@packages/blog": "workspace:*"

# 安裝並測試
pnpm install
pnpm dev  # 測試 blog 頁面
```

---

### Phase 2: 創建 @packages/ai-dictionary (1.5 小時)

#### 2.1 創建 package 結構

```bash
mkdir -p packages/ai-dictionary/src/{components,hooks,types,prompts,services,utils}
```

**創建 `packages/ai-dictionary/package.json`**:

```json
{
  "name": "@packages/ai-dictionary",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./services": "./src/services/index.ts"
  },
  "scripts": {
    "lint": "eslint src --fix",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@packages/shared": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5"
  },
  "devDependencies": {
    "@packages/eslint-config": "workspace:*",
    "@packages/tsconfig": "workspace:*",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "typescript": "^5"
  }
}
```

**創建 `packages/ai-dictionary/tsconfig.json`**:

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

#### 2.2 遷移組件

```bash
# 複製組件、hooks、types
cp -r apps/my-website/src/features/ai-dictionary/* packages/ai-dictionary/src/

# 移動 prompts
cp apps/my-website/src/lib/prompts/dictionary.prompt.ts packages/ai-dictionary/src/prompts/

# 創建 prompts/index.ts
cat > packages/ai-dictionary/src/prompts/index.ts << 'EOF'
export { buildDictionaryPrompt } from "./dictionary.prompt";
EOF
```

#### 2.3 創建 Service

**創建 `packages/ai-dictionary/src/services/dictionary.service.ts`**:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GEMINI_2_5_FLASH_LITE,
  MAX_WORD_LENGTH,
} from "@packages/shared/constants";
import type { WordAnalysisResponse } from "@packages/shared/types";

import { buildDictionaryPrompt } from "../prompts";
import { cleanAIResponse, validateResponse } from "../utils";

export async function analyzeWord(
  word: string,
  apiKey: string,
): Promise<WordAnalysisResponse> {
  // 1. 驗證輸入
  if (!word || typeof word !== "string") {
    throw new Error("請提供有效的中文詞彙");
  }

  if (word.length > MAX_WORD_LENGTH) {
    throw new Error(`查詢詞彙過長，請勿超過 ${MAX_WORD_LENGTH} 個字元。`);
  }

  // 2. 初始化 AI
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

  // 3. 調用 AI
  const prompt = buildDictionaryPrompt(word);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // 4. 處理回應
  const cleanedText = cleanAIResponse(text);

  try {
    const parsedResponse: WordAnalysisResponse = JSON.parse(cleanedText);

    if (!validateResponse(parsedResponse)) {
      console.error("AI 回應資料結構不完整:", parsedResponse);
      throw new Error("AI 回應資料結構不完整");
    }

    return parsedResponse;
  } catch (parseError) {
    console.error("JSON 解析失敗:", parseError);
    console.error("原始文字:", text);
    console.error("清理後:", cleanedText);
    throw new Error("AI 回應格式錯誤");
  }
}
```

**創建 `packages/ai-dictionary/src/services/index.ts`**:

```typescript
export { analyzeWord } from "./dictionary.service";
```

#### 2.4 創建 Utils

從 API route 複製 `cleanAIResponse` 和 `validateResponse` 函數到:

- `packages/ai-dictionary/src/utils/cleanAIResponse.ts`
- `packages/ai-dictionary/src/utils/validateResponse.ts`

**創建 `packages/ai-dictionary/src/utils/index.ts`**:

```typescript
export { cleanAIResponse } from "./cleanAIResponse";
export { validateResponse } from "./validateResponse";
```

#### 2.5 簡化 API Route

**更新 `apps/my-website/src/app/api/define/route.ts`**:

```typescript
import { analyzeWord } from "@packages/ai-dictionary/services";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "此 API 僅支援 POST 請求" },
    { status: 405 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    // 讀取環境變數
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("伺服器設定錯誤：缺少 GEMINI_API_KEY");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    // 調用 service
    const result = await analyzeWord(word, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API 處理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
```

#### 2.6 更新主應用

```bash
# 創建 index.ts
cat > packages/ai-dictionary/src/index.ts << 'EOF'
export { default as AIDictionaryFeature } from "./AIDictionaryFeature";
export * from "./hooks";
export type * from "./types";
export * from "./services";
EOF

# 更新 page.tsx import
# apps/my-website/src/app/ai-dictionary/page.tsx
# 從 @/features/ai-dictionary → @packages/ai-dictionary

# 刪除舊文件
rm -rf apps/my-website/src/features/ai-dictionary
rm apps/my-website/src/lib/prompts/dictionary.prompt.ts

# 更新根 package.json 添加依賴
pnpm install
pnpm dev  # 測試
```

---

### Phase 3: 創建 @packages/ai-analyzer (1 小時)

#### 3.1 創建 package 結構

```bash
mkdir -p packages/ai-analyzer/src/{components,hooks,types,prompts,services}
```

**創建 `packages/ai-analyzer/package.json`** (類似 ai-dictionary):

```json
{
  "name": "@packages/ai-analyzer",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./services": "./src/services/index.ts"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@packages/shared": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5"
  }
}
```

#### 3.2 遷移組件

```bash
cp -r apps/my-website/src/features/ai-analyzer/* packages/ai-analyzer/src/
```

#### 3.3 檢查並遷移 Prompts

```bash
# 檢查是否有 analyzer prompts
ls apps/my-website/src/lib/prompts/*analyzer*

# 如果有，移動到 package
# 如果沒有（prompts 可能在 hooks 內），保持原樣
```

#### 3.4 創建 Service

**創建 `packages/ai-analyzer/src/services/aiAnalyzer.service.ts`**:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_2_5_FLASH_LITE } from "@packages/shared/constants";

export async function analyzeWithAI(
  need: string,
  prompt: string,
  apiKey: string,
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

  const result = await model.generateContent(`${prompt}\n\n用戶需求：${need}`);
  const response = await result.response;

  return {
    analysisResult: response.text(),
  };
}
```

**創建 `packages/ai-analyzer/src/services/index.ts`**:

```typescript
export { analyzeWithAI } from "./aiAnalyzer.service";
```

#### 3.5 簡化 API Route

**更新 `apps/my-website/src/app/api/ai-analyzer/route.ts`**:

```typescript
import { analyzeWithAI } from "@packages/ai-analyzer/services";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { need, prompt } = await request.json();

    if (!need || !prompt) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("伺服器設定錯誤：缺少 GEMINI_API_KEY");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    const result = await analyzeWithAI(need, prompt, apiKey);
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

#### 3.6 更新主應用

```bash
# 創建 index.ts
cat > packages/ai-analyzer/src/index.ts << 'EOF'
export { default as AIAnalyzerFeature } from "./AIAnalyzerFeature";
export * from "./hooks";
export type * from "./types";
export * from "./services";
EOF

# 更新 page import
# 刪除舊目錄
rm -rf apps/my-website/src/features/ai-analyzer

# 更新依賴
pnpm install
pnpm dev  # 測試
```

---

### Phase 4: 測試與驗證 (1 小時)

#### 4.1 功能測試清單

```bash
# 啟動開發服務器
pnpm dev

# 手動測試以下頁面：
# ✓ http://localhost:3000 - Resume 頁面
#   - Skills 新配色: 綠/紫藍/青色
# ✓ http://localhost:3000/about - About 頁面
# ✓ http://localhost:3000/blog - Blog 頁面（從 @packages/blog）
# ✓ http://localhost:3000/ai-dictionary - AI Dictionary
# ✓ http://localhost:3000/ai-analyzer - AI Analyzer
# ✓ http://localhost:3000/time-tracker - Time Tracker（保留在 features）
# ✓ http://localhost:3000/not-exist - 404 頁面
```

#### 4.2 代碼品質檢查

```bash
# TypeScript 檢查
pnpm check-types
# 預期: ✓ 所有 packages 和 app 無錯誤

# ESLint 檢查
pnpm lint
# 預期: ✓ 無錯誤，可能有 warnings

# Production Build
pnpm build
# 預期: ✓ Build 成功
```

#### 4.3 驗證 Package 獨立性

```bash
# 檢查 workspace 依賴
cat package.json | grep "@packages"

# 應該看到:
# "@packages/blog": "workspace:*"
# "@packages/ai-dictionary": "workspace:*"
# "@packages/ai-analyzer": "workspace:*"

# 檢查沒有錯誤的 imports
grep -r "@/features/blog" apps/my-website/src  # 應該沒有結果
grep -r "@/features/ai-dictionary" apps/my-website/src  # 應該沒有結果
grep -r "@/features/ai-analyzer" apps/my-website/src  # 應該沒有結果

# 這些應該存在:
grep -r "@packages/blog" apps/my-website/src
grep -r "@packages/ai-dictionary" apps/my-website/src
grep -r "@packages/ai-analyzer" apps/my-website/src
```

---

### Phase 5: 文檔與清理 (30 分鐘)

#### 5.1 更新根目錄 README

**更新專案結構說明**:

```markdown
## 📂 專案結構

### Packages（可重用功能）

這些 packages 包含可被其他專案重用的獨立功能模組：

- **`@packages/shared`** - 共享工具、類型、常數、組件
  - 用途：被所有其他 packages 依賴的基礎設施

- **`@packages/blog`** - 部落格功能
  - 用途：Medium 文章整合、文章列表展示
  - 可重用：任何需要部落格功能的網站

- **`@packages/ai-dictionary`** - AI 字典工具
  - 用途：AI 驅動的詞彙分析和查詢
  - 可重用：任何需要詞典功能的應用

- **`@packages/ai-analyzer`** - AI 分析工具
  - 用途：通用 AI 文本分析
  - 可重用：任何需要 AI 分析的應用

### Features（Web 專屬功能）

這些功能高度客製化，專屬於 my-website 應用：

- **`features/resume/`** - Henry Lee 個人履歷頁面
  - 包含：Hero、Work Experience、Projects、Skills、Education、Contact

- **`features/about/`** - Henry Lee 個人介紹頁面
  - 包含：個人照片、經歷、技術棧展示

- **`features/not-found/`** - 404 頁面
  - 品牌化的錯誤頁面設計

- **`features/time-tracker/`** - 時間追蹤工具
  - 專為高雄機構職員（加速員）開發的專屬工具
  - 包含：時間記錄、週統計、設定功能

### 配置 Packages

- **`@packages/tsconfig`** - 共享 TypeScript 配置
- **`@packages/eslint-config`** - 共享 ESLint 配置
```

#### 5.2 創建 Package READMEs

已在各 Phase 中創建，內容包括：

- 功能說明
- 使用方式
- API 文檔

#### 5.3 更新 .kiro 文檔狀態

在 `tasks.md` 中標記已完成的任務：

```markdown
- [x] 0. 修正錯誤結構
- [x] 1. 建立基礎 monorepo 架構
- [x] 2. 創建 @packages/shared
- [x] 3.1 創建並遷移 @packages/blog
- [x] 3.2 創建並遷移 @packages/ai-dictionary
- [x] 3.3 創建並遷移 @packages/ai-analyzer
- [x] 4. 保持和優化 Web 專用功能
- [x] 5. 配置開發工具和優化
- [x] 6. 測試和驗證
- [x] 7. 文檔和最終優化
```

---

## 📊 最終檢查清單

### ✅ 結構驗證

- [ ] `packages/` 只包含可重用的功能
  - [ ] shared/
  - [ ] blog/
  - [ ] ai-dictionary/
  - [ ] ai-analyzer/
  - [ ] tsconfig/
  - [ ] eslint-config/

- [ ] `apps/my-website/src/features/` 只包含 Web 專屬功能
  - [ ] resume/
  - [ ] about/
  - [ ] not-found/
  - [ ] time-tracker/

### ✅ 依賴驗證

- [ ] 根 `package.json` 的 workspaces 正確
- [ ] 主應用的 dependencies 包含所有 packages
- [ ] 沒有循環依賴

### ✅ 功能驗證

- [ ] 所有頁面正常運作
- [ ] 所有 API endpoints 正常
- [ ] Skills 配色正確（綠/紫藍/青色）
- [ ] Time Tracker 功能完整

### ✅ 代碼品質

- [ ] `pnpm check-types` 通過
- [ ] `pnpm lint` 通過（無錯誤）
- [ ] `pnpm build` 成功

---

## 🎯 執行策略

### 建議順序

1. **Phase 0** (必須先做) - 修正錯誤結構
2. **Phase 1** (簡單，快速驗證) - Blog package
3. **Phase 2** (最複雜) - AI Dictionary package
4. **Phase 3** (中等複雜度) - AI Analyzer package
5. **Phase 4** (驗證) - 測試所有功能
6. **Phase 5** (收尾) - 文檔更新

### 遇到問題時

- 先確保 TypeScript 無錯誤
- 檢查 import paths 是否正確
- 驗證 workspace 依賴是否安裝
- 查看 dev server 的錯誤訊息

---

## 📝 配置決策總結

採用 **A 方案**：

1. **Prompts 位置**: 放在對應的 package 內
   - `packages/ai-dictionary/src/prompts/`
   - `packages/ai-analyzer/src/prompts/`

2. **環境變數處理**: API route 讀取後傳遞給 service
   - Service 函數接收 `apiKey: string` 參數
   - 保持 package 純淨，易於測試

3. **Package Build 模式**: 直接使用 TypeScript source
   - `"main": "./src/index.ts"`
   - 無需 build，開發更快速
   - Next.js Turbopack 直接處理 TS

---

## 🚀 預估完成時間

- Phase 0: 30 分鐘
- Phase 1: 1 小時
- Phase 2: 1.5 小時
- Phase 3: 1 小時
- Phase 4: 1 小時
- Phase 5: 30 分鐘

**總計**: 5.5 小時

考慮測試和問題排查，實際可能需要 **6-7 小時**。

---

## 📌 注意事項

1. **Time Tracker 不抽離** - 保留在 `features/time-tracker`
2. **Skills 配色已完成** - 綠色/紫藍色/青色方案
3. **About/Not-Found** - 從 packages 移回 features
4. **API 業務邏輯** - 抽離到對應 package 的 services
5. **Prompts 管理** - 放在 package 內，便於維護

---

_計劃建立時間: 2025-10-18_
_最後更新: 2025-10-18_
