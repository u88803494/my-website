# ADR 004: 台北租屋自動化 Feature

## Status

✅ Accepted (2025-11-14)

---

## Context

需要自動化台北租屋資訊收集，減少手動搜尋時間成本，提升找房效率。

### 背景需求

- **時間限制**：1 個月內找到符合條件的房源
- **地區範圍**：中山區、松山區、中正區、文山區（平地）、信義區（永春/後山埤）
- **預算上限**：≤ 12,000 元/月（含管理費）
- **必要條件**：水泥隔間、硫化銅門、獨立電表或 ≤6 元電費、對外窗
- **加分條件**：浴室對外窗、電梯、非一樓、變頻冷暖空調

### 現狀問題

1. 手動搜尋每天需 1-2 小時
2. 資訊分散在 18+ 個 Facebook 社團
3. 好房源稍縱即逝（數小時內被租走）
4. 需人工逐一檢查詳細條件
5. 重複勞動，效率低下

---

## Decision

### 1. 實作為 my-website Monorepo 的獨立 Feature

**決策**：整合到現有的 `my-website` 專案，而非建立獨立的 repository。

**理由**：

- ✅ **重用基礎設施**：Next.js、TypeScript、Tailwind、React Query、Vercel 部署
- ✅ **降低成本**：無需額外的 Vercel 專案、Domain、SSL 憑證
- ✅ **架構一致性**：符合現有的 feature-based 設計模式
- ✅ **快速開發**：共用 monorepo 的開發工具鏈（ESLint、Prettier、pnpm）
- ✅ **簡化維護**：統一的依賴管理、版本控制、CI/CD

**位置**：

```
apps/my-website/src/features/rental-finder/
├── RentalFinderFeature.tsx
├── components/
├── hooks/
├── utils/
├── types/
└── constants/
```

---

### 2. 使用 Chrome DevTools MCP 進行 Facebook 自動化

**決策**：採用 Chrome DevTools MCP 作為 Facebook 爬蟲工具。

**理由**：

- ✅ **完全自動化**：模擬真實用戶行為，避免被識別為爬蟲
- ✅ **處理動態內容**：Facebook 是 React SPA，需處理 Infinite Scroll
- ✅ **避免封鎖**：使用真實瀏覽器環境，通過 Cookie 持久化
- ✅ **MCP 整合**：已在專案中使用，無需額外配置

**替代方案及其劣勢**：

- ❌ Facebook Graph API：無公開的租屋社團 API
- ❌ Puppeteer/Playwright 直接：需額外學習，與現有工具不一致
- ❌ 手動操作：無法自動化，違背初衷

---

### 3. Facebook 社團優先，591 為輔助

**決策**：Facebook 租屋社團作為主要資料來源，591 作為輔助。

**理由**：

- ✅ **房東直租**：跳過仲介，節省仲介費（通常 1 個月租金）
- ✅ **即時性**：分鐘級更新，搶得先機
- ✅ **真實性**：社群監督，詐騙率較低
- ✅ **彈性溝通**：直接與房東協商
- ✅ **資訊豐富**：租客評價、照片、詳細描述

**591 定位**：

- 提供結構化搜尋（地區、價格、坪數）
- 覆蓋不使用 Facebook 的房東
- 專業房源資訊（格局、樓層、設備）

---

### 4. 使用 Telegram Bot 發送通知

**決策**：採用 Telegram Bot API 作為通知系統。

**理由**：

- ✅ **持續可用**：LINE Notify 將於 2025/3/31 停止服務
- ✅ **無訊息限制**：每天可發送數萬則訊息
- ✅ **功能豐富**：互動式按鈕、多圖傳送、位置分享
- ✅ **跨平台**：iOS、Android、Web、Desktop 同步
- ✅ **免費**：無使用成本

**替代方案及其劣勢**：

- ❌ LINE Notify：即將停止服務
- ❌ Email：即時性差，容易被分類到垃圾郵件
- ❌ SMS：成本高，無法傳送圖片

---

### 5. 實作深度條件過濾與符合度評分

**決策**：自動化檢查詳細條件，並計算符合度評分（0-140 分）。

**評分系統**：

- **必要條件**（每項 25 分，總計 100 分）：
  - 水泥隔間
  - 硫化銅門
  - 獨立電表或 ≤6 元電費
  - 對外窗
- **加分條件**（每項 10 分，總計 40 分）：
  - 浴室對外窗
  - 電梯
  - 非一樓
  - 變頻冷暖空調

**通知門檻**：

- ≥ 100 分：發送通知
- ≥ 120 分：優先通知（三顆星標記）
- < 100 分：不通知

**理由**：

- ✅ **減少雜訊**：從 200 筆 → 15 筆
- ✅ **優先級排序**：高分房源優先查看
- ✅ **節省時間**：只看真正符合的房源

---

### 6. 資料儲存使用 Supabase (PostgreSQL)

**決策**：生產環境使用 Supabase，開發環境使用 SQLite。

**理由**：

- ✅ **Vercel 整合**：原生支援，無需額外配置
- ✅ **即時訂閱**（未來功能）：WebSocket 支援
- ✅ **自動備份**：資料安全保障
- ✅ **免費額度**：500MB 資料庫 + 100GB 頻寬
- ✅ **Row Level Security**：資料隔離與權限控制

