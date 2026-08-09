---
title: 如何監測 AI Dictionary 搜尋使用情況
type: guide
status: stable
audience: [developer, ai]
tags: [ai-dictionary, analytics, vercel, monitoring]
created: 2026-08-09
updated: 2026-08-09
difficulty: beginner
estimated_time: 10 分鐘
related:
  - ../reference/architecture.md
  - ../explanation/ai-dictionary-migration.md
  - ../../packages/ai-dictionary/README.md
ai_context: |
  說明如何在 Vercel Web Analytics 查看主站 AI Dictionary Demo 的搜尋事件，並在 client-side analytics 的限制下正確計算和解讀使用指標。
---

# 如何監測 AI Dictionary 搜尋使用情況

## 概述

**你將完成的目標：**
在 Vercel Web Analytics 查看 AI Dictionary 主站 Demo 的初始搜尋提交量與瀏覽器端完成量，並避免把事件次數誤解為使用者數或後端成功率。

**適用範圍：**
本指南只適用於此 repository 中的 `/ai-dictionary` 主站 Demo，不涵蓋獨立產品 [dictionary.henryleelab.com](https://dictionary.henryleelab.com)。

---

## 前置需求

開始之前，請確保：

- [ ] 你具有承載主站的 Vercel project 存取權限
- [ ] Vercel project 已啟用 Web Analytics
- [ ] 目前部署包含 AI Dictionary custom events
- [ ] Project 方案支援 Custom Events

Vercel 官方目前將 Custom Events 列為 Pro、Web Analytics Plus 或 Enterprise 功能，Hobby 不提供。請以實際 project 的方案與設定為準。

---

## 統計如何運作

### Analytics 初始化

主站的 `apps/my-website/src/components/shared/SiteShell.tsx` 掛載 `<Analytics />`，負責載入 Vercel Web Analytics client。AI Dictionary 的事件由 `packages/ai-dictionary/src/components/AIDictionaryContent.tsx` 呼叫 `track()`。

完整流程：

```text
使用者送出有效的初始查詢
  → dictionary_search_submitted
  → POST /api/define
  → client mutation 成功
  → dictionary_search_succeeded
  → 顯示查詢結果
```

### 事件定義

| Event                         | 觸發時機                                                     | 不計入                             |
| ----------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| `dictionary_search_submitted` | 有效初始查詢通過前端驗證後、mutation 開始前                  | 空白、超過長度限制、重新生成       |
| `dictionary_search_succeeded` | 同次初始查詢在仍掛載的 component 中進入 per-call `onSuccess` | 查詢失敗、重新生成、回應前離開頁面 |

兩個事件都只有固定事件名稱，不包含：

- 查詢字詞
- User ID 或 fingerprint
- Request ID
- Status code 或 duration
- 任何 custom properties

> 事件是 **occurrences**，不是 unique users。同一位匿名訪客搜尋十次，submitted count 會增加十次。

---

## 在 Vercel Dashboard 查看事件

1. 開啟 [Vercel Dashboard](https://vercel.com/dashboard)，選擇承載主站的 project。
2. 進入 **Analytics**，確認查看的是 **Web Analytics**。
3. 選擇 Environment：
   - 正式使用資料選 **Production**。
   - PR Preview 驗證選 **Preview**。
4. 設定要分析的時間區間。
5. 在 **Custom Events** 或 **Events** 區域找到：
   - `dictionary_search_submitted`
   - `dictionary_search_succeeded`
6. 比較前，確認兩個數字使用完全相同的：
   - Project
   - Environment
   - Timeframe
   - Hostname
   - `/ai-dictionary` route／page filter
   - Country、device 等其他 filters
7. 記錄兩個事件的 occurrence counts。

Vercel Dashboard 的區塊名稱和版面可能調整；請以 Web Analytics 中顯示 custom events 的區域為準。

---

## 計算產品指標

定義：

```text
C = count(dictionary_search_submitted)
S = count(dictionary_search_succeeded)
```

### 觀察到的提交量

```text
Observed submissions = C
```

代表 client-side analytics 收到的有效初始搜尋提交事件數，不是搜尋使用者數。

### 觀察到的瀏覽器端完成量

```text
Observed client completions = S
```

代表 client mutation 進入成功 callback，且 analytics 收到事件的初始查詢數，不是後端 API 的權威成功總數。

### 觀察到的 client-side completion ratio

當 `C > 0` 時：

```text
Observed client completion ratio = S ÷ C × 100%
```

範例：相同篩選條件下有 80 次 submitted、72 次 succeeded：

```text
72 ÷ 80 × 100% = 90%
```

這應稱為「觀察到的 client-side completion ratio」，**不能稱為 API success rate**。

### 未配對提交差額

```text
Observed unmatched submission gap = C - S
```

這只是聚合差額，**不能稱為 failures**。差額可能來自：

- API 或網路錯誤
- 使用者在回應完成前離開頁面
- 瀏覽器關閉或 JavaScript 中止
- Analytics／content blocker
- Client event delivery loss
- Vercel reporting delay
- Submitted 與 succeeded 跨越統計區間邊界

若短時間區間出現 `S > C`，請先檢查 filters、時間區間邊界與資料是否仍在彙整，不要把結果解讀為超過 100% 的成功率。

---

## 可以與不能回答的問題

### 目前可以回答

- 某期間觀察到多少次有效初始搜尋提交
- 某期間觀察到多少次 client-side 成功 callback
- Submitted 與 succeeded 的趨勢是否大致同步
- 相同篩選條件下的 observed client completion ratio

### 目前不能回答

- 有多少真實或註冊使用者搜尋
- 後端 API 的真實成功率或精確失敗數
- 使用者搜尋了哪些字詞或熱門 query
- 單次 request latency
- Submitted 與 succeeded 的逐筆配對
- Regeneration 的使用量或成功率
- 回答品質、閱讀完成度或使用者滿意度
- 跨裝置 identity、cohort 或跨日 retention

Vercel 的匿名 visitor 不等於帳號或自然人；匿名 visitor hash 會定期重設，不能作為持久使用者識別。若將 event count 與 Visitors 比較，請把結果標記為匿名 visitor／visitor-day proxy，而不是使用者轉換率。

---

## 驗證事件是否正常

在 Preview 或 Production deployment：

1. 送出一筆有效的初始搜尋。
2. 等待結果成功顯示。
3. 確認 Vercel Web Analytics 最終出現一筆 submitted 和一筆 succeeded。
4. 重新生成既有結果，確認這兩個事件不增加。
5. 嘗試空白或過長輸入，確認不產生事件。

Custom events 是 client-side 且採非同步回報。即使程式已呼叫 `track()`，Dashboard 也不保證立即顯示；即時除錯應搭配瀏覽器 Network／Console，正式報表則使用已結束且數值穩定的期間。

---

## 疑難排解

### Dashboard 看不到 Custom Events

依序確認：

1. Project 方案是否支援 Custom Events。
2. Web Analytics 是否已啟用。
3. 部署版本是否包含事件追蹤程式碼。
4. Environment 是否選成 Preview 或 Production 的另一個環境。
5. Timeframe、hostname 與 route filters 是否過度限縮。
6. 瀏覽器或 content blocker 是否阻擋 analytics request。
7. 等待資料完成彙整後再查看。

### Submitted 有數字，但 succeeded 較少

這不一定代表 API failure。目前沒有 `dictionary_search_failed` event，無法只靠兩個聚合數字區分錯誤、離頁、blocker、delivery loss 或 reporting delay。

### 找不到查詢字詞

這是預期行為。為降低隱私風險，事件刻意不傳 raw query 或 custom properties。

---

## 提示與最佳實踐

- 使用相同 environment、timeframe 與 filters 比較事件。
- 優先使用已結束的完整日期，避免 submitted 和 succeeded 橫跨報表邊界。
- 將 event counts 視為趨勢資料，不作為財務、稽核或計費等級的精確紀錄。
- 未來若需要真實 failure rate，應新增明確的 failed event 或 server-side telemetry，而不是使用 `C - S` 猜測。
- 不要把查詢字詞加入 analytics properties；使用者可能輸入姓名或其他敏感內容。

---

## 相關文件

### 專案文件

- [AI Dictionary Package README](../../packages/ai-dictionary/README.md)
- [AI Dictionary 遷移說明](../explanation/ai-dictionary-migration.md)
- [架構參考](../reference/architecture.md)

### Vercel 官方文件

- [Tracking custom events](https://vercel.com/docs/analytics/custom-events)
- [Using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics)
- [Privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting Web Analytics](https://vercel.com/docs/analytics/troubleshooting)
