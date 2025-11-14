# 台北租屋自動化操作指南

完整的租屋自動化系統操作指南。

---

## 概述

台北租屋自動化工具是一個整合在 my-website monorepo 中的功能，用於自動化爬取 Facebook 社團和 591 租屋網的租屋資訊，並透過 Telegram 即時通知符合條件的房源。

---

## 前置需求

### 1. 環境設定

```bash
# Node.js 版本
node >= 20.0.0

# 套件管理器
pnpm >= 9.0.0
```

### 2. 必要的外部服務

#### Facebook 帳號

- 建立新的 Facebook 帳號（建議使用新帳號避免影響個人帳號）
- 完善個人資料（工作、居住地、興趣）
- 加入 10+ 台北租屋相關社團

#### Telegram Bot

- 透過 @BotFather 建立 Bot
- 取得 Bot Token
- 取得 Chat ID

#### 資料庫（選擇一）

- **Development**: SQLite（本地測試）
- **Production**: Supabase（免費方案）

### 3. 環境變數

建立 `.env.local` 檔案：

```bash
# Facebook 帳號
FB_EMAIL=your.email@example.com
FB_PASSWORD=your_password

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_CHAT_ID=123456789

# Database (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# Optional
NODE_ENV=development
```

---

## 安裝步驟

### 1. Clone Repository

```bash
git clone git@github.com:u88803494/my-website.git
cd my-website
```

### 2. 安裝相依套件

```bash
pnpm install
```

### 3. 設定資料庫

#### 選項 A：SQLite（本地測試）

```bash
# 建立 SQLite 資料庫
pnpm rental-finder:init-db
```

#### 選項 B：Supabase（生產環境）

```bash
# 1. 登入 Supabase Dashboard
# 2. 建立新專案
# 3. 在 SQL Editor 執行 migration script
cat docs/reference/rental-finder/data-schema.md | grep "CREATE TABLE" -A 50

# 4. 更新 .env.local 的 Supabase 設定
```

### 4. 設定 Telegram Bot

```bash
# 測試 Telegram 連線
curl http://localhost:3000/api/rental-finder/test-telegram

# 預期回應：{"success":true}
```

### 5. 啟動開發伺服器

```bash
pnpm dev
```

---

## 使用流程

### 步驟 1：Facebook 帳號準備

#### 1.1 建立新帳號

- 使用新的 email 註冊
- 填寫真實的姓名（建議用朋友照片作為大頭照）
- 完成手機驗證

#### 1.2 完善個人資料（使用 Chrome DevTools MCP）

**自動化腳本**：

```bash
# 執行帳號完善腳本
pnpm rental-finder:setup-facebook
```

**手動操作**（如果自動化失敗）：

1. 前往個人檔案 → 編輯詳細資料
2. 填寫：
   - 工作：軟體工程師 / 自由工作者
   - 居住地：台北市
   - 興趣：程式設計、旅遊、美食
3. 上傳大頭貼（建議用朋友的照片）

#### 1.3 加入租屋社團

參考 [Facebook 社團清單](../reference/rental-finder/facebook-groups.md)

**推薦加入順序**（每天 2-3 個）：

1. Day 1: 已完成（2個社團）
2. Day 2: 台北&新北雙北租屋（30萬）+ 大台北好好好租屋網（31萬）+ 台北新北租屋（31萬）
3. Day 3: 大台北好好租屋（21萬）+ 我想在台北租屋子（19萬，私密）+ 台北租屋專屬平台 2.0（16萬）
4. Day 4-5: 剩餘 7 個社團

**安全措施**：

- ✅ 每天限制 2-3 個社團
- ✅ 操作間隔 4-6 小時
- ✅ 先瀏覽社團內容再發文
- ✅ 避免批量操作

---

### 步驟 2：設定爬蟲排程

#### 2.1 本地測試

```bash
# 手動觸發爬蟲
curl -X POST http://localhost:3000/api/rental-finder/scrape \
  -H "Content-Type: application/json" \
  -d '{"source":"facebook","limit":10}'

# 查看結果
curl http://localhost:3000/api/rental-finder/listings?minScore=100
```

