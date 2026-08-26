---
title: GitHub Issue 管理指南（Issue Management Guide）
type: guide
status: stable
audience: [developer, ai]
tags: [github, issues, workflow, labels, priority]
created: 2026-08-26
updated: 2026-08-26
difficulty: beginner
estimated_time: 10 分鐘
related:
  - guides/git-workflow.md
ai_context: |
  本專案的 P0-P3 四級優先級系統與 label 慣例，涵蓋 issue 建立、triage、
  狀態流轉與關閉的完整流程。
---

# Issue 管理指南

本專案使用 P0-P3 四級優先級系統管理 GitHub Issues，確保開發工作有序進行。

## 📊 優先級系統

| 優先級 | Label         | 定義                                          | 時間預期                 | 範例                                                                                   |
| ------ | ------------- | --------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| **P0** | `p0-critical` | 🔥 Critical：網站無法運作、資料遺失、安全漏洞 | **立即處理**（24小時內） | • Vercel 部署失敗導致網站無法訪問<br>• API 全部回傳 500 錯誤<br>• 安全漏洞暴露 API key |
| **P1** | `p1-high`     | ⚡ High：核心功能損壞、嚴重影響使用者體驗     | **本週內**               | • Blog 文章無法顯示<br>• AI Dictionary 功能完全失效<br>• 手機版嚴重跑版                |
| **P2** | `p2-medium`   | 📌 Medium：重要功能、技術債、優化             | **本月內或下個 Sprint**  | • 統一錯誤處理系統<br>• 結構化日誌系統<br>• 效能優化                                   |
| **P3** | `p3-low`      | 💡 Low：Nice-to-have、實驗性功能、小改進      | **有空再做**             | • 新的 AI 功能實驗<br>• UI 微調<br>• 文檔小改進                                        |

### 優先級原則

- **P0 極少出現**：一年可能 0-2 次，出現時必須立即處理
- **P1 應該不多**：每月 1-3 個，影響核心功能或大量使用者
- **大部分是 P2**：正常的功能開發和技術債
- **P3 靈活處理**：定期 review，決定是否升級或關閉

---

## 🏷️ Label 系統

### 優先級 Labels（必須有一個）

- `p0-critical` - 🔥 Critical
- `p1-high` - ⚡ High
- `p2-medium` - 📌 Medium
- `p3-low` - 💡 Low

### 類型 Labels

- `bug` - 🐛 Bug：功能錯誤
- `enhancement` - ✨ Enhancement：新功能
- `refactor` - ♻️ Refactor：重構與技術債
- `performance` - ⚡ Performance：效能優化
- `security` - 🔒 Security：安全性問題
- `dependencies` - 📦 Dependencies：依賴更新
- `documentation` - 📚 Documentation：文檔改進

### 狀態 Labels

- `status:needs-triage` - 🔍 需要審查與分類
- `status:ready` - ✅ 已準備好可開始
- `status:in-progress` - 🔄 進行中
- `status:blocked` - 🚧 被其他 issue 阻擋

### 範圍 Labels（可複選）

- `scope:frontend` - 🎨 前端相關
- `scope:backend` - ⚙️ 後端/API
- `scope:ai` - 🤖 AI 功能
- `scope:blog` - 📝 Blog 功能
- `scope:devops` - 🔧 DevOps/部署

### 工作量 Labels（可選）

- `effort:1-small` - 🕐 1-2 小時
- `effort:2-medium` - 🕑 半天
- `effort:3-large` - 🕓 1-2 天
- `effort:4-xlarge` - 🕗 3+ 天

---

## 📋 Issue 工作流程

### 1. Issue 建立

使用 Issue Templates 建立：

- 🐛 **Bug Report** - 回報功能錯誤
- ✨ **Feature Request** - 提出新功能
- ♻️ **Technical Debt** - 技術債、重構、優化

系統會自動加上 `status:needs-triage` label。

### 2. Triage（分類）

開發者評估 issue：

- 確認優先級，加上 `p0-p3` label
- 加上類型 label（`bug`, `enhancement`, 等）
- 加上範圍 label（`scope:frontend`, 等）
- 評估工作量（可選）
- 移除 `status:needs-triage`，加上 `status:ready`

### 3. 開始工作

- 加上 `status:in-progress`
- （可選）指派給自己

### 4. 遇到阻礙

- 加上 `status:blocked`
- 在 comment 說明被什麼阻擋

### 5. 完成

- 關閉 issue
- 在 commit message 或 PR 中引用 issue number（例如：`Closes #35`）

---

## ✅ 最佳實踐

### Label 使用

- ✅ **每個 issue 都應該有一個優先級 label**
- ✅ 至少有一個類型 label
- ✅ 可以有多個範圍 label
- ✅ 工作量 label 幫助估算 sprint 容量

### 優先級管理

- ✅ **P0/P1 應該立即處理**
- ✅ P2 應該在本月內完成
- ✅ **定期 review P3 issues**（每季），決定是否：
  - 升級到 P2（變重要了）
  - 保持 P3（仍然想做）
  - 關閉（不再需要）

### Issue 描述

- ✅ 標題清楚簡潔
- ✅ Bug 包含重現步驟
- ✅ Feature 說明為什麼需要
- ✅ 技術債說明現況和改進方式

### 關閉 Issue

適當時候關閉 issue：

- ✅ 已完成並驗證
- ✅ 重複的 issue（註明被哪個取代）
- ✅ 不會做的功能（說明原因）
- ✅ 已過時的需求

---

## 🔍 常用篩選

### 依優先級

- [P0 Critical Issues](https://github.com/u88803494/my-website/labels/p0-critical)
- [P1 High Issues](https://github.com/u88803494/my-website/labels/p1-high)
- [P2 Medium Issues](https://github.com/u88803494/my-website/labels/p2-medium)
- [P3 Low Issues](https://github.com/u88803494/my-website/labels/p3-low)

### 依狀態

- [需要 Triage](https://github.com/u88803494/my-website/labels/status%3Aneeds-triage)
- [準備開始](https://github.com/u88803494/my-website/labels/status%3Aready)
- [進行中](https://github.com/u88803494/my-website/labels/status%3Ain-progress)
- [被阻擋](https://github.com/u88803494/my-website/labels/status%3Ablocked)

### 依範圍

- [Frontend Issues](https://github.com/u88803494/my-website/labels/scope%3Afrontend)
- [Backend Issues](https://github.com/u88803494/my-website/labels/scope%3Abackend)
- [AI Issues](https://github.com/u88803494/my-website/labels/scope%3Aai)

---

## 📚 參考資料

- [GitHub Issues 文檔](https://docs.github.com/en/issues)
- [優先級系統參考](https://fibery.io/blog/product-management/p0-p1-p2-p3-p4/)
- [Apache Beam Issue Priorities](https://beam.apache.org/contribute/issue-priorities/)

---

## 🤝 協作指南

### 對於協作者

1. **建立 Issue 前先搜尋**，避免重複
2. **使用 Templates** 提供完整資訊
3. **回應 Triage** 評估，確認優先級是否合理
4. **更新狀態** 當開始工作或遇到問題

### 對於維護者

1. **定期 Triage**（建議每週）
2. **P0/P1 即時處理**
3. **每月 review P2**，確保進度
4. **每季 review P3**，清理過時 issues
5. **善用 Labels** 組織和篩選

---

**最後更新**：2025-11-04
