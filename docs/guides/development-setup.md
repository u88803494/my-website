---
title: Development 環境設定指南
type: guide
status: stable
audience: [developer]
tags: [setup, development, environment, tools]
created: 2025-11-07
updated: 2025-11-07
difficulty: beginner
estimated_time: 30 minutes
related:
  - reference/architecture.md
  - reference/cli-commands.md
  - tutorials/01-project-setup.md
ai_context: |
  針對 my-website monorepo 設定本地開發環境的逐步指南，包含先決條件、安裝步驟與驗證流程。
---

# Development 環境設定指南

本指南將協助您為 my-website monorepo 設定本地開發環境。

## 先決條件

開始之前，請確保您已安裝以下工具：

### 必要條件

- **Node.js** 18.x 或更高版本 ([下載](https://nodejs.org/))
- **pnpm** 8.x 或更高版本
  ```bash
  npm install -g pnpm
  ```
- **Git** ([下載](https://git-scm.com/))

### 建議安裝

- **VS Code** ([下載](https://code.visualstudio.com/)) 搭配擴充功能：
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
- **GitHub CLI** (用於 PR/issue 管理)
  ```bash
  brew install gh  # macOS
  ```

### 選用工具

- **Cursor IDE** - AI 驅動的編輯器 ([下載](https://cursor.sh/))
- **Claude Code CLI** - AI 輔助開發工具

---

## 步驟 1：Clone Repository

```bash
# Clone repository
git clone https://github.com/u88803494/my-website.git

# 進入專案目錄
cd my-website
```

---

## 步驟 2：安裝相依套件

```bash
# 使用 pnpm 安裝所有相依套件
pnpm install
```

**執行內容：**

- 安裝所有 workspace 的相依套件
- 設定 git hooks (husky)
- 連結內部 packages

**預期輸出：**

```
Lockfile is up to date, resolution step is skipped
...
Done in X.Xs
```

---

## 步驟 3：環境變數設定

在根目錄建立 `.env.local`：

```bash
# 複製範例檔案（如果有）
cp .env.example .env.local

# 或手動建立
touch .env.local
```

新增必要的環境變數：

```bash
# AI 功能必要
GEMINI_API_KEY=your_api_key_here

# 開發環境
NODE_ENV=development
```

**取得 API keys：**

- **Gemini API**：[取得 API Key](https://ai.google.dev/)

---

## 步驟 4：啟動開發伺服器

```bash
# 使用 Turbo TUI 啟動開發伺服器
pnpm dev

# 或不使用 TUI
pnpm --filter my-website dev
```

**預期輸出：**

```
• Packages in scope: my-website
• Running dev in 1 package
...
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

**開啟瀏覽器：**

- 前往 [http://localhost:3000](http://localhost:3000)
- 您應該會看到首頁

---

## 步驟 5：驗證安裝

執行完整檢查套件：

```bash
pnpm check
```

這會執行：

1. **型別檢查** (`tsc --noEmit`)
2. **Linting** (`eslint --fix`)
3. **格式化** (`prettier --write`)

**預期輸出：**

```
✅ Type checking passed
✅ Linting passed
✅ Formatting passed
```

---

## 專案結構

理解 monorepo 結構：

```
my-website/
├── apps/
│   └── my-website/           # 主要 Next.js 應用程式
│       ├── src/
│       │   ├── app/          # Next.js App Router pages
│       │   ├── features/     # Feature-based 模組
│       │   └── components/   # 共用元件
│       └── package.json
├── packages/
│   ├── shared/               # 共用工具、types、常數
│   ├── tsconfig/             # 共用 TypeScript configs
│   ├── eslint-config/        # 共用 ESLint configs
│   └── tailwind-config/      # 共用 Tailwind configs
├── docs/                     # 文件（Diataxis framework）
├── scripts/                  # Build 和工具腳本
├── pnpm-workspace.yaml       # Workspace 設定
└── package.json              # 根目錄 package.json
```

**關鍵目錄：**

- **`apps/my-website/src/features/`**：Feature-based 架構（resume、blog、ai-dictionary 等）
- **`packages/shared/`**：所有應用程式共用的程式碼
- **`docs/`**：依 Diataxis framework 組織的所有文件

---

## 常用指令

| 指令                       | 說明                           |
| -------------------------- | ------------------------------ |
| `pnpm dev`                 | 啟動開發伺服器（Turbo TUI）    |
| `pnpm build`               | 建置所有應用程式供正式環境使用 |
| `pnpm check`               | 執行型別檢查 + lint + format   |
| `pnpm check-types`         | 僅執行 TypeScript 檢查         |
| `pnpm lint`                | 僅執行 ESLint                  |
| `pnpm format`              | 使用 Prettier 格式化程式碼     |
| `pnpm sync:all-articles`   | 同步 Medium 文章               |
| `pnpm --filter my-website` | 在特定 workspace 執行指令      |

完整指令參考請見 [CLI Commands](../reference/cli-commands.md)。

---

## 開發工作流程

### 進行修改

1. **建立新分支**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **進行變更**
   - 遵循 [feature-based architecture](../explanation/feature-based-architecture.md)
   - 使用 TypeScript strict mode
   - 必要時新增測試

3. **執行檢查**

   ```bash
   pnpm check
   ```

4. **提交變更**

   ```bash
   git add .
   git commit -m "feat(my-website): Add new feature"
   ```

   Commit 訊息遵循 [Conventional Commits](../reference/commitlint-rules.md) 規範。

5. **Push 並建立 PR**
   ```bash
   git push origin feat/your-feature-name
   ```

詳細 git 流程請見 [Git Workflow Guide](./git-workflow.md)。

---

## 疑難排解

### Port 3000 已被使用

**錯誤訊息：**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決方法：**

```bash
# 找到並終止使用 port 3000 的程序
lsof -ti:3000 | xargs kill -9

# 或使用不同的 port
PORT=3001 pnpm dev
```

### 找不到模組

**錯誤訊息：**

```
Module not found: Can't resolve '@packages/shared'
```

**解決方法：**

```bash
# 重新安裝相依套件
pnpm install

# 清除 Next.js cache
rm -rf apps/my-website/.next
pnpm dev
```

### 型別錯誤

**錯誤訊息：**

```
TS2307: Cannot find module '@packages/shared/types'
```

**解決方法：**

```bash
# 重建 TypeScript 專案
pnpm run check-types

# 如果仍然失敗，檢查 tsconfig paths
cat apps/my-website/tsconfig.json
```

### Git Hooks 未執行

**錯誤訊息：**

```
Commit created without running pre-commit hooks
```

**解決方法：**

```bash
# 重新安裝 husky
pnpm install
npx husky install

# 驗證 hooks 已安裝
ls -la .husky/
```

---

## 編輯器設定

### VS Code Settings

建立 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 建議的 VS Code 擴充功能

從 Extensions marketplace 安裝：

```
dbaeumer.vscode-eslint
esbenp.prettier-vscode
bradlc.vscode-tailwindcss
formulahendry.auto-rename-tag
```

---

## 下一步

環境設定完成後：

1. **學習架構**：閱讀 [Architecture Reference](../reference/architecture.md)
2. **跟隨教學**：從 [Tutorial 01: Project Setup](../tutorials/01-project-setup.md) 開始
3. **理解模式**：閱讀 [React Query Patterns](../explanation/react-query-patterns.md)
4. **進行第一次修改**：遵循 [Git Workflow Guide](./git-workflow.md)

---

## 相關文件

- [Architecture Reference](../reference/architecture.md) - 完整系統架構
- [CLI Commands Reference](../reference/cli-commands.md) - 所有可用指令
- [Git Workflow Guide](./git-workflow.md) - Git 流程與自動化
- [Tutorial 01: Project Setup](../tutorials/01-project-setup.md) - 實作學習路徑

---

## 取得協助

- **文件**：瀏覽 [docs/](../)
- **Issues**：[GitHub Issues](https://github.com/u88803494/my-website/issues)
- **架構決策**：[ADR directory](../adr/)
