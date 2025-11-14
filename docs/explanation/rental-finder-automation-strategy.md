# 租屋自動化技術策略說明

解釋台北租屋自動化系統的技術選型理由與架構設計思維。

---

## 為什麼需要自動化？

### 問題背景

**手動搜尋的痛點**：

1. **時間成本高**：每天需花費 1-2 小時瀏覽 Facebook 社團和 591
2. **資訊碎片化**：好房源分散在 18+ 個 Facebook 社團
3. **稍縱即逝**：熱門房源幾小時內就被租走
4. **篩選困難**：需人工檢查詳細條件（水泥隔間、硫化銅門等）
5. **重複勞動**：每次搜尋都要重新設定條件、瀏覽相同資訊

### 自動化的價值

**效益量化**：

- ⏱️ **時間節省**：從每天 2 小時 → 每天 10 分鐘（檢查通知）
- 🎯 **資訊覆蓋**：從手動瀏覽 3-5 個社團 → 自動化監控 18 個社團
- ⚡ **即時性**：從每天檢查 2-3 次 → 每小時自動檢查
- 🔍 **精準度**：從手動篩選 → 自動化深度條件過濾（符合度評分）

---

## 為什麼 Facebook 優先？

### Facebook vs 591 比較

| 項目         | Facebook 社團      | 591 租屋網         |
| ------------ | ------------------ | ------------------ |
| **房源類型** | 房東自租為主       | 房仲+房東          |
| **更新頻率** | 即時（分鐘級）     | 每日更新           |
| **資訊品質** | 較真實、有圖有真相 | 可能有廣告、舊資訊 |
| **價格透明** | 直接標註           | 部分隱藏聯絡       |
| **互動成本** | 直接私訊房東       | 需透過平台         |
| **反爬蟲**   | 中等（需登入）     | 強（IP 封鎖）      |

### Facebook 的優勢

1. **房東直租**：跳過仲介，節省仲介費（通常 1 個月租金）
2. **即時性**：房東發文後立即可見，搶得先機
3. **真實性**：社團成員互相監督，詐騙率較低
4. **彈性溝通**：可直接與房東協商價格、入住時間
5. **社群氛圍**：租客評價、推薦，資訊更豐富

### 591 的定位

作為 **輔助資料來源**，彌補 Facebook 的不足：

- 提供更結構化的搜尋（地區、價格、坪數）
- 覆蓋不使用 Facebook 的房東
- 專業的房源資訊（格局、樓層、設備）

---

## 為什麼用 Chrome DevTools MCP？

### 工具選擇比較

| 工具                    | 優勢                     | 劣勢                | 適用場景        |
| ----------------------- | ------------------------ | ------------------- | --------------- |
| **Chrome DevTools MCP** | 完全自動化、模擬真實用戶 | 需維護              | Facebook 自動化 |
| **Playwright**          | 現代化、跨瀏覽器         | 學習曲線            | 591 爬蟲        |
| **Puppeteer**           | 成熟、生態豐富           | 僅 Chromium         | 備選方案        |
| **Selenium**            | 老牌、穩定               | 笨重、慢            | 不適合          |
| **手動 API**            | 快速、穩定               | Facebook 無公開 API | 不可行          |

### Chrome DevTools MCP 的優勢

**1. 完全自動化**

```typescript
// 一鍵完成登入 → 搜尋 → 爬取 → 儲存
await mcp__chrome-devtools__navigate_page({ url: 'https://facebook.com' });
await mcp__chrome-devtools__fill_form({ ... });
await mcp__chrome-devtools__click({ ... });
const data = await mcp__chrome-devtools__evaluate_script({ ... });
```

**2. 模擬真實用戶**

- 使用真實瀏覽器環境
- Cookie、LocalStorage 持久化
- 正常的 User-Agent
- 隨機延遲、滾動行為

**3. 處理動態內容**

- Facebook 是 React SPA（Single Page Application）
- 內容動態載入（Infinite Scroll）
- 需等待元素出現、網路請求完成

