# 🚀 Henry Lee's Personal Website

一個現代化的個人網站，展示專業技能、工作經驗、專案作品，並整合 Medium 文章自動化管理系統和 AI 字典功能。

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
- **現代化 UI** - 使用 Tailwind CSS 和 daisyUI 打造美觀介面
- **動態效果** - 打字機效果、動畫背景等互動元素
- **多頁面導航** - 關於我、專案、部落格、AI 字典頁面
- **功能模組化** - 採用 Feature-based 架構，各功能獨立封裝

### 🤖 AI 字典功能 ⭐

- **智能分析** - 使用 Google Gemini AI 深度解析中文詞彙
- **詞彙拆解** - 逐字分析讀音、意思、組詞
- **語境應用** - 提供豐富的使用範例和語境
- **學習輔助** - 適合語言學習者深入理解中文詞彙
- **優雅介面** - 響應式設計，支援桌面和行動裝置

### 📚 技術展示

- **技能矩陣** - 視覺化展示技術棧和熟練度
- **專案作品集** - 展示重要專案與技術細節
- **工作經驗** - 時間軸式展示職涯歷程
- **聯絡方式** - 多種聯絡管道整合

### 📝 Medium 文章自動化系統

- **自動抓取** - 一鍵獲取 Medium 文章資訊
- **智能解析** - 自動提取標題、描述、標籤、縮圖
- **技術標籤** - 自動分析並標記真實的 Medium 標籤
- **優雅輪播** - 精選文章固定展示 + 其餘文章自動輪播
- **響應式設計** - 桌面顯示2篇，手機自動調整為1篇

## 🛠️ 技術棧

### Frontend

- **Next.js 15** - React 框架，支援 App Router
- **React 19** - 最新的 React 版本
- **TypeScript** - 型別安全的 JavaScript
- **Tailwind CSS** - 原子級 CSS 框架
- **daisyUI** - 美觀的 UI 組件庫
- **Radix UI** - 無障礙 UI 組件
- **Shadcn/UI** - 現代化組件系統

### State Management & API

- **React Query** - 伺服器狀態管理
- **Vercel AI SDK** - AI 功能整合
- **Google Gemini AI** - 智能文字分析

### Icons & Assets

- **Lucide React** - 現代化圖標庫
- **React Icons** - 品牌圖標
- **Next.js Image** - 圖片優化

### Development Tools

- **ESLint** - 程式碼檢查工具
- **Prettier** - 程式碼格式化
- **PostCSS** - CSS 後處理器
- **pnpm** - 高效能包管理器

### Automation

- **Node.js Scripts** - 文章資料自動化處理
- **Medium GraphQL API** - 文章內容抓取

## 📦 安裝與啟動

### 前置需求

- Node.js 18+
- pnpm (推薦) 或 npm

### 安裝步驟

```bash
# 克隆專案
git clone <repository-url>
cd my-website

# 安裝依賴
pnpm install

# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入必要的 API 金鑰

# 啟動開發伺服器
pnpm dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 環境變數設定

```env
# .env.local
GEMINI_API_KEY=your_gemini_api_key
```

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
   pnpm run sync-articles
   ```

3. **查看結果**
   - 文章資料會自動更新到 `src/data/articleData.ts`
   - 網站重新整理即可看到最新文章

### 詳細說明文檔

📖 **[Medium 文章自動化完整指南](./docs/MEDIUM-ARTICLES-GUIDE.md)**

## 📁 專案結構

```
my-website/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router 頁面
│   │   ├── 📁 about/              # 關於我頁面
│   │   ├── 📁 ai-dictionary/      # AI 字典頁面
│   │   ├── 📁 api/                # API 路由
│   │   ├── 📁 blog/               # 部落格頁面
│   │   ├── 📁 projects/           # 專案頁面
│   │   └── page.tsx               # 主頁面 (履歷)
│   ├── 📁 components/             # 共用組件
│   │   ├── 📁 providers/          # React Context Providers
│   │   └── 📁 shared/             # 可重用 UI 組件
│   ├── 📁 constants/              # 常量定義
│   │   ├── dictionaryConstants.ts # 字典功能常量
│   │   └── socialLinks.ts         # 社交連結常量
│   ├── 📁 features/               # 功能模組 (Feature-based Architecture)
│   │   ├── 📁 about/              # 關於我功能
│   │   │   ├── AboutFeature.tsx   # 主要功能組件
│   │   │   ├── 📁 components/     # 子組件
│   │   │   └── index.ts           # 匯出檔案
│   │   ├── 📁 ai-dictionary/      # AI 字典功能
│   │   │   ├── AIDictionaryFeature.tsx
│   │   │   ├── 📁 components/     # 子組件
│   │   │   ├── 📁 hooks/          # 自定義 Hooks
│   │   │   ├── 📁 types/          # 類型定義
│   │   │   └── index.ts
│   │   ├── 📁 blog/               # 部落格功能
│   │   │   ├── BlogFeature.tsx
│   │   │   ├── 📁 components/     # 子組件
│   │   │   ├── 📁 hooks/          # 自定義 Hooks
│   │   │   ├── 📁 types/          # 類型定義
│   │   │   └── index.ts
│   │   └── 📁 resume/             # 履歷功能
│   │       ├── ResumeFeature.tsx
│   │       ├── 📁 components/     # 子組件
│   │       ├── 📁 types/          # 類型定義
│   │       └── index.ts
│   ├── 📁 data/                   # 資料層
│   │   ├── articleData.ts         # Medium 文章資料 (自動生成)
│   │   ├── projectData.ts         # 專案資料
│   │   └── skillData.tsx          # 技能資料
│   ├── 📁 lib/                    # 函式庫
│   │   ├── api-paths.ts           # API 路徑常量
│   │   └── prompts.ts             # AI 提示詞
│   ├── 📁 types/                  # 全域 TypeScript 型別定義
│   │   ├── article.types.ts       # 文章相關類型
│   │   ├── dictionary.types.ts    # 字典相關類型
│   │   ├── experience.types.ts    # 經驗相關類型
│   │   └── project.types.ts       # 專案相關類型
│   └── 📁 utils/                  # 工具函數
│       └── cn.ts                  # 樣式類名工具
├── 📁 scripts/                    # 自動化腳本
│   ├── batch-parse-articles.ts    # Medium 文章解析腳本
│   └── sync-latest-articles.ts    # 文章同步腳本
├── 📁 docs/                       # 文檔
│   └── MEDIUM-ARTICLES-GUIDE.md   # Medium 功能說明
├── 📁 public/                     # 靜態資源
│   ├── 📁 documents/              # 文檔檔案
│   └── 📁 images/                 # 圖片資源
├── article-urls.json              # Medium 文章 URL 清單
├── .cursorrules                   # Cursor AI 開發規範
└── package.json                   # 專案配置
```

