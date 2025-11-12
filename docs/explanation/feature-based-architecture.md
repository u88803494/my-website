---
title: Feature-Based Architecture (基於功能的架構)
type: explanation
status: stable
audience: [developer, architect, ai]
tags: [architecture, design, patterns, features, modularity]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/architecture.md
  - explanation/monorepo-strategy.md
  - adr/002-agents-md-adoption.md
  - guides/development-setup.md
ai_context: |
  解釋基於功能架構背後的理由、其優於傳統分層架構的優勢，
  以及如何隨著專案成長而擴展。
---

# Feature-Based Architecture (基於功能的架構)

## 概述

本專案採用 **feature-based architecture（基於功能的架構）**，程式碼按功能（resume、blog、ai-dictionary）組織，而非按技術層級（components、hooks、utils）。

**核心原則**：與一個功能相關的所有內容都放在同一個目錄中。

---

## 為什麼選擇 Feature-Based Architecture？

### 傳統分層架構的問題

在傳統架構中，程式碼按類型組織：

```
src/
├── components/          # 所有 components
│   ├── HeroSection.tsx
│   ├── ExperienceCard.tsx
│   ├── BlogList.tsx
│   ├── DictionaryForm.tsx
│   └── TimeTrackerMain.tsx
├── hooks/              # 所有 hooks
│   ├── useMediumArticles.ts
│   ├── useTimeTracker.ts
│   └── useDictionary.ts
├── types/              # 所有 types
│   ├── article.types.ts
│   ├── timeEntry.types.ts
│   └── dictionary.types.ts
└── utils/              # 所有 utilities
    ├── articleParser.ts
    ├── timeCalculator.ts
    └── wordAnalyzer.ts
```

**隨著專案成長的問題**：

1. **難以找到相關程式碼** - Time tracker 邏輯分散在 4 個以上的目錄中
2. **難以刪除功能** - 必須在每個目錄中搜尋相關檔案
3. **依賴關係不清楚** - 無法分辨哪些 components 依賴哪些 hooks
4. **merge conflicts** - 多個開發者編輯相同的目錄
5. **認知負擔** - 必須在心中建立跨目錄的關係映射
6. **ownership 不明確** - 誰擁有 "components"？每個人都擁有，也沒人擁有

---

## Feature-Based Architecture 解決方案

改為按 **功能** 組織：

```
src/features/
├── resume/                     # Resume/homepage 功能
│   ├── ResumeFeature.tsx       # Orchestrator
│   ├── components/             # Resume 專用 components
│   │   ├── HeroSection/
│   │   └── ExperienceCard/
│   ├── hooks/                  # Resume 專用 hooks
│   ├── types/                  # Resume 專用 types
│   └── index.ts                # Barrel export
├── blog/                       # Blog 功能
│   ├── BlogFeature.tsx
│   ├── components/
│   │   └── BlogList/
│   ├── hooks/
│   │   └── useMediumArticles.ts
│   ├── types/
│   │   └── article.types.ts
│   └── utils/
│       └── articleParser.ts
├── time-tracker/               # Time tracking 功能
│   ├── TimeTrackerFeature.tsx
│   ├── components/
│   ├── hooks/
│   │   └── useTimeTracker.ts
│   ├── types/
│   │   └── timeEntry.types.ts
│   └── utils/
│       └── timeCalculator.ts
└── ai-dictionary/              # AI dictionary 功能
    ├── AIDictionaryFeature.tsx
    ├── components/
    │   └── DictionaryForm/
    ├── hooks/
    │   └── useDictionary.ts
    ├── types/
    │   └── dictionary.types.ts
    └── utils/
        └── wordAnalyzer.ts
```

**優勢**：

1. ✅ **Co-location（共置）** - 所有相關程式碼在同一處
2. ✅ **易於刪除** - 移除整個功能目錄即可
3. ✅ **清楚的依賴關係** - 一目了然功能需要什麼
4. ✅ **減少衝突** - 團隊在不同目錄中工作
5. ✅ **認知清晰** - 無需跳轉就能理解功能
6. ✅ **明確的 ownership** - 每個功能都有定義的擁有者

---

## 架構規則

### ❌ 禁止：跨功能 Imports

功能之間 **不能** 相互 import：

```typescript
// ❌ 錯誤：ai-dictionary 從 blog import
import { useMediumArticles } from "@/features/blog/hooks";
```

**為什麼？** 會造成緊密耦合和依賴鏈。

**強制執行**：ESLint 規則（`no-restricted-imports`）在建置時阻止這種行為。

### ✅ 允許：Shared Package Imports

使用 `@packages/shared` 存放多個功能使用的程式碼：

```typescript
// ✅ 正確：從 shared package import
import { cn } from "@packages/shared/utils";
import type { Article } from "@packages/shared/types";
```

**什麼應該放在 shared 中**：

- **Components**：被 2 個以上功能使用（Button、Card、Modal）
- **Types**：共享的資料結構（Article、User）
- **Constants**：全應用程式的常數（API paths、config）
- **Utilities**：通用的 helpers（cn、formatDate）

### ✅ 允許：Data Imports

