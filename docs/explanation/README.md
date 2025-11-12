# 💡 解釋說明 (Explanation)

**以理解為導向的文件** - 概念、脈絡，以及技術決策背後的「原因」。

## 📖 哲學理念

解釋說明文件用於釐清和闡明主題。它們提供脈絡、討論替代方案，並深化理解，而不是教學或指導。

**特點：**

- ✅ 以理解為導向（建立脈絡）
- ✅ 討論替代方案與取捨
- ✅ 提供背景與歷史
- ✅ 解釋「為什麼」而非「如何做」
- ✅ 串聯概念

**不適用於：**

- ❌ 逐步操作指南（請使用 [Guides](../guides/)）
- ❌ 完整技術規格（請使用 [Reference](../reference/)）
- ❌ 從零開始的教學（請使用 [Tutorials](../tutorials/)）

---

## 📚 現有的解釋說明文件

### 架構與設計

- **Feature-Based Architecture** - 為何我們按功能組織程式碼 _(即將推出)_
- **Monorepo Strategy** - 為何選擇 Turborepo 與 monorepo 方法 _(即將推出)_
- **React Query Patterns** - SSG + React Query 整合策略 _(即將推出)_

### 技術決策

- **[Git Hooks Research](./git-hooks-research.md)** - 業界最佳實踐與研究發現

---

## 🎯 何時撰寫解釋說明文件

在以下情況下建立解釋說明文件：

- 技術決策需要理由說明
- 存在多種方法（討論取捨）
- 理解「為什麼」有助於開發者做出更好的選擇
- 概念跨越多個功能
- 歷史脈絡很重要

**適合解釋說明的主題：**

- ✅ 架構模式與原則
- ✅ 技術選擇與替代方案
- ✅ 設計取捨
- ✅ 業界研究與最佳實踐
- ✅ 系統行為與特性

**不適合解釋說明的主題：**

- ❌ 「如何設定 X」 → Guide
- ❌ 「X 的 API 規格」 → Reference
- ❌ 「從零學習 X」 → Tutorial

---

## 🆕 建立新的解釋說明文件

使用 [explanation template](../.templates/explanation-template.md)：

```bash
cp docs/.templates/explanation-template.md docs/explanation/your-explanation.md
```

**命名規範：**

- 使用 kebab-case：`your-explanation.md`
- 概念性名稱：`feature-based-architecture.md`
- 避免 "how-to"：`monorepo-strategy.md` 而非 `how-to-use-monorepo.md`

**必要章節：**

1. Overview（什麼概念/決策）
2. Context（為何重要）
3. Explanation（「為什麼」與「是什麼」）
4. Alternatives（其他方法、取捨）
5. Implications（實務上的意義）
6. Related（交叉參考）

**最佳實踐：**

- 公平地討論替代方案
- 誠實地說明取捨
- 提供歷史脈絡
- 連結到更廣泛的原則
- 連結到 ADR 以取得特定決策

---

## 🤖 給 AI Agent 的指引

當使用者詢問**「為什麼」**或需要**概念理解**時：

1. 檢查是否已有解釋說明文件
2. 若無，使用模板建立
3. 專注於概念，而非程序
4. 討論替代方案與取捨
5. 連結到 ADR 以取得特定決策
6. 連結到 Guide 以取得操作方法

**範例對應：**

- 「為何使用基於功能的資料夾？」 → Feature-Based Architecture 解釋說明
- 「為何將 React Query 與 SSG 一起使用？」 → React Query Patterns 解釋說明
- 「我該如何使用 React Query？」 → Guide（非解釋說明）
- 「React Query 有哪些選項？」 → Reference（非解釋說明）

**與 ADR 的關係：**

- **Explanation**：討論一般概念與替代方案（例如：「Monorepo 策略」）
- **ADR**：記錄此專案的特定決策（例如：「ADR 002：我們選擇 Turborepo」）

解釋說明文件應廣泛討論主題，而 ADR 則記錄我們具體決定的內容。

---

## 🔗 與其他文件類型的關係

```
Explanation → 「為何我們使用 X 模式」
     ↓
   ADR → 「在我們專案中使用 X 的決策」
     ↓
Reference → 「X 的 API 規格」
     ↓
 Guide → 「如何使用 X 來解決 Y」
     ↓
Tutorial → 「學習 X 的基礎」
```

**範例流程：**

1. [Explanation](./react-query-patterns.md) - 討論 SSG + React Query 模式
2. [ADR 001](../adr/001-react-query-ssg-pattern.md) - 記錄我們的特定決策
3. [Reference](../reference/api/) - 記錄我們的 API 規格
4. [Guide](../guides/) - 展示如何實作該模式（未來）
5. [Tutorial](../tutorials/02-adding-new-feature.md) - 透過範例教學
