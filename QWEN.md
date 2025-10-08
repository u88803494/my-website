# Qwen Code 專案上下文

參照 .cursorrules 文件內容實作，並且強制用繁體中文回應！！！

## 專案概覽

這是一個使用 **Turborepo** 與 **pnpm workspace** 的 **Monorepo 架構**專案，主要包含個人網站應用程式 `apps/my-website`。專案目標是展示專業技能、工作經驗、專案作品，並整合 Medium 文章自動化管理系統與 AI 字典功能。

### 核心技術棧

- **Next.js 15** - React 框架，支援 App Router
- **TypeScript** - 型別安全的 JavaScript
- **Tailwind CSS** - 原子級 CSS 框架
- **React Query** - 服務器狀態管理
- **pnpm** - 高效能包管理器
- **Turborepo** - 工作區和任務管理
- **Google Gemini API** - AI 字詞分析功能

### 專案結構

```
/
├── apps/
│   └── my-website/ (Next.js 15 個人官網)
├── packages/
│   ├── about
│   ├── not-found
│   └── shared (共享組件和工具)
├── scripts/ (自動化腳本)
├── public/ (靜態資源)
├── src/ (源代碼)
│   └── features/ (功能組件)
└── docs/ (文檔)
```

### 主要功能

1. **履歷展示** - 響應式設計，現代化 UI，動態效果
2. **Medium 文章自動化系統** - 最新文章自動同步，精選文章輪播展示
3. **AI 字典功能** - 查詢結果可標記學習完成，支援撤銷和動畫特效
4. **時間追蹤器** - 週統計頁面，活動分類追蹤

## 建置與運行

### 前置需求

- Node.js 18+
- pnpm (推薦)
- Google Gemini API Key (AI 字典功能需要)

### 安裝與啟動

```bash
# 在專案根目錄安裝依賴
pnpm install

# 開發模式 (啟動 Turborepo TUI)
pnpm dev

# 檢查程式碼 (包含 TypeScript 檢查、ESLint、格式化)
pnpm check

# 建置專案
pnpm build

# 格式化程式碼
pnpm format
```

### 環境變數設定

```bash
# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 並添加 GEMINI_API_KEY
```

## 開發慣例

### 組件架構

- 採用 **Feature-based 架構** - 各功能模組獨立封裝
- 組件命名採用 `*Feature.tsx` 模式
- 智能組件模式，內部調用以減少不必要的抽象

### 代碼品質

- TypeScript 嚴格模式 (strict: true)
- ESLint 檢查 (包括 --max-warnings=0)
- Prettier 格式化
- lint-staged 配置確保提交前檢查

### 共享資源

- `packages/shared` 包含共享組件和工具
- 集中的常量管理，避免重複定義和魔法數字

## 重要配置文件

1. `package.json` - Turborepo 與工作區設定
2. `turbo.json` - Turborepo 工作流程配置
3. `pnpm-workspace.yaml` - 工作區定義 (apps/_, packages/_)
4. `tsconfig.json` - TypeScript 基礎配置，引用各子目錄的 tsconfig
5. `apps/my-website/package.json` - 主應用程式配置

## 特殊功能說明

### Medium 文章自動化

- `scripts/batch-parse-articles.js` - 自動化解析腳本
- `scripts/sync-latest-articles.ts` - 同步最新文章腳本
- `src/data/articleData.ts` - 文章資料結構 (自動生成，勿手動編輯)
- `article-urls.json` - Medium 文章 URL 管理

### AI 字典功能

- 使用 Google Gemini API 進行 AI 分析
- 包含查詢歷史管理、多層次查詢結果功能

### 時間追蹤器

- 週統計視圖，可追蹤工作、學習、品格等多種活動分類
- 即時統計更新