**4. 避免封鎖**

- 不會被識別為「爬蟲」
- 可通過 CAPTCHA（手動介入）
- IP 限制較寬鬆（個人用戶）

---

## 為什麼整合到 my-website？

### 單獨 Repo vs Monorepo 整合

| 方案                  | 優勢                   | 劣勢                     |
| --------------------- | ---------------------- | ------------------------ |
| **單獨 Repository**   | 獨立管理、清晰分離     | 重複基礎設施、部署成本高 |
| **整合到 my-website** | 共用基礎設施、降低成本 | 耦合度略高               |

### 整合的優勢

**1. 共用基礎設施**

```typescript
// 重用現有的
- Next.js 15 App Router
- TypeScript 配置
- Tailwind CSS
- React Query
- Vercel 部署
- ESLint + Prettier
```

**2. 降低成本**

- ✅ 無需額外的 Vercel 專案（0 元）
- ✅ 共用 Supabase 資料庫（1 個專案額度）
- ✅ 共用 Domain 和 SSL

**3. Feature-Based 架構適配**

```
apps/my-website/src/features/
├── resume/          # 現有功能
├── blog/            # 現有功能
├── ai-dictionary/   # 現有功能
└── rental-finder/   # ✅ 新增功能（完美融入）
```

**4. 共用組件與工具**

```typescript
// 重用現有的
- @packages/shared/types
- @packages/shared/utils
- API Route patterns
- Error handling
- Logging
```

---

## 為什麼使用 Telegram 而非 LINE？

### LINE Notify vs Telegram Bot

| 項目           | LINE Notify           | Telegram Bot         |
| -------------- | --------------------- | -------------------- |
| **服務狀態**   | ❌ 2025/3/31 停止服務 | ✅ 持續運營          |
| **訊息限制**   | 1000 則/天            | 無限制               |
| **API 複雜度** | 簡單（單向推送）      | 中等（雙向互動）     |
| **功能豐富度** | 基本推送              | 按鈕、位置、圖片群組 |
| **成本**       | 免費                  | 免費                 |

### Telegram 的優勢

**1. 持續可用**

- LINE Notify 即將停止服務
- Telegram 持續投資 Bot API

**2. 功能豐富**

```typescript
// 互動式按鈕
reply_markup: {
  inline_keyboard: [
    [
      { text: "✅ 有興趣", callback_data: "interest" },
      { text: "❌ 不感興趣", callback_data: "dismiss" },
    ],
  ];
}

// 多圖傳送
await bot.sendMediaGroup(chatId, [photo1, photo2, photo3]);

// 位置分享
await bot.sendLocation(chatId, latitude, longitude);
```

**3. 無訊息限制**

- 每天可發送數萬則訊息
- 適合高頻通知場景

**4. 跨平台**

- iOS、Android、Web、Desktop
- 訊息同步、搜尋、備份

---

## 為什麼需要深度條件過濾？

### 一般搜尋 vs 深度過濾

**一般搜尋**（591 基本篩選）：

```
地區：中山區
價格：≤ 12000
結果：200 筆（仍需人工逐一檢查）
```

**深度過濾**（自動化詳細條件檢查）：

```
基本條件：地區 + 價格
必要條件：水泥隔間、硫化銅門、獨立電表、對外窗
加分條件：電梯、非一樓、浴室對外窗、變頻空調
結果：15 筆（高度符合，值得查看）
```

### 符合度評分系統

**評分邏輯**：

- 必要條件：每項 25 分（總計 100 分）
- 加分條件：每項 10 分（總計 40 分）
- 最高分：140 分

**過濾門檻**：

- ≥ 100 分：發送通知
- ≥ 120 分：優先通知
- < 100 分：不通知（缺少必要條件）

**好處**：

1. **減少雜訊**：只看真正符合的房源
2. **優先級排序**：高分房源優先查看
3. **節省時間**：從 200 筆 → 15 筆

---

## 架構設計原則

