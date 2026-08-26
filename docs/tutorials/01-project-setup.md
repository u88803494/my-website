---
title: "教學 01：專案設定 - 從零開始到 Hello World"
type: tutorial
status: stable
audience: [developer]
tags: [tutorial, setup, getting-started, monorepo, nextjs]
created: 2025-11-07
updated: 2025-11-07
difficulty: beginner
estimated_time: 45 minutes
prerequisites:
  - Basic knowledge of JavaScript/TypeScript
  - Familiarity with command line
  - Git installed on your machine
related:
  - guides/development-setup.md
  - reference/architecture.md
ai_context: |
  以學習為導向的教學，引導開發者從零開始建立可運作的開發環境，
  並完成第一次程式碼變更的提交。
---

# 教學 01：專案設定

歡迎！在這個教學中，你將從頭開始設定 my-website monorepo，並完成第一次貢獻。完成後，你將擁有一個可運作的開發環境，並理解基本的工作流程。

## 🎯 你將學到什麼

- Clone 並安裝 my-website monorepo
- 理解專案結構
- 啟動開發伺服器
- 進行第一次程式碼變更
- 使用專案的慣例進行 commit
- 瀏覽文件系統

## ⏱️ 預估時間

**45 分鐘**（包含安裝時間）

## 📚 前置需求

