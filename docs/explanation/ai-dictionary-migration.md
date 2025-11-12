---
title: "AI Dictionary 遷移至獨立 Repository"
type: explanation
status: stable
audience: [developer, ai]
tags: [ai-dictionary, migration, architecture, monorepo]
created: 2025-11-12
updated: 2025-11-12
related:
  - ../../packages/ai-dictionary/README.md
  - ../reference/architecture.md
ai_context: |
  Explains the decision and process to migrate AI Dictionary from my-website monorepo
  to an independent repository, including rationale and impact on the main site.
---

# AI Dictionary 遷移至獨立 Repository

本文檔說明 AI Dictionary 從 `my-website` monorepo 遷移至獨立 repository 的決策、過程和影響。

---

## 背景

AI Dictionary 原本位於 `my-website` monorepo 的 `packages/ai-dictionary/` 中，作為主站的一個功能模組。

### 原始架構

```
my-website/
├── apps/
│   └── my-website/
│       └── src/
│           ├── app/
│           │   └── ai-dictionary/
│           │       └── page.tsx    # 引用 @packages/ai-dictionary
│           └── features/
├── packages/
│   ├── ai-dictionary/              # 字典功能模組
│   │   ├── src/
│   │   │   ├── AIDictionaryFeature.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── package.json
│   └── shared/
```

### 功能狀態

- **基礎功能**: AI 驅動的詞彙分析（使用 Google Gemini API）
- **技術棧**: React + React Query + DaisyUI
- **整合方式**: 透過 `@packages/ai-dictionary` 被主站引用

---

## 為什麼要遷移？

### 核心問題

**雙重定位的困擾**：

> "我覺得我想要開發新功能，但他也是我作品集的一部分，那這樣該怎麼處理？"

AI Dictionary 同時需要是：

1. **獨立產品/服務** - 希望有商業化潛力、開發彈性
2. **作品集項目** - 需要在主站展示技術能力

### 技術考量

1. **功能需求差異**：
   - 字典需要更多 AI 功能（語音輸入、學習追蹤、進度管理）
   - 主站偏展示性（作品集、部落格、時間追蹤器）

2. **維護成本**：
   - 主站包含許多無關功能
   - Bundle size 會隨字典功能增加而增長
   - CI/CD 耦合，部署相互影響

3. **開發限制**：
   - 受主站 bundle size 限制
   - 依賴版本需要與主站協調
   - 商業化功能（付費、廣告）整合困難

### 商業化考量

**未來規劃**：

- 獨立網域：`dictionary.henryleelab.com`
- 獨立 analytics 和 SEO
- 付費功能或廣告變現
- 可能開發 Mobile App（優先於 Chrome Extension）

---

## 遷移決策

### 選擇的架構

✅ **獨立 Monorepo** (使用 Turborepo + pnpm)