## 🏗️ 架構設計原則

### Feature-based Architecture

專案採用 Feature-based 架構，每個功能都是自包含的模組：

```typescript
// 功能組件命名規範
src/features/[feature-name]/
├── [FeatureName]Feature.tsx    # 主功能組件
├── components/                 # 子組件
├── hooks/                      # 自定義 Hooks (如需要)
├── types/                      # 類型定義 (如需要)
└── index.ts                    # 匯出檔案
```

### 組件分層

1. **Page 組件** (`app/*/page.tsx`) - 頁面級組件，負責路由
2. **Feature 組件** (`*Feature.tsx`) - 功能級組件，負責業務邏輯
3. **UI 組件** (`components/`) - 展示組件，負責視覺呈現

### 狀態管理策略

- **Server State**: 使用 React Query 管理 API 資料
- **Client State**: 使用 useState 和 useReducer 管理本地狀態
- **Global State**: 使用 Context API 管理全域狀態

## 🔧 開發指令

```bash
# 開發模式
pnpm dev

# 建置專案
pnpm build

# 啟動正式環境
pnpm start

# 程式碼品質檢查 (TypeScript + ESLint + Prettier)
pnpm run check

# 自動修復程式碼品質問題
pnpm run check:fix

# 單獨執行 TypeScript 檢查
pnpm run type-check

# 單獨執行 ESLint 檢查
pnpm run lint

# Medium 文章更新
pnpm run sync-articles
```

## 🧪 程式碼品質

### 自動化檢查

專案整合了完整的程式碼品質檢查流程：

- **TypeScript** - 型別安全檢查
- **ESLint** - 程式碼規範檢查
- **Prettier** - 程式碼格式化
- **Git Hooks** - 提交前自動檢查

### 開發規範

專案遵循 [.cursorrules](./.cursorrules) 中定義的開發規範：

- 採用 TypeScript 嚴格模式
- 遵循 React 19 和 Next.js 15 最佳實踐
- 使用 Tailwind CSS 進行樣式設計
- 保持組件單一職責和可重用性

## 📖 相關文檔

- 📝 **[Medium 文章自動化指南](./docs/MEDIUM-ARTICLES-GUIDE.md)** - 完整的自動化系統使用說明
- 📋 **[開發規範](./.cursorrules)** - 專案開發規範和架構指南
- 🗂️ **[article-urls.json](./article-urls.json)** - Medium 文章 URL 管理
- 📊 **[articleData.ts](./src/data/articleData.ts)** - 文章資料結構 (請勿手動編輯)

## 🌟 特色功能說明

### 🎯 響應式設計

網站完全響應式，在桌面、平板、手機上都有最佳體驗。

### ⚡ 效能優化

- Next.js 15 App Router 架構
- React 19 伺服器組件
- 自動程式碼分割
- 圖片優化
- 字體優化

### 🎨 現代化 UI/UX

- 使用 Tailwind CSS 和 daisyUI 設計系統
- 流暢的動畫效果
- 直觀的使用者介面
- 無障礙設計 (WCAG 合規)

### 🤖 AI 功能整合

- Google Gemini AI 智能分析
- 結構化資料處理
- 錯誤處理和容錯機制
- 即時回應和載入狀態

## 🚀 部署

### Vercel 部署 (推薦)

```bash
# 使用 Vercel CLI
vercel --prod
```

### 環境變數設定

在 Vercel 控制台中設定以下環境變數：

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 其他平台

專案支援任何支援 Next.js 的平台部署，包括：

- Netlify
- Railway
- AWS Amplify
- Google Cloud Platform

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 提交訊息規範

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
feat: 新功能
fix: 錯誤修復
docs: 文檔更新
style: 樣式調整
refactor: 重構
test: 測試
chore: 其他更改
```

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件。

## 📞 聯絡

Henry Lee - [LinkedIn](https://linkedin.com/in/henry-lee) - henrylee@example.com

專案連結: [https://github.com/yourusername/my-website](https://github.com/yourusername/my-website)

---

⭐ 如果這個專案對你有幫助，請給一個 Star！
