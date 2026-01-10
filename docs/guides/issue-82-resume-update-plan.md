# Issue #82: 首頁履歷更新實作計劃

> **目標**：將網站首頁履歷內容同步至 CakeResume 最新版本，定位為 **Senior AI Frontend Engineer**

## 概覽

| 項目              | 狀態   | 優先級 |
| ----------------- | ------ | ------ |
| Hero Section 更新 | 待執行 | P0     |
| Skills 區塊重構   | 待執行 | P0     |
| 工作經歷更新      | 待執行 | P0     |
| 作品區確認        | 待執行 | P1     |

---

## 1. Hero Section 更新

**檔案位置**：`apps/my-website/src/features/resume/components/HeroSection/HeroContent.tsx`

### 1.1 職稱更新

```diff
- 前端工程師
+ Senior AI Frontend Engineer
```

### 1.2 簡介內容更新

**目前內容**：

- 四年 Web 開發經驗
- Next.js + TypeScript
- 成本降低 50%、頁面讀取 5 秒→1 秒
- 團隊協作、指導成員
- 準備重返職場

**更新為**：

- 五年+ Web 開發經驗，專注於 **Next.js 15 與生成式 AI 應用整合**
- 建立基於 **Claude Code** 的文件驅動開發流程
- 達成**每日交付 1-2 個生產就緒功能**的目標
- 獨立開發多個 AI 應用（AI Chat、AI Dictionary、AI Analyzer）
- 持續探索 AI-Native 開發模式與最佳實踐

---

## 2. Skills 區塊重構

**檔案位置**：`apps/my-website/src/data/skillData.tsx`

### 2.1 新分類結構

| 新分類            | 技能項目                                                           |
| ----------------- | ------------------------------------------------------------------ |
| **AI 應用開發**   | Vercel AI SDK、Google Gemini API、Prompt Engineering、Streaming UI |
| **現代前端架構**  | Next.js 15、React 19、TypeScript、TanStack Query、Zustand          |
| **UI / 開發工具** | Tailwind CSS、DaisyUI、Turborepo (Monorepo)、Claude Code           |
| **後端經驗**      | Node.js / Express、MongoDB、Supabase                               |

### 2.2 需新增的圖標

```typescript
// 需要從 react-icons 引入
import { SiSupabase, SiGooglegemini } from "react-icons/si";
// Vercel AI SDK 可能需要用通用 AI 圖標或 Vercel 圖標
```

### 2.3 移除/調整項目

- 移除較舊技術：PHP/MySQL、Line LIFF（移至次要）
- 調整層級：將 AI 相關技能提升為「核心專長」

---

## 3. 工作經歷更新

**檔案位置**：`apps/my-website/src/data/experienceData.tsx`

### 3.1 新增：獨立開發期間

```typescript
{
  company: "獨立開發 / 自由工作者",
  role: "Senior AI Frontend Engineer & AI 研究員",
  period: "Apr 2024 ~ Present",
  logoUrl: "/images/logos/freelance.png", // 需要新增 logo
  achievements: [
    {
      title: "AI 應用開發與整合",
      description: "建立個人品牌技術平台 (henryleelab.com)，整合 AI Chat、AI Dictionary、AI Analyzer 等多個 AI 應用模組"
    },
    {
      title: "AI-Native 介面設計",
      description: "開發 Streaming UI 互動介面，解決 LLM 回應延遲的使用者體驗問題"
    },
    {
      title: "開發流程創新",
      description: "建立基於 Claude Code 的文件驅動開發流程，達成每日交付 1-2 個生產就緒功能的目標"
    },
    {
      title: "技術顧問服務",
      description: "提供 AI 整合與前端架構諮詢，協助團隊導入現代化開發工具"
    }
  ],
  techStackGroups: [
    {
      label: "AI 開發",
      items: ["Vercel AI SDK", "Google Gemini API", "Claude Code", "Streaming UI"]
    },
    {
      label: "前端技術",
      items: ["Next.js 15", "TypeScript", "TanStack Query", "Tailwind CSS"]
    }
  ]
}
```