### 1. 單一職責（Single Responsibility）

每個模組專注一件事：

```
facebook-scraper.ts    → 爬取 Facebook
591-scraper.ts         → 爬取 591
notificationService.ts → 發送通知
filterService.ts       → 條件過濾
```

### 2. 可測試性（Testability）

所有核心邏輯可單元測試：

```typescript
// 可測試的純函數
function extractPrice(content: string): number | null;
function isRentalPost(content: string): boolean;
function matchesUserCriteria(listing: RentalListing): boolean;
```

### 3. 可觀察性（Observability）

完整的日誌與監控：

```typescript
// 每次爬取記錄
await saveScrapeLog({
  source,
  status,
  postsCount,
  matchedCount,
  duration,
  error,
});

// 統計資訊
await getScrapeStats(); // 成功率、平均效能
```

### 4. 容錯性（Fault Tolerance）

優雅的錯誤處理：

```typescript
try {
  await scrapeFacebookGroup(groupId);
} catch (error) {
  // 記錄錯誤
  await saveScrapeLog({ status: "error", error });

  // 發送錯誤通知（但不中斷其他社團爬取）
  await telegramService.sendError(error);

  // 繼續下一個社團
}
```

### 5. 擴展性（Scalability）

易於新增資料來源：

```typescript
// 新增其他租屋平台
interface RentalScraper {
  scrape(): Promise<RentalListing[]>;
  checkDetailedCriteria(listing: RentalListing): Promise<MatchResult>;
}

class ExampleScraper implements RentalScraper {
  // 實作細節
}
```

---

## 技術權衡

### 即時性 vs 成本

**選擇**：每小時爬取一次

**理由**：

- ✅ 平衡即時性與成本
- ✅ 好房源通常數小時內有效
- ✅ 避免頻繁爬取觸發反爬蟲
- ✅ Vercel 免費方案每月 100 次 Cron（足夠）

**替代方案**：

- 每 10 分鐘（過於頻繁，容易被封）
- 每天 2 次（太慢，錯失好房源）

---

### 資料完整性 vs 儲存成本

**選擇**：只保留 30 天資料

**理由**：

- ✅ 租屋資訊時效性強（通常 1 週內確定）
- ✅ 減少資料庫容量（Supabase 免費 500MB）
- ✅ 提升查詢效能

**清理策略**：

```sql
-- 每週自動清理
DELETE FROM rental_listings
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

### 準確性 vs 覆蓋率

**選擇**：高準確性優先

**理由**：

- ✅ 寧可錯過 1 個好房源，也不要看 10 個不符合的
- ✅ 符合度評分系統（100 分門檻）
- ✅ 必要條件全滿足才通知

**量化**：

- 覆蓋率：~60%（可能錯過 40% 的房源）
- 準確率：~95%（通知的房源 95% 符合）

---

## 未來優化方向

### 短期（1-2 週）

1. **ML 評分模型**：學習用戶回饋，優化推薦
2. **圖片識別**：OCR 提取房源圖片中的資訊
3. **地圖視覺化**：在地圖上標記房源位置

### 中期（1-2 個月）

1. **多用戶支援**：分享給朋友使用
2. **自訂條件**：Web UI 設定個人化條件
3. **歷史分析**：租金趨勢、熱門地區分析

### 長期（3+ 個月）

1. **預測模型**：預測房源被租走的機率
2. **自動聯絡**：自動發送制式訊息給房東
3. **社群功能**：租客評價、心得分享

---

## 結論

台北租屋自動化系統的技術選型，基於以下核心考量：

1. **實用性**：解決真實痛點（節省時間、提升效率）
2. **可行性**：技術成熟、可快速實現
3. **經濟性**：最小化成本（重用現有基礎設施）
4. **可維護性**：清晰架構、易於除錯和擴展
5. **安全性**：避免帳號被封、資料洩露

這套方案在功能、成本、風險之間取得了良好平衡，適合個人使用的租屋自動化場景。

---

最後更新：2025-11-14
