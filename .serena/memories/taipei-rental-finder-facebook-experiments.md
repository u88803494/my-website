# 台北租屋自動化 - Facebook 帳號實驗記錄

> **目的**：記錄 Facebook 帳號建立、完善和自動化操作的實驗過程與經驗

---

## 帳號資訊

**帳號名稱**：林國豪
**帳號 ID**：61583781631848
**建立日期**：2025-11-14
**用途**：專用於租屋社團自動化爬蟲

---

## Day 1 實驗記錄（2025-11-14）

### 成功操作

#### 1. 帳號建立

- ✅ 使用新 email 註冊成功
- ✅ 通過手機驗證
- ✅ 設定真實姓名（建議用朋友照片）
- ⏳ 大頭照：計劃使用朋友照片（避免 AI 生成被識別）

#### 2. 社團加入

- ✅ **台北租屋、出租專屬社團**（66萬成員）- 加入成功
- ✅ **台北租屋社團🌻**（32萬成員）- 加入成功

**加入方式**：

- 使用 Chrome DevTools MCP 自動化點擊
- 操作間隔：3-5 秒（模擬人類）
- 無需回答加入問題（這兩個社團）

### 失敗操作

#### 1. 個人資料完善

**嘗試**：填寫工作資訊

- 公司名稱：「自由接案」
- **結果**：❌ Facebook 驗證失敗，顯示「雇主無效」
- **學習**：避免使用「自由接案」、「獨立工作」等模糊職稱

**嘗試**：填寫居住地

- 城市：「台北市」
- **結果**：❌ 下拉選單超時未載入
- **學習**：Facebook 表單載入可能很慢，需增加 timeout

#### 2. 動作決策

- **決定**：取消填寫個人資料，先專注加入社團
- **理由**：避免過多表單操作觸發 Facebook 警告

---

## 安全操作策略

### 已驗證有效的方法

#### 1. 漸進式操作

```
Day 1: 加入 2 個社團
Day 2-3: 每天加入 2-3 個社團
Day 4-7: 完成所有社團加入 + 個人資料完善
```

#### 2. 時間間隔

- **社團加入**：每個操作間隔 3-10 秒
- **session 間隔**：4-6 小時或隔夜
- **每日限制**：最多 2-3 個社團

#### 3. 操作順序

1. 登入（保持 Cookie）
2. 瀏覽動態（滾動 2-3 次）
3. 隨機按讚 1-2 則貼文
4. 加入社團（1-2 個）
5. 登出或保持登入狀態

---

## 反爬蟲偵測指標

### 可疑行為（應避免）

❌ **批量操作**

- 短時間內加入 5+ 個社團
- 連續快速點擊
- 固定時間間隔（如每 5 秒）

❌ **異常模式**

- 深夜操作（凌晨 1-5 點）
- 不滾動頁面直接點擊
- 不瀏覽直接發文

❌ **罕見 User-Agent**

- 使用老舊瀏覽器版本
- 使用伺服器端 User-Agent

### 安全行為（應遵循）

✅ **模擬真實用戶**

- 隨機延遲（2-10 秒）
- 滾動頁面瀏覽
- 按讚、留言（少量）
- 分散操作時間

✅ **建立信任**

- 完善個人資料
- 上傳真實照片
- 添加好友（10-20 個）
- 加入其他非租屋社團（1-2 個）

✅ **保持低調**

- 不發送大量訊息
- 不頻繁發文
- 不使用自動化工具的明顯特徵

---

## Chrome DevTools MCP 使用技巧

### 成功模式

#### 1. 登入流程

```javascript
(await mcp__chrome) -
  devtools__navigate_page({
    type: "url",
    url: "https://www.facebook.com/login",
  });

(await mcp__chrome) -
  devtools__fill_form({
    elements: [
      { uid: "email_field", value: process.env.FB_EMAIL },
      { uid: "password_field", value: process.env.FB_PASSWORD },
    ],
  });

(await mcp__chrome) - devtools__click({ uid: "login_button" });
```

#### 2. 等待頁面載入

```javascript
// 方法 1：等待特定文字出現
(await mcp__chrome) -
  devtools__wait_for({
    text: "動態消息",
    timeout: 10000,
  });

// 方法 2：等待導航完成
(await mcp__chrome) -
  devtools__navigate_page({
    type: "url",
    url: "https://facebook.com/groups/...",
    waitUntil: "networkidle",
  });
```

#### 3. 社團加入