### 3.2 更新：健康益友經歷

在現有成就中加入 AI 輔助開發的描述：

```typescript
{
  title: "AI 輔助開發導入",
  description: "率先在團隊導入 AI 輔助開發工具，提升程式碼撰寫效率與品質"
}
```

---

## 4. 作品區確認

**檔案位置**：`apps/my-website/src/data/projectData.ts`

### 4.1 現有專案狀態

| 專案               | 狀態    | 備註             |
| ------------------ | ------- | ---------------- |
| Henry Lee 個人網站 | ✅ 已有 | 可更新技術棧描述 |
| AI 需求分析器      | ✅ 已有 | 完整             |
| AI 智能中文字典    | ✅ 已有 | 完整             |
| 新典               | ✅ 已有 | 保留             |
| 慈濟產品展示網站   | ✅ 已有 | 完整             |
| React 部落格系統   | ✅ 已有 | 學習專案         |
| 公司官方網站       | ✅ 已有 | 保留             |

### 4.2 需新增專案

**AI Chat - 多模型智慧對話介面**

```typescript
{
  category: "AI 工具 (個人獨立專案)",
  title: "AI Chat - 多模型對話介面",
  description: {
    intro: "支援多模型切換的智慧對話介面，整合 Streaming UI 實現即時回應體驗，展現 AI-Native 應用開發能力。",
    features: [
      "支援多種 AI 模型切換（GPT、Claude、Gemini）",
      "Streaming UI 串流顯示，優化 LLM 回應等待體驗",
      "完整 Markdown 渲染，支援程式碼高亮",
      "對話歷史管理與匯出功能",
      "整合 Vercel AI SDK 實現統一模型介面"
    ]
  },
  techStack: ["Next.js 15", "TypeScript", "Vercel AI SDK", "Tailwind CSS", "Streaming UI"],
  imageUrl: "/images/projects/ai-chat.png", // 需要新增截圖
  links: [
    { label: "預覽網站", url: "https://henryleelab.com/ai-chat" }
  ]
}
```

---

## 5. 額外資源需求

### 5.1 需新增圖片

| 圖片            | 路徑                                  | 用途         |
| --------------- | ------------------------------------- | ------------ |
| 自由工作者 Logo | `/public/images/logos/freelance.png`  | 獨立開發經歷 |
| AI Chat 截圖    | `/public/images/projects/ai-chat.png` | 作品展示     |

### 5.2 可能需要的新圖標

- `SiSupabase` - Supabase
- `SiGooglegemini` - Google Gemini (需確認是否存在)
- Vercel AI SDK (可能用 `SiVercel` 替代)

---

## 6. 實作順序

1. **Phase 1: 資料更新** (優先)
   - [ ] 更新 `skillData.tsx` - 重構技能分類
   - [ ] 更新 `experienceData.tsx` - 新增獨立開發經歷
   - [ ] 更新 `projectData.ts` - 新增 AI Chat 專案

2. **Phase 2: UI 更新**
   - [ ] 更新 `HeroContent.tsx` - 職稱與簡介

3. **Phase 3: 資源補充**
   - [ ] 新增必要的圖片資源
   - [ ] 確認所有圖標可用性

4. **Phase 4: 驗證**
   - [ ] 執行 `pnpm check` 確保無錯誤
   - [ ] 本地預覽確認顯示正確
   - [ ] 響應式設計檢查

---

## 7. 注意事項

- 保持與現有程式碼風格一致
- 使用 `react-icons/si` 作為品牌圖標來源
- 確保所有文字內容使用繁體中文
- 新增的經歷應放在陣列最前面（最新經歷優先）

---

## 參考連結

- **Issue**: [#82](https://github.com/u88803494/my-website/issues/82)
- **CakeResume**: https://www.cake.me/resumes/yuhao-lee
- **網站首頁**: https://henryleelab.com