#### 2.2 Vercel Cron Job（生產環境）

編輯 `vercel.json`：

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

**Cron 格式說明**：

- `0 * * * *` - 每小時（分鐘 0）
- `0 */6 * * *` - 每 6 小時
- `0 9,18 * * *` - 每天 9:00 和 18:00

---

### 步驟 3：監控與維護

#### 3.1 查看爬蟲統計

```bash
curl http://localhost:3000/api/rental-finder/stats
```

**回應範例**：

```json
{
  "totalScrapes": 120,
  "successRate": 0.95,
  "avgPostsPerScrape": 45,
  "totalListings": 234,
  "matchedListings": 18,
  "avgMatchScore": 112.5,
  "lastScrapeTime": "2025-11-14T10:00:00Z"
}
```

#### 3.2 檢查錯誤日誌

```bash
# 查詢最近的錯誤
curl http://localhost:3000/api/rental-finder/stats | jq '.recentErrors'
```

#### 3.3 手動發送通知

```bash
# 發送所有未通知的房源
curl -X POST http://localhost:3000/api/rental-finder/notify

# 發送特定房源
curl -X POST http://localhost:3000/api/rental-finder/notify \
  -H "Content-Type: application/json" \
  -d '{"listingIds":["listing-001","listing-002"]}'
```

---

## 驗證系統運作

### 檢查清單

#### ✅ Facebook 爬蟲

```bash
# 1. 確認已加入社團
curl http://localhost:3000/api/rental-finder/groups

# 2. 手動觸發爬蟲
curl -X POST http://localhost:3000/api/rental-finder/scrape \
  -d '{"source":"facebook"}'

# 3. 檢查是否有新資料
curl http://localhost:3000/api/rental-finder/listings?source=facebook
```

#### ✅ 591 爬蟲

```bash
# 1. 測試 591 爬蟲
curl -X POST http://localhost:3000/api/rental-finder/scrape \
  -d '{"source":"591"}'

# 2. 檢查結果
curl http://localhost:3000/api/rental-finder/listings?source=591
```

#### ✅ Telegram 通知

```bash
# 1. 發送測試訊息
curl http://localhost:3000/api/rental-finder/test-telegram

# 2. 檢查 Telegram 是否收到訊息
# 3. 確認訊息格式正確
```

#### ✅ Cron Job（生產環境）

```bash
# 1. 部署到 Vercel
vercel --prod

# 2. 檢查 Vercel Dashboard → Cron Jobs
# 3. 查看執行記錄
```

---

## 疑難排解

### 問題 1：Facebook 帳號被限制

**症狀**：

- 無法加入新社團
- 登入時要求驗證
- 訊息顯示「操作過於頻繁」

**解決方案**：

1. 停止所有自動化操作 24-48 小時
2. 手動完成 Facebook 要求的驗證
3. 調整爬蟲頻率：
   ```typescript
   // 減少操作頻率
   SCRAPING_LIMITS.maxSessionsPerDay = 3; // 從 5 降到 3
   SCRAPING_LIMITS.delayBetweenSessions = 7200; // 從 1 小時改為 2 小時
   ```

---

### 問題 2：爬蟲無法擷取資料

**症狀**：

- API 回傳 `postsCount: 0`
- 錯誤訊息：`Element not found`

**解決方案**：

1. 檢查 Facebook 是否改版：

   ```bash
   # 使用 Chrome DevTools 查看頁面結構
   pnpm rental-finder:debug-facebook
   ```

2. 更新選擇器：
   ```typescript
   // 在 facebook-scraper.md 中更新 CSS 選擇器
   const postElements = document.querySelectorAll("新的選擇器");
   ```

---

### 問題 3：Telegram 通知無法發送

**症狀**：

- 錯誤：`401 Unauthorized`
- 錯誤：`400 Bad Request: chat not found`

**解決方案**：

**401 錯誤**（Token 錯誤）：

```bash
# 1. 確認 .env.local 中的 TELEGRAM_BOT_TOKEN
echo $TELEGRAM_BOT_TOKEN

# 2. 測試 Token 是否有效
curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe
```

