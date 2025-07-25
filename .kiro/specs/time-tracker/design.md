# 設計文件

## 概述

時間追蹤功能是一個基於 React 和 Next.js 的單頁應用程式，使用 TypeScript 開發，採用 Tailwind CSS 和 daisyUI 進行樣式設計。該功能允許使用者記錄時間區間、選擇活動類型，並提供統計分析。資料儲存在瀏覽器的 localStorage 中，支援一週的時間追蹤。

## 架構

### 技術棧

- **前端框架**: React 19 + Next.js 15 (App Router)
- **程式語言**: TypeScript (嚴格模式)
- **樣式**: Tailwind CSS + daisyUI
- **狀態管理**: React useState + useEffect
- **資料持久化**: localStorage
- **圖示**: lucide-react

### 檔案結構

```
src/
├── app/
│   └── time-tracker/
│       └── page.tsx
├── features/
│   └── time-tracker/
│       ├── TimeTrackerFeature.tsx
│       ├── components/
│       │   ├── TimeEntryForm/
│       │   │   ├── TimeEntryForm.tsx
│       │   │   ├── ActivityTypeSelect.tsx
│       │   │   └── index.ts
│       │   ├── TimeStatistics/
│       │   │   ├── TimeStatistics.tsx
│       │   │   ├── StatisticsCard.tsx
│       │   │   └── index.ts
│       │   ├── TimeRecordsList/
│       │   │   ├── TimeRecordsList.tsx
│       │   │   ├── RecordItem.tsx
│       │   │   └── index.ts
│       │   └── WeeklyView/
│       │       ├── WeeklyView.tsx
│       │       ├── DaySection.tsx
│       │       └── index.ts
│       ├── hooks/
│       │   ├── useTimeTracker.ts
│       │   └── useLocalStorage.ts
│       ├── types/
│       │   └── index.ts
│       └── index.ts
└── types/
    └── time-tracker.types.ts
```

## 元件和介面

### 主要元件

#### 1. TimeTrackerFeature

- **職責**: 主要功能元件，整合所有子元件
- **狀態管理**: 管理時間記錄、統計資料和 UI 狀態
- **資料流**: 協調各子元件間的資料傳遞

#### 2. TimeEntryForm

- **職責**: 處理時間輸入表單
- **輸入欄位**:
  - 開始時間 (HH:MM 格式)
  - 結束時間 (HH:MM 格式)
  - 活動類型選擇器
  - 描述 (可選)
- **驗證**: 時間格式驗證、結束時間晚於開始時間驗證

#### 3. ActivityTypeSelect

- **職責**: 活動類型選擇下拉選單
- **選項**: 讀書、工作、品格、額外讀書、額外品格
- **樣式**: 使用 daisyUI 的 select 元件

#### 4. TimeStatistics

- **職責**: 顯示時間統計資料
- **功能**: 各活動類型的累計時間、總時間、百分比分析
- **視覺化**: 使用卡片佈局顯示統計資料

#### 5. TimeRecordsList

- **職責**: 顯示時間記錄列表
- **功能**: 記錄展示、刪除操作、確認對話框
- **排序**: 按時間倒序排列

#### 6. WeeklyView

- **職責**: 週視圖顯示
- **功能**: 按日期分組顯示記錄、週統計總覽
- **導航**: 週間切換功能

### 自訂 Hooks

#### useTimeTracker

```typescript
interface UseTimeTrackerReturn {
  records: TimeRecord[];
  statistics: TimeStatistics;
  addRecord: (record: Omit<TimeRecord, "id" | "createdAt">) => void;
  deleteRecord: (id: string) => void;
  getWeeklyRecords: (weekStart: Date) => TimeRecord[];
  clearWeek: () => void;
}
```

#### useLocalStorage

```typescript
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  loading: boolean;
  error: string | null;
}
```

## 資料模型

### TimeRecord

```typescript
interface TimeRecord {
  id: string;
  startTime: string; // HH:MM 格式
  endTime: string; // HH:MM 格式
  activityType: ActivityType;
  description?: string;
  duration: number; // 分鐘
  date: string; // YYYY-MM-DD 格式
  createdAt: Date;
}
```

### ActivityType

```typescript
enum ActivityType {
  STUDY = "讀書",
  WORK = "工作",
  CHARACTER = "品格",
  EXTRA_STUDY = "額外讀書",
  EXTRA_CHARACTER = "額外品格",
}
```

### TimeStatistics

```typescript
interface TimeStatistics {
  讀書: number;
  工作: number;
  品格: number;
  額外讀書: number;
  額外品格: number;
  總計: number;
}
```

### WeeklyData

```typescript
interface WeeklyData {
  weekStart: string; // YYYY-MM-DD 格式
  records: TimeRecord[];
  statistics: TimeStatistics;
}
```

## 錯誤處理

### 表單驗證錯誤

- **時間格式錯誤**: 顯示 "請輸入正確的時間格式 (HH:MM)"
- **時間邏輯錯誤**: 顯示 "結束時間必須晚於開始時間"
- **必填欄位**: 顯示 "此欄位為必填"

### 資料儲存錯誤

- **localStorage 不可用**: 顯示警告訊息，使用記憶體儲存
- **資料損壞**: 重置為預設值並通知使用者

### 計算錯誤

- **跨日時間計算**: 正確處理跨越午夜的時間區間
- **無效時間**: 防止負數時間和超過 24 小時的單次記錄

## 測試策略

### 單元測試

- **時間計算函數**: 測試各種時間區間計算
- **資料驗證**: 測試表單驗證邏輯
- **localStorage 操作**: 測試資料儲存和讀取

### 整合測試

- **元件互動**: 測試表單提交到統計更新的完整流程
- **週視圖**: 測試週間切換和資料過濾

### 使用者體驗測試

- **響應式設計**: 測試各種螢幕尺寸的顯示效果
- **無障礙性**: 測試鍵盤導航和螢幕閱讀器相容性

## UI/UX 設計

### 色彩方案

- **主色調**: 使用 daisyUI 的 primary 色彩
- **活動類型色彩**:
  - 讀書: `bg-blue-100 text-blue-800`
  - 工作: `bg-green-100 text-green-800`
  - 品格: `bg-purple-100 text-purple-800`
  - 額外讀書: `bg-cyan-100 text-cyan-800`
  - 額外品格: `bg-pink-100 text-pink-800`

### 佈局設計

- **響應式網格**: 使用 Tailwind 的 grid 系統
- **卡片佈局**: 統計資料和記錄使用卡片展示
- **表單設計**: 清晰的標籤和輸入欄位分組

### 互動設計

- **即時回饋**: 表單驗證即時顯示錯誤
- **確認對話框**: 刪除操作需要確認
- **載入狀態**: 資料處理時顯示載入指示器

## 效能考量

### 資料管理

- **記憶體使用**: 限制顯示的記錄數量，使用分頁或虛擬滾動
- **計算最佳化**: 使用 useMemo 快取統計計算結果

### 儲存最佳化

- **資料壓縮**: 最小化 localStorage 儲存的資料結構
- **清理機制**: 定期清理過期的週資料

### 渲染最佳化

- **元件記憶化**: 使用 React.memo 防止不必要的重新渲染
- **事件處理**: 使用 useCallback 最佳化事件處理函數