```
ai-dictionary/ (新 repo)
├── apps/
│   └── dictionary/              # Next.js 15 字典站
│       ├── src/
│       │   ├── app/            # App Router
│       │   ├── features/       # 功能模組（含 AI Dictionary 核心）
│       │   ├── components/     # UI 組件
│       │   └── lib/            # 工具函數
│       └── package.json
├── packages/
│   ├── shared/                 # 最小化共用程式碼
│   │   ├── types/             # dictionary.types.ts
│   │   ├── utils/             # cn.ts, logger.ts
│   │   └── constants/         # MAX_WORD_LENGTH, GEMINI_*
│   ├── tailwind-config/        # DaisyUI + Tailwind 配置
│   ├── tsconfig/              # TypeScript 配置
│   └── eslint-config/         # ESLint 規則
├── docs/                       # Diataxis 文檔系統
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### 為什麼選擇 Monorepo？

1. **配置複用** ✅
   - 從 my-website 複製驗證過的配置
   - TypeScript strict mode、ESLint 規則、Git hooks
   - 時間節省：~1.5 小時（vs 從零配置）

2. **Shared Code 避免重複** ✅
   - Types, utils, constants 集中管理
   - 避免多處定義相同程式碼

3. **未來擴展性** ✅
   - 容易加入新 apps（管理後台、API server、Mobile app）
   - 容易加入新 packages（api-client, analytics）

4. **工具鏈統一** ✅
   - 與主站架構相同，零學習曲線
   - 熟悉的 Turborepo + pnpm 工作流程

### 被拒絕的選項

#### ❌ 完全獨立 Next.js（無 monorepo）

**優點**：最簡單、最乾淨
**缺點**：

- 需要重寫所有 shared code (~30 個檔案)
- 配置從零開始
- 時間成本 4-5 小時 vs 2-3 小時
- 未來擴展困難

#### ⚠️ Gemini 建議的潔癖架構（dictionary-core）

Gemini 建議將核心邏輯抽離為獨立的 `packages/dictionary-core`（無 React 依賴），方便 Chrome Extension 複用。

**優點**：

- 邏輯完全解耦
- 架構最乾淨、最專業
- Chrome Extension 可直接使用

**缺點**：

- **當前無需求**：只做 Web 版，6-12 個月內優先考慮 App 而非 Extension
- **過度設計**：增加複雜度但無立即價值
- **時間成本**：需要額外 1-2 小時設計和遷移
- **維護負擔**：需要定義 core package 的 API 邊界

**結論**：等未來真正需要時再重構（詳見新 repo 的 ADR）

---

## 遷移策略

### 增量驗證 (9 Phases)

每個階段完成後用 **pnpm + Chrome DevTools** 驗證：

1. **Phase 1**: 初始化 Turborepo + Next.js → 確認基礎系統運作
2. **Phase 2**: TypeScript 配置 → 確認 path alias 生效
3. **Phase 3**: ESLint 配置 → 確認 lint rules 運作
4. **Phase 4**: Tailwind + DaisyUI → **視覺驗證樣式**
5. **Phase 5**: Shared Package → 確認 imports 正確
6. **Phase 6**: AI Dictionary 功能 → **完整功能測試**
7. **Phase 7**: Git Hooks → 確認 commits 驗證
8. **Phase 8**: Production Build → Lighthouse 測試
9. **Phase 9**: Vercel 部署 → 線上驗證

**關鍵原則**：

> "你應該要先一邊引入設定檔，一邊測試時否成功"
> "用 pnpm 去做，然後可以的話用 chromedevtool 去測試，每個階段都看一下畫面"

**Timeline**:

- 文檔建立: 30 min
- Phase 1-9 執行: 2.5-3 hours
- 總計: ~3.5 hours

詳細計劃：[ai-dictionary/docs/guides/migration-plan.md](https://github.com/u88803494/ai-dictionary/blob/main/docs/guides/migration-plan.md)

---

## 對主站的影響

### 立即影響

1. **Package 棄用**：
   - `packages/ai-dictionary/` 標記為已棄用
   - 添加遷移說明和新 repo 連結

2. **路由變更**：
   - `henryleelab.com/ai-dictionary` 將需要處理
   - 選項 A：完全移除，redirect 到 `dictionary.henryleelab.com`
   - 選項 B：保留簡化 demo 版本，連結至完整版

3. **作品集更新**：
   - Resume 頁面的專案卡片更新連結
   - 指向獨立 repo 和線上版本

### 未來整合方式

**Phase 8 將決定主站整合方式**：

#### 選項 A：完全移除 ✅ (推薦)

```typescript
// apps/my-website/src/app/ai-dictionary/page.tsx
export default function AIDictionaryPage() {
  redirect("https://dictionary.henryleelab.com");
}
```

**優點**：

- 主站 bundle size 減少
- 維護成本降低
- 職責清晰分離

**缺點**：

- 用戶需要跳轉到新網域

#### 選項 B：保留簡化 Demo

保留一個最小版本的 demo，主要功能引導至完整版。

**優點**：

- 主站仍可展示部分功能
- 用戶體驗更流暢

**缺點**：

- 需要維護兩個版本
- 程式碼部分重複

**決定時機**：遷移完成後，根據實際情況決定

---

## 技術細節

### 複製的配置

從 my-website 複製但重新安裝：

- **TypeScript 配置**: `packages/tsconfig/`
- **ESLint 配置**: `packages/eslint-config/`
- **Tailwind 配置**: `packages/tailwind-config/`
- **Git Hooks**: `husky`, `lint-staged`, `commitlint`
- **文檔系統**: Diataxis 結構

### 複製的程式碼

最小化共用程式碼：

```typescript
// packages/shared/types/dictionary.types.ts
export interface WordAnalysisResponse { ... }

// packages/shared/utils/cn.ts
export function cn(...inputs: ClassValue[]) { ... }

// packages/shared/constants/
export const MAX_WORD_LENGTH = 20;
export const GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite";
```

### 功能遷移

從 `packages/ai-dictionary/` 遷移至 `apps/dictionary/src/features/ai-dictionary/`：

```
ai-dictionary/src/
├── AIDictionaryFeature.tsx     # 主要組件
├── components/
│   ├── SearchBar/
│   ├── ResultDisplay/
│   ├── LoadingState.tsx
│   ├── ErrorState.tsx
│   └── EmptyState.tsx
├── hooks/
│   └── useWordAnalysis.ts      # React Query mutation
└── utils/
    └── analyzeWord.ts          # Gemini API 整合
