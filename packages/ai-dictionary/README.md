# @packages/ai-dictionary

> 💡 **Demo 版本** - 2025-11-12
>
> 本 package 為主站的 **demo 展示版本**。完整功能版本已遷移至獨立 repository。
>
> **完整版 Repository**: [u88803494/ai-dictionary](https://github.com/u88803494/ai-dictionary)
> **完整版線上**: [dictionary.henryleelab.com](https://dictionary.henryleelab.com)
>
> **遷移說明**: [docs/explanation/ai-dictionary-migration.md](../../docs/explanation/ai-dictionary-migration.md)

---

AI 字典工具 package，提供 AI 驅動的詞彙分析功能。

**主站版本**：基礎 demo，用於作品集展示
**完整版本**：包含所有進階功能（語音輸入、學習追蹤、用戶系統等）

## 功能

- AI 詞彙分析(中英文)
- 詞源、定義、例句生成
- React Query 整合

## 使用方式

```typescript
import { AIDictionaryFeature } from "@packages/ai-dictionary";

export default function DictionaryPage() {
  return <AIDictionaryFeature />;
}
```

## API

- `AIDictionaryFeature` - 主要組件
- `analyzeWord(word: string, apiKey: string)` - 分析詞彙的服務函數

---

## 版本說明

### 主站 Demo 版 (當前)

**用途**: 作品集展示和基礎功能體驗

**功能**:

- ✅ AI 詞彙分析（中英文）
- ✅ 詞源、定義、例句生成
- ✅ React Query 整合

**限制**:

- 基礎功能展示
- 無用戶系統
- 無進階功能

### 完整版 (dictionary.henryleelab.com)

**用途**: 完整產品，包含所有進階功能

**新增功能** (規劃中):

- 🎤 語音輸入支援 (#32)
- 📊 學習進度追蹤 (#33)
- 🎨 UI 增強與深色模式 (#36, #37, #38)
- 🔍 搜尋欄優化 (#10)
- 👤 用戶系統
- 💾 收藏和歷史記錄

## 遷移資訊

### 為什麼拆分？

AI Dictionary 具有雙重定位：

1. **獨立產品/服務** - 商業化潛力、開發彈性
2. **作品集項目** - 在主站展示技術能力

**解決方案**: 主站保留 demo 版本，完整版獨立發展

### 架構

```
ai-dictionary/ (獨立 monorepo)
├── apps/
│   └── dictionary/        # Next.js 16 完整版
├── packages/
│   ├── shared/
│   ├── tailwind-config/
│   ├── tsconfig/
│   └── eslint-config/
└── docs/                 # Diataxis 文檔系統
```

### 相關文檔

- [遷移說明](../../docs/explanation/ai-dictionary-migration.md)
- [ADR 001: 拆分決策](https://github.com/u88803494/ai-dictionary/blob/main/docs/adr/001-separation-from-main-website.md)
- [ADR 002: Monorepo 架構](https://github.com/u88803494/ai-dictionary/blob/main/docs/adr/002-monorepo-architecture.md)
- [Migration Plan](https://github.com/u88803494/ai-dictionary/blob/main/docs/guides/migration-plan.md)

---

**最後更新**: 2025-11-12
**主站版本**: Demo 展示
**完整版本**: [dictionary.henryleelab.com](https://dictionary.henryleelab.com)
