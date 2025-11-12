# 🚀 Henry Lee's Personal Website

## 📦 Monorepo 架構說明

這是一個使用 **Turborepo** 與 **pnpm workspace** 的 **Monorepo 架構**專案。目前主要包含 `apps/my-website`，用於個人官網展示。隨著專案發展，可隨時間擴充更多 app 或 package，實現程式碼共享與統一管理的目標。

一個現代化的個人網站，展示專業技能、工作經驗、專案作品，並整合 Medium 文章自動化管理系統與 AI 字典功能。

## 🌐 網站連結

- [https://henryleelab.com](https://henryleelab.com)

## 📸 預覽畫面

### 🏠 Hero Section

![Henry Lee Website Hero Section](./public/images/screenshots/henry-lee-hero-section.png)

_展示網站首頁的 Hero Section，包含個人介紹、技術背景描述、關鍵成就數據以及行動按鈕_

### 📝 Medium 文章展示區域

![Medium Articles Section](./public/images/screenshots/resume-article-section.png)

_展示 Medium 文章自動化系統的完整佈局：「最新文章」固定展示最新兩篇，「更多文章」輪播展示其餘文章，包含自動播放控制、指示器和優雅的動畫效果_

## ✨ 主要功能

### 📋 履歷展示

- **響應式設計** - 完美適配各種裝置
- **現代化 UI** - 使用 Tailwind CSS 打造美觀介面
- **動態效果** - 打字機效果、動畫背景等互動元素
- **多頁面導航** - 關於我、專案、部落格頁面
- **功能模組化** - 採用 Feature-based 架構，各功能獨立封裝
- **精選專案卡片動畫** - 精選專案以卡片動畫方式展示，支援多連結（預覽、GitHub、心得文章等）
- **技術棧標籤** - 每個專案皆標註主要技術棧，方便快速了解技術背景

### 📚 技術展示

- **技能矩陣** - 視覺化展示技術棧和熟練度
- **專案作品集** - 展示重要專案與技術細節
- **工作經驗** - 時間軸式展示職涯歷程
- **聯絡方式** - 多種聯絡管道整合

### 📝 Medium 文章自動化系統 ⭐

- **最新文章自動同步** - 首頁與履歷頁自動顯示 Medium 最新兩篇文章
- **精選文章輪播** - 其餘文章以輪播方式展示，支援自動播放、手動切換、暫停/播放
- **動畫指示器與進度條** - 輪播區塊有動畫指示器與自動進度條
- **響應式設計** - 桌面顯示2篇，手機自動調整為1篇

### 🤖 AI 字典功能 🆕

- **學習模式與卡片互動** - 查詢結果可標記「學習完成」，支援撤銷與動畫特效
- **查詢歷史管理** - 自動保存查詢記錄，方便重複查看
- **多層次查詢結果** - 支援詞義、字源、例句等多維度資訊
- **即時互動動畫** - 完成學習時有動態特效
- **錯誤處理與提示** - 查詢失敗時有明確錯誤訊息
- **字詞長度限制** - 智能限制查詢長度，提升查詢效率

### ⏰ 時間追蹤器 🆕

- **Weekly Stats 視圖** - 全新週統計頁面，以卡片格式展示各類型時間分配
- **追蹤開始時間顯示** - 在統計摘要中顯示追蹤開始日期（第一筆記錄時間）
- **簡化統計介面** - 移除日均計算，專注於週統計和總計資料
- **活動類型分類** - 支援工作、學習、品格等多種活動分類追蹤
- **即時統計更新** - 新增記錄後立即更新各項統計數據
- **優雅的空狀態** - 無資料時提供清晰的引導提示

## 🛠️ 技術棧

### Frontend

- **Next.js 15** - React 框架，支援 App Router
- **TypeScript** - 型別安全的 JavaScript
- **Tailwind CSS** - 原子級 CSS 框架
- **React Query** - 服務器狀態管理
- **React Components** - 模組化組件設計

### AI & API Integration

- **Google Gemini API** - AI 字詞分析功能
- **Medium GraphQL API** - 文章內容抓取

### Development Tools

- **ESLint** - 程式碼檢查工具
- **Prettier** - 代碼格式化工具
- **PostCSS** - CSS 後處理器
- **pnpm** - 高效能包管理器
- **Pino + next-logger** - 結構化日誌系統

### Automation

- **Node.js Scripts** - 文章資料自動化處理
- **Medium API Integration** - 文章內容抓取

## 📚 Documentation

This project uses the **Diataxis framework** for comprehensive, AI-first documentation:

- **[Documentation Hub](./docs/)** - Complete documentation organized by type
- **[Guides](./docs/guides/)** - How-to guides for specific tasks
- **[Tutorials](./docs/tutorials/)** - Step-by-step learning paths
- **[Reference](./docs/reference/)** - Technical specifications and API docs
- **[Explanation](./docs/explanation/)** - Concepts and design decisions
- **[ADR](./docs/adr/)** - Architecture Decision Records

**For AI Assistants:**

- [AGENTS.md](./AGENTS.md) - Project overview and coding standards
- [CLAUDE.md](./CLAUDE.md) - Claude Code specific instructions

**Quick Links:**

- [Development Setup Guide](./docs/guides/development-setup.md)
- [Architecture Reference](./docs/reference/architecture.md)
- [API Documentation](./docs/reference/api/)
- [Git Workflow](./docs/guides/git-workflow.md)

## 📦 安裝與啟動

### 前置需求

- Node.js 18+
- pnpm (推薦) 或 npm
- Google Gemini API Key (AI 字典功能需要)

### 安裝指令

```bash
# 在 repo 根目錄安裝依賴
pnpm install
```

### 開發環境

```bash
# 啟動 tui 版 Turborepo，會偵測並啟動各子 app 的 dev script
pnpm dev
```

### 檢查程式碼

```bash
pnpm check
```

### 單獨開發 apps/my-website

針對 `apps/my-website` 單獨開發仍可進入目錄使用原指令：

```bash
cd apps/my-website
pnpm dev
```

### 環境變數設定

```bash
# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 並添加你的 GEMINI_API_KEY
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 🌍 公開頁面一覽

| 頁面名稱         | 網址                                  | 說明                     |
| ---------------- | ------------------------------------- | ------------------------ |
| 首頁／履歷       | https://henryleelab.com/              | 個人履歷、技能、經驗總覽 |
| 關於我           | https://henryleelab.com/about         | 關於 Henry Lee 的介紹    |
| 技術部落格       | https://henryleelab.com/blog          | 技術文章與開發心得       |
| AI 字典          | https://henryleelab.com/ai-dictionary | AI 中文字詞查詢工具      |
| AI Prompt 生成器 | https://henryleelab.com/ai-analyzer   | AI 提示詞產生輔助工具    |
| 時間追蹤器       | https://henryleelab.com/time-tracker  | 個人時間管理與統計工具   |

## 🤖 Medium 文章自動化使用指南

### 快速開始

1. **添加文章 URL**

   ```bash
   # 編輯文章連結清單
   vim article-urls.json
   ```

2. **執行自動化腳本**

   ```bash
   # 一鍵抓取並更新所有文章資料
   node scripts/batch-parse-articles.js
   ```

3. **查看結果**
   - 文章資料會自動更新到 `src/data/articleData.ts`
   - 網站重新整理即可看到最新文章

### 詳細說明文檔

📖 **[Medium 文章自動化完整指南](./docs/MEDIUM-ARTICLES-GUIDE.md)**

## 📁 專案結構

```
/
├── apps/
│   └── my-website/ (Next.js 15 個人官網)
├── package.json       # Turborepo 與 workspace 設定
├── turbo.json         # Turborepo 工作流程
└── pnpm-workspace.yaml
```

註： `apps/my-website` 提供了現代化個人網站的展示，適合展示專業技能及作品，並具備 AI 字典功能和 Medium 文章自動化管理的特色。

## 🔧 開發指令

### 主要指令（在 repo 根目錄執行）

```bash
# 開發模式（啟動 tui 版 Turborepo）
pnpm dev

# 檢查程式碼（包含 TypeScript 檢查、ESLint、格式化）
pnpm check

# 其他指令
pnpm build          # 建置專案
pnpm start          # 啟動正式環境
pnpm lint           # ESLint 檢查
pnpm check-types    # TypeScript 檢查
pnpm format         # 格式化程式碼
```

### apps/my-website 專用指令

```bash
# 進入子目錄
cd apps/my-website

# 開發模式
pnpm dev

# 檢查程式碼（包含自動修復與格式化）
pnpm check

# Medium 文章同步
pnpm sync:latest        # 同步最新文章
pnpm parse:articles     # 解析文章內容
pnpm sync:all-articles  # 完整同步流程
```

## 📖 相關文檔

- 📝 **[Medium 文章自動化指南](./docs/MEDIUM-ARTICLES-GUIDE.md)** - 完整的自動化系統使用說明
- 📋 **[結構化日誌指南](./docs/LOGGER-GUIDE.md)** - Logger 系統使用與最佳實踐
- 🗂️ **[article-urls.json](./article-urls.json)** - Medium 文章 URL 管理
- 🤖 **[batch-parse-articles.js](./scripts/batch-parse-articles.js)** - 自動化解析腳本
- 📊 **[articleData.ts](./src/data/articleData.ts)** - 文章資料結構 (請勿手動編輯)
- 📋 **[Issue 管理指南](./docs/ISSUE-MANAGEMENT.md)** - P0-P3 優先級系統使用說明

## 📊 Issue 管理

本專案使用 [P0-P3 優先級系統](./docs/ISSUE-MANAGEMENT.md) 管理 GitHub Issues。

[![Open Issues](https://img.shields.io/github/issues/u88803494/my-website)](https://github.com/u88803494/my-website/issues)
[![P0 Critical](https://img.shields.io/github/issues/u88803494/my-website/p0-critical?color=B60205&label=P0%20Critical)](https://github.com/u88803494/my-website/labels/p0-critical)
[![P1 High](https://img.shields.io/github/issues/u88803494/my-website/p1-high?color=D93F0B&label=P1%20High)](https://github.com/u88803494/my-website/labels/p1-high)
[![P2 Medium](https://img.shields.io/github/issues/u88803494/my-website/p2-medium?color=FBCA04&label=P2%20Medium)](https://github.com/u88803494/my-website/labels/p2-medium)
[![P3 Low](https://img.shields.io/github/issues/u88803494/my-website/p3-low?color=0E8A16&label=P3%20Low)](https://github.com/u88803494/my-website/labels/p3-low)

### 優先級定義

- **P0** 🔥 Critical - 立即處理（網站無法運作、安全漏洞）
- **P1** ⚡ High - 本週內（核心功能損壞）
- **P2** 📌 Medium - 本月內（重要功能、技術債）
- **P3** 💡 Low - 有空再做（Nice-to-have）

### 快速連結

- 📋 [建立新 Issue](https://github.com/u88803494/my-website/issues/new/choose) - 使用 Issue Templates
- 🔍 [需要 Triage 的 Issues](https://github.com/u88803494/my-website/labels/status%3Aneeds-triage)
- ✅ [準備開始的 Issues](https://github.com/u88803494/my-website/labels/status%3Aready)

詳細說明請參閱 [Issue 管理指南](./docs/ISSUE-MANAGEMENT.md)。

## 🌟 特色功能說明

### 🎯 響應式設計

網站完全響應式，在桌面、平板、手機上都有最佳體驗。

### ⚡ 效能優化

- Next.js 15 App Router 架構
- 自動程式碼分割
- 圖片優化
- 字體優化
- React Query 數據緩存

### 🎨 現代化 UI/UX

- 簡潔優雅的視覺設計
- 流暢的動畫效果
- 直觀的使用者介面
- 深色模式支援 (未來功能)

### 🏗️ 架構特色

- **Feature-based 架構** - 各功能模組獨立封裝
- **TypeScript 嚴格模式** - 確保代碼質量和類型安全
- **統一的組件命名** - 採用 `*Feature.tsx` 命名模式
- **集中化常量管理** - 避免重複定義和魔法數字
- **智能組件模式** - 採用內部調用模式，減少不必要的抽象

### 🎯 AI 字典學習卡片互動：查詢結果可標記「已完成學習」，支援撤銷，並有動畫提示，提升學習動機

### 🎯 Medium 文章自動同步與輪播：首頁與履歷頁自動同步最新文章，精選文章支援自動輪播、手動切換、動畫指示器

### 🎯 專案卡片多連結與技術標籤：每個專案卡片可快速連結至預覽、GitHub、實作心得，並標註技術棧

### 🎯 全站資料自動化：Medium 文章、AI 字典查詢結果皆自動化處理，減少手動維護

### 🎯 豐富動畫與互動：大量使用動畫（如卡片彈跳、輪播切換、完成特效），提升整體 UI/UX

## 🚀 部署

### Vercel 部署 (推薦)

```bash
# 使用 Vercel CLI
vercel --prod
```

### 其他平台

專案支援任何支援 Next.js 的部署平台，如 Netlify、Railway 等。

## 🤝 貢獻

歡迎提出 Issue 或 Pull Request 來改善這個專案！

## 📄 授權

MIT License - 詳見 [LICENSE](./LICENSE) 文件

---

⭐ **如果這個專案對你有幫助，歡迎給個 Star！**
