# Time Tracker 時區管理說明

## 概述

此時間追蹤器已經完全重構，使用 **date-fns** 和 **date-fns-tz** 來統一管理台灣時區（Asia/Taipei）。所有時間相關的操作現在都會強制使用台灣時區，確保應用程式的時間一致性。

## 主要特色

### ✅ 統一時區管理

- 所有時間操作都使用台灣時區 (Asia/Taipei)
- 避免了本地時區差異造成的問題
- 確保不同環境下的時間一致性

### ✅ 使用現代化日期庫

- **date-fns**: 現代化、輕量級、函式式的日期處理庫
- **date-fns-tz**: 提供強大的時區處理功能
- 完整的 TypeScript 支援
- Tree-shaking 支援，減少打包體積

### ✅ 向後相容性

- 保留了舊的 `dateHelpers.ts` API，添加了 @deprecated 標記
- 逐步遷移，不會破壞現有功能

## 核心檔案

### `timezoneHelpers.ts`

統一的時區管理工具，包含所有時區相關的函式：

- `getTaiwanNow()`: 獲取當前台灣時間
- `getCurrentTaiwanDate()`: 獲取台灣日期字串 (YYYY-MM-DD)
- `getCurrentTaiwanTime()`: 獲取台灣時間字串 (HH:mm)
- `formatDateInTaiwan()`: 格式化日期為台灣時區
- `getWeekStartInTaiwan()`: 獲取台灣時區的週開始日期
- `isSameWeekInTaiwan()`: 檢查是否同一週（台灣時區）
- `isTodayInTaiwan()`: 檢查是否為台灣的今天

### 更新的元件

1. **TimeTrackerFeature**: 主要功能元件
2. **TimeEntryForm**: 時間輸入表單
3. **WeeklyView**: 週視圖
4. **RecordItem**: 記錄項目
5. **useTimeTracker**: 主要業務邏輯 Hook

## 環境設定

### `.env.local`

```env
# 時區設定
TZ=Asia/Taipei
```

### 依賴套件

```json
{
  "dependencies": {
    "date-fns": "^4.1.0",
    "date-fns-tz": "^3.2.0"
  }
}
```

## 使用方式

### 推薦用法（新）

```typescript
import {
  getCurrentTaiwanDate,
  getCurrentTaiwanTime,
  getWeekStartInTaiwan,
  isTodayInTaiwan,
} from "./utils/timezoneHelpers";

// 獲取當前台灣日期
const today = getCurrentTaiwanDate(); // "2025-01-23"

// 獲取當前台灣時間
const now = getCurrentTaiwanTime(); // "16:14"

// 檢查是否為今天（台灣時區）
const isToday = isTodayInTaiwan(new Date());
```

### 舊用法（已棄用但仍可用）

```typescript
import { getCurrentDate, getWeekStart, isToday } from "./utils/dateHelpers"; // 這些函式現在內部使用台灣時區
```

## 測試工具

### `timezoneTest.ts`

提供了測試函式來驗證時區設定：

```typescript
import { testTimezone, compareTimezones } from "./utils/timezoneTest";

// 在開發時呼叫這些函式來檢查時區設定
testTimezone();
compareTimezones();
```

## 技術細節

### 時區轉換邏輯

1. **輸入時間**: 假設用戶輸入的時間都是台灣時區的時間
2. **存儲格式**: 時間以 ISO 字串格式存儲在 localStorage
3. **顯示邏輯**: 所有顯示的時間都轉換為台灣時區
4. **計算邏輯**: 所有時間計算（週開始、是否今天等）都基於台灣時區

### 主要改進

1. **一致性**: 無論用戶在哪個時區，都看到台灣時間
2. **可靠性**: 避免了夏令時和時區變更的問題
3. **可維護性**: 集中管理所有時區相關邏輯
4. **效能**: 使用 date-fns 的 tree-shaking 減少打包體積

## 遷移建議

1. **新程式碼**: 直接使用 `timezoneHelpers.ts` 中的函式
2. **舊程式碼**: 可以繼續使用，但建議逐步遷移到新的 API
3. **測試**: 使用 `timezoneTest.ts` 驗證時區行為

## 注意事項

- 所有的日期字串都使用 `YYYY-MM-DD` 格式
- 所有的時間字串都使用 `HH:mm` 24小時制格式
- 週的開始日期設定為週一
- 時區固定為 `Asia/Taipei`