資料檔案（如 `articleData.ts`）可以在任何地方 import：

```typescript
// ✅ 正確：Import 資料檔案
import { articleData } from "@packages/shared/data/articleData";
```

---

## Feature 結構模式

每個功能都遵循一致的結構：

```
{feature-name}/
├── {FeatureName}Feature.tsx    # 主要 orchestrator component
├── components/                 # 功能專用 components
│   ├── ComponentA/
│   │   ├── ComponentA.tsx
│   │   ├── SubComponent.tsx
│   │   └── index.ts
│   └── ComponentB/
├── hooks/                      # 功能專用 hooks
│   ├── useFeatureData.ts
│   └── useFeatureLogic.ts
├── types/                      # 功能專用 types
│   └── feature.types.ts
├── utils/                      # 功能專用 utilities
│   └── featureHelpers.ts
├── constants/                  # 功能專用 constants
│   └── featureConstants.ts
└── index.ts                    # Barrel export（匯出 Feature component）
```

### "Feature" Component

每個功能都有一個主要 orchestrator component：

```typescript
// TimeTrackerFeature.tsx
export const TimeTrackerFeature: React.FC = () => {
  // 1. 資料獲取和狀態管理
  const { entries, isLoading } = useTimeTracker();

  // 2. 邊界情況的提前返回
  if (isLoading) return <LoadingState />;

  // 3. 使用子元件的主要渲染
  return (
    <div>
      <HeaderSection />
      <MainTabContent entries={entries} />
      <FooterSection />
    </div>
  );
};
```

**職責**：

- 協調子元件
- 管理功能層級的狀態
- 處理資料獲取
- 控制 error/loading/empty 狀態

---

## 可擴展性優勢

### 易於新增功能

**新增新功能**：

```bash
# 建立功能目錄
mkdir -p src/features/new-feature/components

# 從模板複製
cp src/features/resume/ResumeFeature.tsx \
   src/features/new-feature/NewFeature.tsx
```

無需修改現有程式碼。功能是隔離的。

### 易於移除功能

**移除功能**：

```bash
# 刪除功能目錄
rm -rf src/features/old-feature

# 移除路由（如果有）
rm src/app/old-feature/page.tsx
```

無需在多個目錄中搜尋並刪除。

### 團隊協作

**多個團隊同時工作**：

- **Team A**：在 `features/resume/` 中工作
- **Team B**：在 `features/blog/` 中工作
- **Team C**：在 `features/time-tracker/` 中工作

**結果**：大多數情況下零 merge conflicts。

### 程式碼理解

**新開發者入職**：

```bash
# "Time tracker 邏輯在哪裡？"
cd src/features/time-tracker
# 所有東西都在這裡！
```

無需學習整個程式碼庫結構。

---

## 考慮過的替代方案

### 1. Domain-Driven Design (DDD)

**結構**：

```
src/domains/
├── user/
├── article/
└── time/
```

**優點**：

- 與業務領域一致
- 清楚的領域邊界

**缺點**：

- 對小專案來說過度複雜
- 複雜的領域映射
- 更多抽象層

**為什麼不選擇**：對個人作品集網站來說太重量級。

### 2. Layered Architecture（分層架構）

**結構**：

```
src/
├── presentation/
├── application/
├── domain/
└── infrastructure/
```

**優點**：

- 清楚的關注點分離
- 遵循 clean architecture

**缺點**：

- 難以導覽
- 功能邏輯分散
- 對前端來說過度複雜

**為什麼不選擇**：對 Next.js 應用程式來說層級太多。

### 3. Atomic Design

**結構**：

```
src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

**優點**：

- 適合設計系統
- 清楚的元件層級

**缺點**：

- 只關注 UI
- 不組織 hooks/utils
- 難以分類元件

**為什麼不選擇**：無法解決功能隔離問題。

---

## 權衡取捨

### 我們獲得的

- ✅ **Co-location** - 相關程式碼保持在一起
- ✅ **可擴展性** - 易於新增/移除功能
- ✅ **團隊效率** - 減少衝突和認知負擔
- ✅ **可維護性** - 清楚的 ownership 和邊界

### 我們接受的

- ⚠️ **重複** - 某些程式碼可能在功能間重複（可接受）
- ⚠️ **重構成本** - 提取共享程式碼需要移到 `@packages/shared`
- ⚠️ **檔案導覽** - 更多目錄需要導覽（可透過編輯器搜尋緩解）

### 重複 vs 耦合

**哲學**：優先選擇重複而非錯誤的耦合。

**範例**：兩個功能需要日期格式化。

**❌ 錯誤**：立即建立 `@packages/shared/utils/formatDate.ts`
**✅ 正確**：先讓每個功能各自實作，當 3 個以上功能需要時才提取到 shared

**為什麼？** 過早抽象比重複更糟。等到模式清楚再行動。

---

## 實作細節

### ESLint 強制執行

架構由 ESLint 強制執行：

```javascript
// .eslintrc.js
rules: {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['@/features/*/hooks', '@/features/*/types', '@/features/*/components'],
          message: 'Cannot import from other features. Use @packages/shared instead.'
        }
      ]
    }
  ]
}
```

**結果**：如果嘗試跨功能 import，建置會失敗。

### TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["src/features/*"],
      "@packages/*": ["../../packages/*"]
    }
  }
}
```