```javascript
// 取得頁面快照
const snapshot = (await mcp__chrome) - devtools__take_snapshot();

// 找到「加入」按鈕的 uid
const joinButtonUid = "..."; // 從 snapshot 中找

// 點擊加入
(await mcp__chrome) - devtools__click({ uid: joinButtonUid });

// 等待確認
(await mcp__chrome) -
  devtools__wait_for({
    text: "前往", // 按鈕文字變為「前往」表示成功
    timeout: 5000,
  });
```

### 常見錯誤與解決

#### 錯誤 1：元素找不到

```
Error: Element with uid=XX not found
```

**原因**：頁面結構改變或載入未完成
**解決**：

1. 重新 take_snapshot 確認 uid
2. 增加 wait_for 等待時間
3. 檢查是否在正確頁面

#### 錯誤 2：點擊無反應

```
Successfully clicked but nothing happened
```

**原因**：

1. 點擊了錯誤的元素
2. 需要先滾動到可見區域
3. 按鈕被其他元素遮擋

**解決**：

```javascript
// 先滾動到元素
(await mcp__chrome) -
  devtools__evaluate_script({
    function: `(el) => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }`,
    args: [{ uid: buttonUid }],
  });

// 等待滾動完成
await new Promise((resolve) => setTimeout(resolve, 1000));

// 再點擊
(await mcp__chrome) - devtools__click({ uid: buttonUid });
```

#### 錯誤 3：表單驗證失敗

```
Facebook returns "Invalid employer"
```

**原因**：Facebook 有特定的公司名稱驗證
**解決**：

1. 使用知名公司名稱（如：台積電、聯發科）
2. 留空（可選欄位）
3. 改用其他策略（如：學校、興趣）

---

## 下一步計劃

### 短期（Day 2-3）

1. **完善個人資料**（手動或自動化）
   - 上傳大頭照（朋友照片）
   - 填寫工作：「軟體工程師」@ 「知名科技公司」
   - 填寫居住地：「台北市」
   - 填寫興趣：「程式設計」、「旅遊」、「美食」

2. **添加好友**（3-5 個/天）
   - 從台北相關社團搜尋活躍用戶
   - 優先選擇有共同好友的
   - 發送簡短的好友邀請訊息

3. **繼續加入社團**（2-3 個/天）
   - 台北&新北雙北租屋（30萬）
   - 大台北好好好租屋網（31萬）
   - 台北新北租屋（31萬）

### 中期（Day 4-7）

1. **社群互動**
   - 瀏覽動態並按讚（5-10 則/天）
   - 在社團內瀏覽貼文（不發文）
   - 偶爾留言（簡短的「謝謝分享」、「請問還有嗎」）

2. **完成所有社團加入**（剩餘 13 個）
   - 優先加入公開社團
   - 私密社團需回答問題

3. **測試爬蟲**
   - 開始小規模爬取（每天 1-2 個社團）
   - 觀察是否觸發限制
   - 調整爬取頻率

### 長期（Week 2+）

1. **發布求租文**
   - 在 3-5 個社團發布
   - 每天最多 1 則
   - 使用不同的措辭

2. **優化自動化**
   - 增加爬取社團數量
   - 實作智能過濾
   - Telegram 通知整合

---

## 關鍵學習

### ✅ 成功經驗

1. **Chrome DevTools MCP 可靠**：自動化點擊成功率高
2. **漸進式操作有效**：Day 1 加入 2 個社團無異常
3. **公開社團易加入**：無需回答問題，直接點擊即可

### ⚠️ 需注意

1. **表單驗證嚴格**：避免使用模糊的職稱
2. **載入時間不定**：需要設定足夠的 timeout
3. **頁面結構會變**：定期檢查 uid 是否仍有效

### 📊 數據記錄

| 日期       | 操作       | 成功 | 失敗 | 備註             |
| ---------- | ---------- | ---- | ---- | ---------------- |
| 2025-11-14 | 加入社團   | 2    | 0    | 無異常           |
| 2025-11-14 | 填寫工作   | 0    | 1    | 「自由接案」被拒 |
| 2025-11-14 | 填寫居住地 | 0    | 1    | 下拉選單 timeout |

---

## 資源連結

- [Facebook 社團清單](../my-website/docs/reference/rental-finder/facebook-groups.md)
- [Facebook 爬蟲邏輯](../my-website/docs/reference/rental-finder/facebook-scraper.md)
- [操作指南](../my-website/docs/guides/rental-finder-automation.md)

---

最後更新：2025-11-14
