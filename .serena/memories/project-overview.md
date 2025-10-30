# My Website 專案概覽

## 🏗️ 專案架構

**類型**: Turborepo Monorepo  
**框架**: Next.js 15 (App Router)  
**語言**: TypeScript (strict mode)  
**樣式**: Tailwind CSS 4 + DaisyUI  
**部署**: Vercel

## 📦 Monorepo 結構

```
my-website/
├── apps/my-website/          # 主應用
├── packages/
│   ├── shared/              # 共享類型、常數、工具
│   ├── blog/                # Blog 功能
│   ├── ai-dictionary/       # AI 字典
│   ├── ai-analyzer/         # AI 分析器
│   ├── tsconfig/            # TypeScript 配置
│   └── eslint-config/       # ESLint 配置
```

## 🎯 主要功能

1. **Resume/Portfolio** - 個人簡歷和作品集
2. **Blog** - 整合 Medium 文章（無限滾動）
3. **AI Dictionary** - AI 驅動的字典查詢
4. **AI Analyzer** - AI 文本分析工具
5. **Time Tracker** - 時間追蹤應用

## 🔑 關鍵技術

- **React Query** - 資料獲取和狀態管理
- **Framer Motion** - 動畫效果
- **Google Gemini API** - AI 功能
- **Medium GraphQL API** - 文章獲取

## 📝 重要決策

參考記憶：

- `ai-features-priority-recommendation` - AI 功能開發策略
- `issue-40-react-query-refactoring-plan` - React Query 架構改進

## 🚀 常用指令

```bash
# 開發
pnpm dev                    # 啟動開發伺服器 (port 3000)

# 程式碼品質
pnpm check                  # 類型檢查 + Lint + 格式化
pnpm check-types            # 只檢查類型
pnpm lint                   # 只執行 ESLint

# 建置
pnpm build                  # 建置生產版本（會先同步文章）
pnpm sync:all-articles      # 手動同步 Medium 文章

# Git
gh pr create                # 創建 PR (使用 u88803494 帳號)
gh issue create             # 創建 Issue
```

## ⚠️ 注意事項

1. **Next.js 版本**: 保持在 15.x，不要升到 16（使用者明確要求）
2. **註解語言**: 個人專案使用英文註解
3. **Commit 分離**: 不同類型的變更要分開 commit
4. **AI 功能**: 需要設定 `GEMINI_API_KEY` 環境變數

## 🐛 已知問題

- Issue #40: React Query 架構需要重構（使用 prefetching pattern）
- 目前使用 `force-dynamic` 作為臨時解法

## 🔗 相關連結

- GitHub Repo: https://github.com/u88803494/my-website
- 部署網站: https://henryleelab.com
- Issue Tracker: https://github.com/u88803494/my-website/issues
