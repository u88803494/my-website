# 📚 文件系統

本專案使用 [Diataxis framework](https://diataxis.fr/) 組織文件，針對 AI 和人類讀者優化。

## 🎯 文件哲學

- **AI 優先**：結構化設計，方便 LLM 理解和生成
- **人類友善**：清晰的導航，適合開發者和利害關係人
- **可擴展**：隨著專案複雜度成長
- **可搜尋**：輕鬆找到所需內容

---

## 📖 文件類型

Diataxis framework 根據使用者需求將文件分為四種類型：

```
                學習導向
                   │
          教學     │    操作指南
        (Tutorials)│   (Guides)
    學習 ────────────┼──────────────── 目標
                   │
        概念說明    │     技術參考
      (Explanation)│   (Reference)
                   │
                理解導向
```

### 🛠️ [Guides](./guides/) - 操作指南

**問題導向**：解決特定問題的逐步說明。

- [Git Workflow](./guides/git-workflow.md) - 使用 git hooks 和自動化
- [Development Setup](./guides/development-setup.md) - 設定本地開發環境
- Deployment - 部署到正式環境 _(規劃中)_
- Contributing - 如何貢獻此專案 _(規劃中)_

**何時使用**：「我該如何...？」類型的問題

---

### 📖 [Tutorials](./tutorials/) - 學習路徑

**學習導向**：學習基本概念的引導課程。

- [01 - Project Setup](./tutorials/01-project-setup.md) - 從零開始到 hello world
- 02 - Adding New Feature - Feature 開發流程 _(規劃中)_
- 03 - Medium Integration - 使用 Medium API _(規劃中)_

**何時使用**：新人入職或學習新概念

---

### 📋 [Reference](./reference/) - 技術規格

**資訊導向**：完整的技術細節、API 和設定。

- [Architecture](./reference/architecture.md) - 系統架構總覽
- [API Reference](./reference/api/) - REST API 規格
- [Commitlint Rules](./reference/commitlint-rules.md) - Commit 訊息規則
- [Git Hooks](./reference/git-hooks.md) - Git hooks 設定
- [Facebook 租屋社團清單](./reference/rental-finder/facebook-groups.md) - 18 個台北租屋社團
- Environment Variables - 所有環境變數 _(規劃中)_
- CLI Commands - 可用指令 _(規劃中)_

**何時使用**：查詢精確規格或 API 細節

---

### 💡 [Explanation](./explanation/) - 概念與脈絡

**理解導向**：為什麼這樣設計、背景知識。

- [Feature-Based Architecture](./explanation/feature-based-architecture.md) - 為什麼用 feature 資料夾
- [React Query Patterns](./explanation/react-query-patterns.md) - SSG + React Query 策略
- [Monorepo Strategy](./explanation/monorepo-strategy.md) - 為什麼用 Turborepo
- [Git Hooks Research](./explanation/git-hooks-research.md) - 業界最佳實踐
- [Rental Finder Automation Strategy](./explanation/rental-finder-automation-strategy.md) - 租屋自動化技術選型

**何時使用**：理解技術決策背後的「為什麼」

---

### 📝 [ADR](./adr/) - 架構決策記錄

**決策導向**：重大技術決策的歷史記錄。

- [ADR Template](./adr/template.md) - 新 ADR 的範本
- [001 - React Query SSG Pattern](./adr/001-react-query-ssg-pattern.md)
- [002 - Agents.md Adoption](./adr/002-agents-md-adoption.md)
- [003 - Git Hooks Optimization](./adr/003-git-hooks-optimization.md)
- [004 - Rental Finder Feature](./adr/004-rental-finder-feature.md) - 台北租屋自動化整合決策

**何時使用**：做出或理解重大架構決策

---

## 🤖 給 AI Agents

### 文件 Metadata

所有文件都包含 YAML frontmatter：

```yaml
---
title: 文件標題
type: guide|tutorial|reference|explanation|adr
status: draft|review|stable|deprecated
audience: [developer, ai, end-user]
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
related:
  - path/to/related/doc.md
ai_context: |
  簡短的上下文說明，幫助 AI 理解目的和範圍。
---
```

### 文件範本

生成新文件時使用 [`docs/.templates/`](./.templates/) 中的範本：

- [Guide Template](./.templates/guide-template.md)
- [Tutorial Template](./.templates/tutorial-template.md)
- [Reference Template](./.templates/reference-template.md)
- [Explanation Template](./.templates/explanation-template.md)

### 交叉引用

文件使用相對路徑連結到相關內容。AI agents 應該：

1. 檢查 frontmatter 中的 `related` 欄位
2. 跟隨交叉引用連結
3. 理解文件之間的關係

---

## 🔍 快速導航

### 我想要...

- **從零開始學習專案** → 從 [Tutorials](./tutorials/) 開始
- **解決特定問題** → 查看 [Guides](./guides/)
- **查詢技術細節** → 參考 [Reference](./reference/)
- **理解決策理由** → 閱讀 [Explanation](./explanation/) 或 [ADR](./adr/)
- **做出架構決策** → 使用範本建立新 [ADR](./adr/)

### 依主題分類

- **Git & CI/CD**: [Git Workflow Guide](./guides/git-workflow.md), [Git Hooks Reference](./reference/git-hooks.md), [Git Hooks Research](./explanation/git-hooks-research.md), [ADR 003](./adr/003-git-hooks-optimization.md)
- **架構**: [Architecture Reference](./reference/architecture.md), [Feature-Based Explanation](./explanation/feature-based-architecture.md)
- **API**: [API Reference](./reference/api/)
- **React Query**: [React Query Patterns](./explanation/react-query-patterns.md), [ADR 001](./adr/001-react-query-ssg-pattern.md)
- **租屋自動化**: [Technical Strategy](./explanation/rental-finder-automation-strategy.md), [Facebook Groups](./reference/rental-finder/facebook-groups.md), [ADR 004](./adr/004-rental-finder-feature.md)

---

## 📝 貢獻文件

1. 使用 Diataxis 原則選擇正確的文件類型
2. 從 [`docs/.templates/`](./.templates/) 使用適當的範本
3. 包含所有必要欄位的 YAML frontmatter
4. 加入相關文件的交叉引用
5. 遵循專案的寫作風格（參考 [AGENTS.md](../AGENTS.md) 的程式碼標準）
6. 如果新增頂層文件，請更新本 README

---

## 📚 延伸閱讀

- [Diataxis Framework](https://diataxis.fr/) - 官方文件
- [AGENTS.md](../AGENTS.md) - 本專案的 AI agent 設定
- [CLAUDE.md](../CLAUDE.md) - Claude Code 專屬指示