**400 錯誤**（Chat ID 錯誤）：

```bash
# 1. 向 Bot 發送訊息
# 2. 取得正確的 Chat ID
curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates

# 3. 更新 .env.local
TELEGRAM_CHAT_ID=<正確的 Chat ID>
```

---

### 問題 4：Vercel Cron Job 未執行

**症狀**：

- Dashboard 顯示「未執行」
- 沒有收到自動通知

**解決方案**：

1. 檢查 `vercel.json` 設定：

   ```json
   {
     "crons": [
       {
         "path": "/api/rental-finder/scrape", // 確認路徑正確
         "schedule": "0 * * * *" // 確認 cron 格式
       }
     ]
   }
   ```

2. 檢查 API Route 是否正常：

   ```bash
   # 手動觸發
   curl https://henryleelab.com/api/rental-finder/scrape
   ```

3. 查看 Vercel 日誌：
   - Dashboard → Project → Logs
   - 篩選 Cron Job 執行記錄

---

### 問題 5：資料庫連線失敗

**症狀**：

- 錯誤：`Connection timeout`
- 爬蟲成功但資料未儲存

**解決方案**：

**Supabase 連線問題**：

```bash
# 1. 確認環境變數
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# 2. 測試連線
pnpm rental-finder:test-db

# 3. 檢查 Supabase Dashboard
# - Project Settings → API
# - 確認 URL 和 Service Key
```

---

## 提示與最佳實踐

### 🔐 帳號安全

1. **使用專用帳號**：不要用個人 Facebook 帳號
2. **漸進式操作**：新帳號前 3-7 天保守操作
3. **模擬人類行為**：隨機延遲、不定時操作
4. **定期檢查**：每週檢查帳號狀態

### ⚡ 效能優化

1. **增量爬取**：只爬取新貼文，避免重複
2. **分頁處理**：591 限制每次最多 5 頁
3. **並行處理**：多個社團可並行爬取（限制並發數）
4. **快取機制**：已通知的房源不再重複通知

### 📊 資料品質

1. **定期清理**：刪除 30 天前的舊資料
2. **去重邏輯**：相同 URL 只保留最新一筆
3. **評分調整**：根據實際狀況調整符合度評分
4. **回饋機制**：記錄「有興趣」的房源，優化推薦

### 🔔 通知管理

1. **時間篩選**：只在白天（9:00-21:00）發送通知
2. **批次發送**：累積 5 筆後一次發送
3. **優先級**：高分房源優先通知
4. **摘要報告**：每日發送一次摘要

---

## 進階功能

### 自訂搜尋條件

編輯 `user_preferences` 表：

```sql
UPDATE user_preferences
SET search_criteria = '{
  "districts": ["中山區", "松山區"],
  "maxPrice": 15000,
  "mustHave": {
    "水泥隔間": true,
    "對外窗": true
  }
}'
WHERE id = 1;
```

### 多帳號管理

```typescript
// 設定多個 Facebook 帳號輪流使用
const FACEBOOK_ACCOUNTS = [
  { email: "account1@example.com", password: "pass1" },
  { email: "account2@example.com", password: "pass2" },
];

// 隨機選擇帳號
const account =
  FACEBOOK_ACCOUNTS[Math.floor(Math.random() * FACEBOOK_ACCOUNTS.length)];
```

### Webhook 整合

```typescript
// 設定 Webhook 接收新房源
app.post("/webhook/rental-finder", async (req, res) => {
  const { listing } = req.body;

  // 自訂處理邏輯
  await processNewListing(listing);

  res.json({ success: true });
});
```

---

## 相關資源

- [Facebook 社團清單](../reference/rental-finder/facebook-groups.md)
- [Facebook 爬蟲邏輯](../reference/rental-finder/facebook-scraper.md)
- [591 爬蟲邏輯](../reference/rental-finder/591-scraper.md)
- [API 規格](../reference/rental-finder/api-endpoints.md)
- [資料庫 Schema](../reference/rental-finder/data-schema.md)
- [Telegram 設定](../reference/rental-finder/telegram-config.md)

---

最後更新：2025-11-14