```

---

## 優勢與代價

### ✅ 優勢

1. **開發自由度** ⬆️
   - 不受主站 bundle size 限制
   - 可自由選擇依賴版本
   - 部署獨立，互不影響

2. **商業化潛力** ⬆️
   - 獨立網域和 SEO
   - 容易加入付費功能
   - 獨立 analytics

3. **作品集展示** ✅
   - 主站保留專案卡片連結
   - GitHub 獨立 repo 展示完整專案
   - 可選：保留簡化 demo

4. **維護成本** ⬇️
   - 職責分離，減少耦合
   - 測試範圍縮小
   - CI/CD 獨立運行

### ⚠️ 代價

1. **初期時間投入** ⬆️
   - 遷移需要 2-3 小時
   - 配置需要重新驗證

2. **程式碼部分重複**
   - Shared code 有輕微重複（但量很小）
   - Git hooks, 文檔系統需要分別維護

3. **需要維護兩個 repos**
   - 主站 + 字典站
   - 但長期來看更清晰

---

## 風險管理

### 已識別風險

1. **功能遺漏**
   - **Mitigation**: 9-phase 增量驗證，每階段測試

2. **配置錯誤**
   - **Mitigation**: 從 my-website 複製驗證過的配置

3. **部署問題**
   - **Mitigation**: Phase 9 完整部署測試

4. **主站整合困難**
   - **Mitigation**: Phase 8 提前規劃整合方式

---

## Timeline

### 階段 0：規劃與文檔 ✅ (當前)

- [x] 建立新 repo 結構
- [x] 撰寫 ADR 001: 拆分決策
- [x] 撰寫 ADR 002: Monorepo 架構
- [x] 建立 Migration Plan
- [x] 在主站記錄遷移資訊

### 階段 1-9：執行遷移 ⏳ (接下來)

詳見 [ai-dictionary/docs/guides/migration-plan.md](https://github.com/u88803494/ai-dictionary/blob/main/docs/guides/migration-plan.md)

### 階段 10：主站整合 ⏳ (遷移後)

- [ ] 決定整合方式（移除 or 保留 demo）
- [ ] 更新作品集連結
- [ ] 更新 SEO 和 sitemap
- [ ] 監控舊路由流量

---

## 相關資源

### AI Dictionary 新 Repo

- **GitHub**: [u88803494/ai-dictionary](https://github.com/u88803494/ai-dictionary)
- **部署 URL**: `dictionary.henryleelab.com`
- **文檔**: [ai-dictionary/docs](https://github.com/u88803494/ai-dictionary/tree/main/docs)

### 相關文檔

- [ADR 001: Separation Decision](https://github.com/u88803494/ai-dictionary/blob/main/docs/adr/001-separation-from-main-website.md)
- [ADR 002: Monorepo Architecture](https://github.com/u88803494/ai-dictionary/blob/main/docs/adr/002-monorepo-architecture.md)
- [Migration Plan](https://github.com/u88803494/ai-dictionary/blob/main/docs/guides/migration-plan.md)
- [Gemini Clean Slate Plan (存檔)](https://github.com/u88803494/ai-dictionary/blob/main/docs/adr/archive/gemini-clean-slate-plan.md)

### 相關 Issues

- [Issue #35: AI Dictionary Independence](https://github.com/u88803494/my-website/issues/35)
- [Issue #36: UI Enhancement](https://github.com/u88803494/my-website/issues/36)
- [Issue #37: Dark Mode](https://github.com/u88803494/my-website/issues/37)
- [Issue #38: Theme Customization](https://github.com/u88803494/my-website/issues/38)
- [Issue #32: Voice Input](https://github.com/u88803494/my-website/issues/32)
- [Issue #33: Learning Progress](https://github.com/u88803494/my-website/issues/33)
- [Issue #10: Search Bar Optimization](https://github.com/u88803494/my-website/issues/10)

---

## 結論

AI Dictionary 的遷移代表了專案的**重要里程碑**：

1. **務實潔癖**：選擇乾淨但不過度設計的架構
2. **商業彈性**：為未來商業化保留空間
3. **作品集價值**：仍能在主站展示技術能力
4. **風險控管**：採用增量驗證策略，降低遷移風險

這是一個基於**時間成本**、**當前需求**和**未來彈性**的務實決策。

---

**文檔建立日期**: 2025-11-12
**負責人**: Henry Lee
**狀態**: 規劃完成，等待執行
