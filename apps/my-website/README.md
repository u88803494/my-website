# 🚀 Henry Lee's Personal Website

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

### Automation

- **Node.js Scripts** - 文章資料自動化處理
- **Medium API Integration** - 文章內容抓取

## 📦 安裝與啟動

### 前置需求

- Node.js 18+
- pnpm (推薦) 或 npm
- Google Gemini API Key (AI 字典功能需要)

### 安裝指令

```bash
# 在 monorepo 根目錄安裝依賴（推薦）
cd ../../  # 回到根目錄
pnpm install
```

### 開發環境

```bash
# 在根目錄啟動 tui 版 Turborepo，會偵測並啟動各子 app 的 dev script
pnpm dev
```

### 檢查程式碼

```bash
# 在根目錄執行
pnpm check
```

### 單獨開發 apps/my-website

針對此子專案單獨開發仍可使用原指令：

```bash
# 在此目錄 (apps/my-website) 執行
pnpm install  # 如果需要
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
my-website/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router 頁面
│   │   ├── 📁 about/              # 關於我頁面
│   │   ├── 📁 ai-dictionary/      # AI 字典頁面
│   │   ├── 📁 blog/               # 部落格頁面
│   │   ├── 📁 projects/           # 專案頁面
│   │   ├── 📁 api/                # API 路由
│   │   │   ├── 📁 define/         # AI 字典 API
│   │   │   └── 📁 medium-articles/ # Medium 文章 API
│   │   └── page.tsx               # 主頁面 (履歷)
│   ├── 📁 components/             # 共用組件
│   │   └── 📁 shared/             # 可重用 UI 組件
│   ├── 📁 features/               # 功能模組 (Feature-based 架構)
│   │   ├── 📁 resume/             # 履歷功能
│   │   │   ├── ResumeFeature.tsx  # 主要功能組件
│   │   │   ├── 📁 components/     # 履歷相關組件
│   │   │   ├── 📁 types/          # 履歷相關類型
│   │   │   └── index.ts           # 導出
│   │   ├── 📁 blog/               # 部落格功能
│   │   │   ├── BlogFeature.tsx    # 主要功能組件
│   │   │   ├── 📁 components/     # 部落格相關組件
│   │   │   ├── 📁 hooks/          # 部落格相關 hooks
│   │   │   ├── 📁 types/          # 部落格相關類型
│   │   │   └── index.ts           # 導出
│   │   ├── 📁 ai-dictionary/      # AI 字典功能
│   │   │   ├── AIDictionaryFeature.tsx # 主要功能組件
│   │   │   ├── 📁 components/     # AI 字典相關組件
│   │   │   ├── 📁 hooks/          # AI 字典相關 hooks
│   │   │   ├── 📁 types/          # AI 字典相關類型
│   │   │   └── index.ts           # 導出
│   │   └── 📁 about/              # 關於我功能
│   │       ├── AboutFeature.tsx   # 主要功能組件
│   │       ├── 📁 components/     # 關於我相關組件
│   │       └── index.ts           # 導出
│   ├── 📁 constants/              # 常量定義
│   │   ├── socialLinks.ts         # 社交連結常量
│   │   └── dictionaryConstants.ts # 字典功能常量
│   ├── 📁 data/                   # 資料層
│   │   ├── articleData.ts         # Medium 文章資料 (自動生成)
│   │   ├── projectData.ts         # 專案資料
│   │   └── skillData.tsx          # 技能資料
│   ├── 📁 lib/                    # 函式庫
│   │   ├── api-paths.ts           # API 路徑常量
│   │   └── prompts.ts             # AI 提示詞
│   ├── 📁 utils/                  # 工具函數
│   │   └── cn.ts                  # 類名組合工具
│   └── 📁 types/                  # 全域 TypeScript 型別定義
│       ├── article.types.ts       # 文章相關類型
│       ├── dictionary.types.ts    # 字典相關類型
│       ├── experience.types.ts    # 經驗相關類型
│       └── project.types.ts       # 專案相關類型
├── 📁 scripts/                    # 自動化腳本
│   ├── batch-parse-articles.ts    # Medium 文章解析腳本
│   └── sync-latest-articles.ts    # 同步最新文章腳本
├── 📁 docs/                       # 文檔
│   └── MEDIUM-ARTICLES-GUIDE.md   # Medium 功能說明
├── 📁 public/                     # 靜態資源
├── article-urls.json              # Medium 文章 URL 清單
└── package.json                   # 專案配置
```

## 🔧 開發指令

```bash
# 開發模式
pnpm dev

# 建置專案
pnpm build

# 啟動正式環境
pnpm start

# 程式碼檢查與格式化
pnpm run check

# 程式碼檢查與自動修復
pnpm run check:fix

# 僅執行 TypeScript 檢查
pnpm run type-check

# 僅執行 ESLint 檢查
pnpm run lint

# Medium 文章更新
node scripts/batch-parse-articles.js
```

## 📖 相關文檔

- 📝 **[Medium 文章自動化指南](./docs/MEDIUM-ARTICLES-GUIDE.md)** - 完整的自動化系統使用說明
- 🗂️ **[article-urls.json](./article-urls.json)** - Medium 文章 URL 管理
- 🤖 **[batch-parse-articles.js](./scripts/batch-parse-articles.js)** - 自動化解析腳本
- 📊 **[articleData.ts](./src/data/articleData.ts)** - 文章資料結構 (請勿手動編輯)

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