**結果**：清楚邊界的乾淨 imports。

---

## 演進路徑

### Phase 1：小型專案（目前）

- 功能作為目錄
- 最少的共享程式碼
- 在 pages 中直接 import 功能

### Phase 2：中型專案（未來）

- 提取常見模式到 `@packages/shared`
- 建立 feature flags 用於 A/B 測試
- 透過 event bus 新增功能間通訊

### Phase 3：大型專案（如果需要）

- 將功能分割為獨立 packages
- 實作 micro-frontends
- 新增功能層級的 dependency injection

**目前狀態**：Phase 1。將根據需要演進。

---

## 相關模式

### Next.js App Router 整合

```
src/
├── app/                    # Next.js 路由
│   ├── page.tsx            # → resume 功能
│   ├── blog/page.tsx       # → blog 功能
│   └── time-tracker/page.tsx  # → time-tracker 功能
└── features/               # 功能實作
    ├── resume/
    ├── blog/
    └── time-tracker/
```

**Pages** 是輕量級的包裝，import **功能**。

### Shared Component Library

```
packages/shared/
└── src/
    └── components/
        ├── ui/             # 通用 UI（Button、Modal）
        └── layout/         # Layout components（Header、Footer）
```

**Shared components** 沒有功能特定的邏輯。

---

## 最佳實踐

### ✅ 應該做的

1. **Co-locate 所有東西** - 保持功能程式碼在一起
2. **使用 feature orchestrators** - 主要 Feature component 協調子元件
3. **只在需要時提取到 shared** - 等待 3 個以上的使用
4. **遵循一致結構** - 所有功能看起來都一樣
5. **尊重邊界** - 不跨功能 import

### ❌ 不應該做的

1. **不要跨功能 import** - 使用 `@packages/shared` 代替
2. **不要過早建立 shared 程式碼** - 等待清楚的模式
3. **不要混合功能和 shared 邏輯** - 保持它們分離
4. **不要深層嵌套功能** - 保持功能目錄扁平
5. **不要跳過 Feature component** - 總是建立 orchestrator

---

## 真實世界範例

### 範例 1：Time Tracker Feature

**結構**：

```
features/time-tracker/
├── TimeTrackerFeature.tsx          # Orchestrator
├── components/
│   ├── HeaderSection/              # Header with tabs
│   ├── MainTabContent/             # Main content area
│   │   ├── MainTab.tsx
│   │   ├── WeeklyTab.tsx
│   │   └── SettingsTab.tsx
│   ├── TimerDisplay/               # Current timer
│   └── TimeEntryCard/              # Entry list item
├── hooks/
│   ├── useTimeTracker.ts           # Main state management
│   ├── useWeeklyStats.ts           # Weekly statistics
│   └── useUserSettings.ts          # User preferences
├── utils/
│   ├── timeCalculator.ts           # Duration calculations
│   ├── timeFormatter.ts            # Display formatting
│   └── timeValidator.ts            # Input validation
└── types/
    └── timeEntry.types.ts          # TimeEntry, UserSettings
```

**為什麼有效**：

- 所有 time tracker 邏輯在一處
- 可以刪除整個功能而不需搜尋檔案
- 團隊可以在 time tracker 上工作而不產生衝突
- 新開發者在 `features/time-tracker/` 中找到所有東西

### 範例 2：Blog Feature

**結構**：

```
features/blog/
├── BlogFeature.tsx                 # Orchestrator
├── components/
│   ├── ArticleCard/                # Individual article
│   └── EmptyState/                 # No articles state
├── hooks/
│   └── useMediumArticles.ts        # Infinite scroll data fetching
└── types/
    └── article.types.ts            # Article type (extends shared Article)
```

**為什麼有效**：

- 簡單的功能，簡單的結構
- 使用 React Query 進行資料獲取
- 重用 shared `Article` type 但擴展它
- 不需要 utils（使用 shared utilities）

---

## 結論

Feature-based architecture 是本專案的正確選擇，因為：

1. **可擴展性**：隨需求變化易於新增/移除功能
2. **可維護性**：清楚的邊界和 ownership
3. **開發者體驗**：減少認知負擔和 merge conflicts
4. **靈活性**：如果需要可以演進到更複雜的模式

**哲學**：從簡單開始，根據需要演進，優先考慮開發者體驗。

---

## 相關文件

- [Architecture Reference](../reference/architecture.md) - 完整系統架構
- [Monorepo Strategy](./monorepo-strategy.md) - 為什麼選擇 Turborepo
- [Development Setup](../guides/development-setup.md) - 如何本地設定
- [ADR 002: AGENTS.md Adoption](../adr/002-agents-md-adoption.md) - AI 優先開發

---

## 延伸閱讀

- [Feature-Sliced Design](https://feature-sliced.design/) - 類似方法論
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - 企業級替代方案
- [The Mikado Method](https://mikadomethod.info/) - 重構策略
- [Modular Monoliths](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer) - 架構演進
