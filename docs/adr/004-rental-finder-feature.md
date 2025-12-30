# ADR 004: 台北租屋自動化 Feature

## Status

✅ Accepted (2025-11-14)

---

## Context

需要自動化台北租屋資訊收集，減少手動搜尋時間成本。

### 問題

- 手動搜尋每天需 1-2 小時
- 資訊分散在 18+ 個 Facebook 社團
- 好房源數小時內被租走
- 需人工逐一檢查詳細條件

---

## Decision

### 1. 整合到 my-website Monorepo

**決策**：作為 feature 整合到現有專案，而非獨立 repository。

**理由**：

- 重用基礎設施（Next.js、TypeScript、Tailwind、React Query、Vercel）
- 降低成本（無需額外 Vercel 專案、Domain、SSL）
- 符合 feature-based 架構模式

---

### 2. Facebook 社團優先，591 為輔

**決策**：Facebook 租屋社團作為主要資料來源。

**理由**：

- 房東直租，節省仲介費
- 即時性高（分鐘級更新）
- 社群監督，真實性較高
- 直接與房東協商

---

### 3. Chrome DevTools MCP 自動化

**決策**：使用 Chrome DevTools MCP 進行 Facebook 爬蟲。

**理由**：

- 模擬真實用戶，避免被封鎖
- 處理動態內容（React SPA、Infinite Scroll）
- 與專案現有 MCP 整合一致

---

### 4. Telegram Bot 通知

**決策**：使用 Telegram Bot API 發送通知。

**理由**：

- LINE Notify 將於 2025/3/31 停止服務
- 無訊息限制，功能豐富（互動按鈕、多圖、位置）
- 跨平台同步

---

### 5. 深度條件過濾

**決策**：實作符合度評分系統（0-140 分）。

**評分**：

- 必要條件（100 分）：水泥隔間、硫化銅門、獨立電表、對外窗
- 加分條件（40 分）：浴室對外窗、電梯、非一樓、變頻空調
- 門檻：≥100 分發送通知，≥120 分優先通知

**理由**：減少雜訊（200 筆 → 15 筆），優先級排序

---

### 6. Supabase + Vercel Cron

**決策**：

- 資料庫：Supabase (PostgreSQL)
- 排程：Vercel Cron Jobs（每小時執行）

**理由**：

- Vercel 原生整合
- 免費額度充足
- 平衡即時性與成本

---

## Consequences

### ✅ Positive

- 節省時間：每天 2 小時 → 10 分鐘
- 提升覆蓋率：3-5 個社團 → 18 個社團
- 即時通知：每天 2-3 次 → 每小時自動檢查
- 精準過濾：200 筆 → 15 筆高符合度房源
- 零成本：重用現有基礎設施

### ⚠️ Risks

- Facebook 帳號可能被封鎖（緩解：專用帳號、模擬人類行為）
- 爬蟲維護成本（緩解：模組化設計、完整測試）
- 每小時檢查可能錯過極熱門房源（可接受）

---

## References

- [Facebook 社團清單](../reference/rental-finder/facebook-groups.md)
- [技術策略說明](../explanation/rental-finder-automation-strategy.md)

---

**Author**: Claude (AI Assistant)
**Date**: 2025-11-14
**Status**: Accepted
