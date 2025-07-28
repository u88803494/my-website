# WeeklyView 移至「全部統計」頁面變更總結

## 完成的任務

### 1. 移除主頁面中的 WeeklyView

- ✅ 從 `TimeTrackerFeature.tsx` 的 `main` tab 中移除了 WeeklyView 區塊
- ✅ 移除了整個週視圖卡片：
  ```tsx
  {
    /* 週視圖 */
  }
  <div className="card bg-base-200 shadow-lg">
    <div className={CARD_BODY_CLASS}>
      <h2 className="card-title mb-4 text-xl">本週統計</h2>
      <WeeklyView onWeekChange={handleWeekChange} records={weeklyRecords} weekStart={currentWeekStart} />
    </div>
  </div>;
  ```

### 2. 在全部統計頁面添加 WeeklyView

- ✅ 修改了 `TimeStatistics.tsx` 組件：
  - 添加了 WeeklyView 的 import
  - 新增了必要的 props 類型定義：
    - `weeklyRecords: TimeRecord[]`
    - `currentWeekStart: Date`
    - `onWeekChange: (weekStart: Date) => void`
  - 在 StatisticsView 之後添加了 WeeklyView 區塊

### 3. 更新父組件 props 傳遞

- ✅ 在 `TimeTrackerFeature.tsx` 中更新了 `TimeStatistics` 組件的調用：
  ```tsx
  <TimeStatistics
    records={records}
    statistics={statistics}
    weeklyRecords={weeklyRecords}
    currentWeekStart={currentWeekStart}
    onWeekChange={handleWeekChange}
  />
  ```

### 4. 保持狀態邏輯不變

- ✅ `currentWeekStart` 和 `handleWeekChange` state 邏輯仍然保持在 `TimeTrackerFeature` 層級
- ✅ 週視圖的所有功能（左右移動、回到本週）都正確傳遞到新位置

## 測試結果

- ✅ 程式碼通過 TypeScript 類型檢查
- ✅ 程式碼通過 ESLint 檢查
- ✅ 程式碼格式化成功
- ✅ 開發服務器可以正常啟動

## 功能驗證

需要在瀏覽器中測試以下功能：

1. 切換到「全部統計」頁面
2. 確認 WeeklyView 顯示在統計資料下方
3. 測試週視圖的左右導航功能
4. 測試「回到本週」按鈕
5. 確認切換週次時資料正確更新

## 架構改進

這次變更將 WeeklyView 從主頁面移至統計頁面，提供了更好的用戶體驗：

- 主頁面更簡潔，專注於核心功能（新增記錄、查看最近記錄）
- 統計頁面整合了全部統計和週視圖，提供完整的分析視圖
- 保持了所有原有功能的完整性