- **Node.js 18+** 已安裝（[下載](https://nodejs.org/)）
- **基本的終端機/命令列**知識
- **Git** 已安裝（[下載](https://git-scm.com/)）
- **文字編輯器**（推薦使用 VS Code）

---

## 步驟 1：安裝 pnpm（5 分鐘）

此專案使用 **pnpm** 作為套件管理器。讓我們來安裝它：

```bash
npm install -g pnpm
```

**驗證安裝：**

```bash
pnpm --version
# 應該顯示：8.x.x 或更高版本
```

**為什麼選擇 pnpm？**

- 比 npm/yarn **更快**
- **節省磁碟空間**（使用 hard links）
- **嚴格**的依賴管理（防止 phantom dependencies）

✅ **檢查點**：`pnpm --version` 顯示版本號碼。

---

## 步驟 2：Clone Repository（2 分鐘）

```bash
# 導航到你的專案資料夾
cd ~/projects  # 或是你存放程式碼的任何位置

# Clone repository
git clone https://github.com/u88803494/my-website.git

# 進入專案目錄
cd my-website
```

**探索結構：**

```bash
ls -la
```

你應該會看到：

```
apps/             # 應用程式（my-website）
packages/         # 共用套件
docs/             # 文件（你正在閱讀的內容！）
scripts/          # 建置和工具腳本
.husky/           # Git hooks
pnpm-workspace.yaml
package.json
```

✅ **檢查點**：你位於 `my-website` 目錄內。

---

## 步驟 3：安裝依賴套件（3 分鐘）

```bash
pnpm install
```

**正在進行的動作：**

- 為所有 workspaces 安裝所有依賴套件
- 設定 git hooks（husky）進行 commit 驗證
- 連結內部套件（`@packages/*`）

**預期輸出：**

```
Lockfile is up to date, resolution step is skipped
Packages: +XXX
...
Done in X.Xs
```

✅ **檢查點**：沒有錯誤訊息，依賴套件成功安裝。

---

## 步驟 4：設定環境變數（3 分鐘）

專案需要一些環境變數才能執行。

**建立 `.env.local` 檔案：**

```bash
touch .env.local
```

**加入以下內容：**

```bash
# Development environment
NODE_ENV=development

# Optional: Gemini API (needed for AI features)
# Get your key from: https://ai.google.dev/
GEMINI_API_KEY=your_key_here
```

**注意**：沒有 API key 的話 AI 功能（AI Dictionary、AI Analyzer）將無法運作，但網站仍然可以執行。

✅ **檢查點**：`.env.local` 檔案已在專案根目錄建立。

---

## 步驟 5：啟動開發伺服器（5 分鐘）

讓我們看看網站的實際運作！

```bash
pnpm dev
```

**預期輸出：**

```
• Packages in scope: my-website
• Running dev in 1 package
...
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

**開啟你的瀏覽器：**

- 導航到 [http://localhost:3000](http://localhost:3000)
- 你應該會看到首頁，包含：
  - 導航列
  - Hero 區塊
  - 經歷時間軸
  - 精選專案

**探索網站：**

- 點擊「Blog」→ 查看 Medium 文章
- 點擊「Time Tracker」→ 試用時間追蹤應用程式
- 試試「AI Dictionary」（需要 API key）

✅ **檢查點**：網站在 localhost:3000 載入且沒有錯誤。

---

## 步驟 6：理解專案結構（5 分鐘）

讓我們探索程式碼庫：

```bash
# 查看主要 app 結構
tree apps/my-website/src -L 2
```

### Feature-Based Architecture

每個 feature 都是獨立的，位於 `apps/my-website/src/features/`：

```
features/
├── resume/           # 首頁/履歷 feature
├── blog/             # 部落格列表 feature
├── ai-dictionary/    # AI 單字分析 feature
├── ai-analyzer/      # AI prompt 分析器
├── time-tracker/     # 時間追蹤應用程式
├── about/            # 關於頁面
└── not-found/        # 404 頁面
```

### Feature 結構

每個 feature 遵循此模式：

```
{feature-name}/
├── {FeatureName}Feature.tsx    # 主要協調器
├── components/                 # Feature 專屬元件
├── hooks/                      # Feature 專屬 hooks
├── types/                      # Feature 專屬 types
├── utils/                      # Feature 專屬工具函式
└── index.ts                    # Barrel export
```

### 共用程式碼

共用程式碼位於 `packages/shared/`：

```
packages/shared/
├── src/
│   ├── components/   # 共用元件
│   ├── types/        # 共用 types
│   ├── constants/    # 共用常數
│   └── utils/        # 共用工具函式
└── data/             # 共用資料（例如：articleData.ts）
```

✅ **檢查點**：你了解 features 的位置以及它們的組織方式。

---

## 步驟 7：進行第一次程式碼變更（10 分鐘）

讓我們做一個簡單的變更來了解開發工作流程。

### 7.1 建立新分支

```bash
git checkout -b feat/my-first-change
```

**分支命名**：`feat/`、`fix/`、`docs/`、`refactor/`

### 7.2 編輯 Hero Section

開啟 `apps/my-website/src/features/resume/components/HeroSection/HeroSection.tsx`

**找到這一行**（大約在第 20 行）：

```typescript
<h1 className="text-4xl font-bold md:text-6xl">
  Hi, I&apos;m <span className="text-primary">Henry Lee</span>
</h1>
```

**改成：**

```typescript
<h1 className="text-4xl font-bold md:text-6xl">
  Hi, I&apos;m <span className="text-primary">Henry Lee</span>
  <span className="ml-2">👋</span>
</h1>
```

### 7.3 查看你的變更

**你的瀏覽器應該會自動熱重載！**

- 前往 [http://localhost:3000](http://localhost:3000)
- 你應該會在「Henry Lee」旁邊看到 👋 emoji

**如果沒有重新載入：**

- 檢查終端機是否有錯誤
- 手動重新整理瀏覽器

✅ **檢查點**：你在瀏覽器中看到了 emoji。

---

## 步驟 8：執行品質檢查（5 分鐘）

在 commit 之前，讓我們確保程式碼品質：

```bash
pnpm check
```

**這會執行：**

1. **Type checking** - 確保 TypeScript types 正確
2. **Linting** - 檢查程式碼風格（ESLint）
3. **Formatting** - 格式化程式碼（Prettier）

**預期輸出：**

```
✓ Type checking passed
✓ Linting passed
✓ Formatting passed
```

**如果有錯誤：**

- 大部分會自動修復
- 再次執行 `pnpm check` 以驗證

✅ **檢查點**：所有檢查通過且沒有錯誤。

---

## 步驟 9：Commit 你的變更（5 分鐘）

### 9.1 Stage 你的變更

```bash
git add apps/my-website/src/features/resume/components/HeroSection/HeroSection.tsx
```

### 9.2 使用 Conventional Commits 進行 Commit

```bash
git commit -m "feat(my-website): Add wave emoji to hero section"
```

**Commit 格式**：`<type>(<scope>): <subject>`

- **type**：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`
- **scope**：`my-website`、`shared`、`docs` 等
- **subject**：簡短描述，使用 sentence-case

**會發生什麼事：**

1. **pre-commit hook** 執行：
   - 對 staged files 進行 linting
   - 對 staged files 進行 formatting
2. **commit-msg hook** 執行：
   - 驗證 commit message 格式
   - 檢查 commit 大小限制
3. Commit 建立成功 ✅

✅ **檢查點**：Commit 成功建立。

---

## 步驟 10：理解 Git Hooks（3 分鐘）

你剛才體驗了 git hooks！讓我們了解發生了什麼：

### Pre-commit Hook

在 commit 建立**之前**執行：

- ✅ Lint 和 format staged files
- ✅ 執行 type checks（選用）

### Commit-msg Hook

在輸入 commit message **之後**執行：

- ✅ 驗證 commit message 格式（Conventional Commits）
- ✅ 檢查 commit 大小限制（如果超過 10 個檔案會警告）

### Pre-push Hook

在推送到 remote **之前**執行：

- ✅ 執行完整的 type checks
- ✅ 對所有檔案執行 ESLint

**了解更多**：[Git Workflow Guide](../guides/git-workflow.md)

---

## 步驟 11：探索文件（2 分鐘）

此專案使用 **Diataxis framework** 來組織文件：

```
docs/
├── guides/           # How-to guides（如「如何部署」）
├── tutorials/        # 學習路徑（就像這一篇！）
├── reference/        # 技術規格（API 文件、設定）
├── explanation/      # 概念說明（為什麼這樣運作）
└── adr/              # Architecture Decision Records
```

**關鍵文件：**

- [Architecture Reference](../reference/architecture.md) - 系統架構
- [Git Workflow Guide](../guides/git-workflow.md) - Git 流程
- [React Query Patterns](../explanation/react-query-patterns.md) - 資料抓取模式

**給 AI 助理的文件：**

- [AGENTS.md](../../AGENTS.md) - 專案概覽
- [CLAUDE.md](../../CLAUDE.md) - Claude Code 專屬指示

---

## 🎉 你學到了什麼

恭喜！你完成了第一個教學。你現在知道如何：

- ✅ 安裝並設定開發環境
- ✅ 啟動開發伺服器
- ✅ 導航 feature-based architecture
- ✅ 使用熱重載進行程式碼變更
- ✅ 在 commit 前執行品質檢查
- ✅ 使用 Conventional Commits 格式進行 commit
- ✅ 理解 git hooks 和自動化
- ✅ 導航文件系統

---

## 🚀 接下來的步驟

### 繼續學習

- **教學 02：新增新功能** - 從頭建立完整的 feature _(規劃中)_
- **教學 03：Medium 整合** - 使用外部 APIs _(規劃中)_

### 深入理解

- **[Feature-Based Architecture](../explanation/feature-based-architecture.md)** - 為什麼我們用 features 組織程式碼
- **[React Query Patterns](../explanation/react-query-patterns.md)** - SSG + React Query 整合
- **[Monorepo Strategy](../explanation/monorepo-strategy.md)** - 為什麼選擇 Turborepo

### 開始建置

- **[Git Workflow Guide](../guides/git-workflow.md)** - 完整的 git 流程
- **[API Reference](../reference/api/)** - API endpoints 文件
- **[Architecture Reference](../reference/architecture.md)** - 完整的系統架構

---

## 💡 成功的秘訣

### 開發最佳實務

1. **總是在 commit 前執行 `pnpm check`**
2. **遵循 commit message 慣例**（由 hooks 強制執行）
3. **保持 features 隔離**（遵守架構邊界）
4. **嚴格使用 TypeScript**（不使用 `any` types）
5. **在推送前先在本地測試**

### 常見陷阱

❌ **不要**：跨 feature 邊界 import
✅ **要**：使用 `@packages/shared` 來共用程式碼

❌ **不要**：使用 `--no-verify` 跳過品質檢查
✅ **要**：修復 linters/type checks 發現的問題

❌ **不要**：Commit 大型二進位檔案（圖片 >1MB）
✅ **要**：使用外部儲存（Vercel assets）

### 取得協助

- **文件**：從 [docs/README.md](../README.md) 開始
- **Issues**：檢查 [GitHub Issues](https://github.com/u88803494/my-website/issues)
- **架構決策**：瀏覽 [ADR directory](../adr/)

---

## 🔍 疑難排解

### Port 已被使用

```bash
# 終止 port 3000 上的程序
lsof -ti:3000 | xargs kill -9

# 或使用不同的 port
PORT=3001 pnpm dev
```

### Git Hooks 沒有執行

```bash
# 重新安裝 hooks
pnpm install
```

### Pull 後出現 Type 錯誤

```bash
# 清除並重新安裝
rm -rf node_modules
pnpm install
```

---

## 相關文件

- [Development Setup Guide](../guides/development-setup.md) - 完整的設定參考
- [Architecture Reference](../reference/architecture.md) - 系統架構
- [Git Workflow Guide](../guides/git-workflow.md) - Git 流程
- [Commitlint Rules](../reference/commitlint-rules.md) - Commit message 規則
- 教學 02：新增新功能 - 下一個教學 _(規劃中)_

---

**接下來**：教學 02（新增新功能）尚在規劃中。在此之前，可參考 [Feature-Based Architecture](../explanation/feature-based-architecture.md) 了解 feature 的組織方式。