**替代方案及其劣勢**：

- ❌ Vercel Postgres：額度較小（僅 256MB）
- ❌ MongoDB：NoSQL 對關聯查詢支援較弱
- ❌ 純 SQLite：無法在 Vercel 持久化

---

### 7. Cron Job 排程每小時執行

**決策**：使用 Vercel Cron Jobs，每小時執行一次爬蟲。

**Cron 設定**：

```json
{
  "crons": [
    {
      "path": "/api/rental-finder/scrape",
      "schedule": "0 * * * *"
    }
  ]
}
```

**理由**：

- ✅ **平衡即時性與成本**：好房源通常數小時內有效
- ✅ **避免反爬蟲**：過於頻繁容易被封鎖
- ✅ **免費額度充足**：Vercel 免費方案每月 100 次 Cron（每小時 = 720 次/月）
- ✅ **用戶睡眠時間也工作**：24/7 自動監控

**替代方案及其劣勢**：

- ❌ 每 10 分鐘：過於頻繁，容易被封（144 次/天 = 4320 次/月）
- ❌ 每天 2 次：太慢，錯失好房源
- ❌ GitHub Actions：需額外配置，不如 Vercel Cron 簡單

---

## Consequences

### ✅ Positive

1. **節省時間**：從每天 2 小時 → 每天 10 分鐘（檢查通知）
2. **提升覆蓋率**：從手動 3-5 個社團 → 自動化 18 個社團
3. **即時通知**：從每天檢查 2-3 次 → 每小時自動檢查
4. **精準過濾**：從 200 筆 → 15 筆高符合度房源
5. **零成本**：重用現有基礎設施，無額外費用

### ⚠️ Negative

1. **Facebook 帳號風險**：可能被限制或封鎖（緩解：使用專用帳號、模擬人類行為）
2. **爬蟲維護成本**：Facebook/591 改版需更新選擇器（緩解：模組化設計、完整測試）
3. **資料時效性**：每小時檢查可能錯過極熱門房源（可接受：大部分房源數小時內有效）
4. **耦合度**：與 my-website 專案耦合（可接受：功能相對獨立，易於抽離）

### 🔄 Mitigations

**Facebook 帳號安全**：

- 使用新建的專用帳號
- 漸進式操作（前 7 天保守）
- 隨機延遲（3-10 秒）
- 每天限制爬取次數（5 次/天）

**爬蟲穩定性**：

- 完整的錯誤處理與重試機制
- 日誌記錄與監控
- 自動錯誤通知（Telegram）
- 定期測試與維護

**資料品質**：

- 去重邏輯（相同 URL）
- 符合度評分系統
- 用戶回饋機制（有興趣/不感興趣）
- 定期清理舊資料（30 天）

---

## Alternatives Considered

### 1. 建立獨立的 Repository

**優點**：

- 獨立管理，職責清晰
- 不影響 my-website 專案

**缺點**：

- 重複基礎設施（Next.js、Tailwind、TypeScript 配置）
- 額外的部署成本（Vercel 專案、Domain、SSL）
- 維護成本高（兩個專案的依賴更新、安全性補丁）

**決策**：❌ 不採用，成本效益不佳

---

### 2. 使用 Puppeteer/Playwright（不使用 MCP）

**優點**：

- 完全掌控瀏覽器
- 生態豐富，文檔完整

**缺點**：

- 需額外學習與配置
- 與現有 Chrome DevTools MCP 不一致
- 無法重用已有的 MCP 整合

**決策**：❌ 不採用，Chrome DevTools MCP 已滿足需求

---

### 3. 使用 LINE Notify

**優點**：

- API 簡單易用
- 許多台灣用戶使用 LINE

**缺點**：

- 2025/3/31 停止服務
- 訊息限制（1000 則/天）
- 功能單一（無互動按鈕）

**決策**：❌ 不採用，即將停止服務

---

### 4. 僅使用 591，不爬 Facebook

**優點**：

- 官方平台，穩定性高
- 結構化資料，易於爬取

**缺點**：

- 缺少房東直租資訊
- 更新頻率較低
- 可能有廣告與舊資訊

**決策**：❌ 不採用，Facebook 社團是主要房源

---

## Related Decisions

- [ADR 001: React Query SSG Pattern](001-react-query-ssg-pattern.md) - 資料獲取模式
- [ADR 002: Feature-Based Architecture](002-feature-based-architecture.md) - 架構模式（假設）
- [ADR 003: Monorepo Management](003-monorepo-management.md) - Monorepo 管理（假設）

---

## References

- [Facebook 社團清單](../reference/rental-finder/facebook-groups.md)
- [Facebook 爬蟲邏輯](../reference/rental-finder/facebook-scraper.md)
- [591 爬蟲邏輯](../reference/rental-finder/591-scraper.md)
- [Telegram 設定](../reference/rental-finder/telegram-config.md)
- [技術策略說明](../explanation/rental-finder-automation-strategy.md)
- [操作指南](../guides/rental-finder-automation.md)

---

**Author**: Claude (AI Assistant)
**Date**: 2025-11-14
**Last Updated**: 2025-11-14
**Status**: Accepted
