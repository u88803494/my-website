# 時間追蹤器統計功能盤點與重構 - 待辦清單

## 📋 第一步：現有程式碼盤點結果

### 🔍 已找到的統計相關檔案

1. **主要功能檔案**
   - `TimeTrackerFeature.tsx` (169 行) - 主要功能元件，包含標籤切換邏輯
   - `WeekStats.tsx` (69 行) - 週統計顯示元件
   - `StatisticsCard.tsx` (88 行) - 統計卡片元件
   - `TimeStatistics.tsx` (108 行) - 時間統計主元件
   - `statisticsCalculation.ts` (161 行) - 統計計算邏輯

2. **支援檔案**
   - `WeeklyView.tsx` - 週視圖，包含 WeekStats 使用
   - `index.ts` - TimeStatistics 模組導出

### 📊 日均邏輯標記

**日均計算位置：**

1. **WeekStats.tsx** (第 8, 21, 49-50 行)
   - Props: `averagePerDay: number`
   - 顯示：`formatMinutesToHours(averagePerDay)`

2. **WeeklyView.tsx** (第 55, 120 行)
   - 計算邏輯：`activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0`
   - 傳遞給 WeekStats

3. **statisticsCalculation.ts** (第 75-87 行)
   - `calculateDailyAverage()` 函數 - 計算平均每日時間

4. **TimeStatistics.tsx** (第 90 行)
   - 顯示平均時長：`Math.round(statistics.總計 / activityStats.filter((s) => s.value > 0).length)`

### 🎯 標籤 (Tabs) 使用處標記

**TimeTrackerFeature.tsx** 中的標籤系統：

- 第 25 行：`activeTab` 狀態管理
- 第 68-80 行：標籤導航 UI
- 第 82-140 行：根據 `activeTab` 條件渲染內容
  - `"main"` - 主要功能（時間輸入、記錄列表、週視圖）
  - `"statistics"` - 詳細統計頁面

### 📦 統計卡片使用處標記

**StatisticsCard 使用位置：**

1. **TimeStatistics.tsx**
   - 第 48 行：總計時間卡片 `isTotal={true}`
   - 第 53-61 行：各活動類型卡片循環

**StatisticsCard 特點：**

- 支援活動類型色彩
- 百分比進度條顯示
- 空狀態處理
- 時間格式化顯示

### 🏗️ 摘要 (Summary) 元件分析

**發現的摘要相關程式碼：**

1. **TimeStatistics.tsx** (第 76-103 行)
   - 內建「統計摘要」區塊
   - 顯示：最多時間活動、活動類型數量、平均時長、總時數
   - **不是獨立元件**，而是 TimeStatistics 內的一部分

2. **沒有發現獨立的 Summary 元件檔案**

### 📏 檔案長度檢查

**檔案行數統計：**

- ✅ `TimeTrackerFeature.tsx`: 169 行 (>150，需考慮切檔)
- ✅ `statisticsCalculation.ts`: 161 行 (>150，需考慮切檔)
- ✅ `TimeStatistics.tsx`: 108 行 (<150)
- ✅ `StatisticsCard.tsx`: 88 行 (<150)
- ✅ `WeekStats.tsx`: 69 行 (<150)

## 📝 切檔規劃

### 🔧 TimeTrackerFeature.tsx (169 行) 切檔建議

**可拆分部分：**

1. **設定模態視窗** (第 144-164 行) → `SettingsModal.tsx`
2. **主頁標籤內容** (第 83-136 行) → `MainTabContent.tsx`
3. **本週時間卡片** (第 85-93 行) → `WeekSummaryCard.tsx`

### 🔧 statisticsCalculation.ts (161 行) 切檔建議

**可拆分部分：**

1. **基礎統計計算** (第 1-30 行) → `basicStatistics.ts`
2. **百分比與活動分析** (第 32-72 行) → `activityAnalysis.ts`
3. **日期分組與平均計算** (第 74-106 行) → `dateCalculations.ts`
4. **週分類與摘要** (第 108-162 行) → `weeklyAnalysis.ts`

## ✅ 下一步行動項目

### 🎯 第二步準備工作

- [ ] 建立 Summary 獨立元件檔案
- [ ] 規劃 Summary 元件的介面與功能
- [ ] 考慮是否需要重構現有的統計摘要邏輯

### 🔄 第三步重構準備

- [ ] 準備 TimeTrackerFeature.tsx 的切檔
- [ ] 準備 statisticsCalculation.ts 的模組化
- [ ] 確保重構後的模組間依賴關係清晰

### 📋 待確認事項

1. Summary 元件應該顯示哪些統計資訊？
2. 是否要保留現有 TimeStatistics 內的摘要區塊？
3. 切檔後的檔案命名規範確認
4. 重構的優先順序安排

---

_建立時間：_ $(date)
_狀態：_ 第一步完成 ✅
