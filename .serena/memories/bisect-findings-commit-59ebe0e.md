# Git Bisect 調查結果：React Query SSG 問題根因

## 📋 調查摘要

**日期**: 2025-10-31
**方法**: Git Bisect + Chrome DevTools 測試
**結論**: 找到第一個壞 commit

---

## 🎯 根本原因

### 第一個壞 Commit

```
59ebe0e fix(time-tracker): resolve React 19 ESLint rule violations
Author: Henry <u88803494@gmail.com>
Date:   Tue Oct 28 10:48:41 2025 +0800
```

### 前一個好 Commit（作為參考）

```
f7a577b chore(deps): upgrade dependencies to latest versions
```

---

## 📊 Bisect 詳細過程

```
測試範圍: 19fc08e (PR #29, 好) → b502688 (PR #39, 壞)

Commit 1: 946c4a5 (style: prettier formatting)
  結果: ❌ 壞
  錯誤: "Error: No QueryClient set"

Commit 2: 59ebe0e (fix time-tracker React 19 ESLint)
  結果: ❌ 壞（第一個壞的）
  錯誤: "Error: No QueryClient set"

Commit 3: f7a577b (chore: deps upgrade)
  結果: ✅ 好
  build 成功，無 React Query 錯誤

結論: 59ebe0e 是第一個導致問題的 commit
```

---

## 🔍 59ebe0e 的具體改動

### useLocalStorage.ts

```typescript
// 改前
const [loading, setLoading] = useState(true);
useEffect(() => {
  setLoading(false);
}, []);

// 改後
const [loading] = useState(false);
// 移除 useEffect，改用 queueMicrotask
```

**改動**:

- 移除 effect-based loading initialization
- 改用 queueMicrotask 延遲 setState
- 防止同步 setState 造成的 cascading renders

### useTimeTracker.ts

```typescript
// 改前
const [records, setRecords] = useState<TimeRecord[]>([]);
useEffect(() => {
  if (!loading && storedRecords) {
    const processedRecords = storedRecords.map(...);
    setRecords(processedRecords);
  }
}, [storedRecords, loading]);

// 改後
const records = useMemo<TimeRecord[]>(() => {
  if (!loading && storedRecords && storedRecords.length > 0) {
    return storedRecords.map(...);
  }
  return [];
}, [storedRecords, loading]);
```

**改動**:

- 用 useMemo 取代 useState + useEffect
- 完全移除衍生狀態的 setter
- 消除 useEffect 副作用

---

## ⚠️ 問題分析

### 為什麼 time-tracker 改動會影響 Blog React Query？

1. **React 初始化流程改變**
   - useLocalStorage hook 改動了 React hooks 調用順序
   - 可能影響全局 React context 設置

2. **SSG/Build 時的行為**
   - 用 queueMicrotask 替代同步 setState
   - 在 build 時（非 browser 環境）的行為可能不同

3. **React 19 的新規則**
   - `react-hooks/set-state-in-effect` 規則改變了状态管理
   - 可能導致組件初始化順序改變

### 為什麼會導致 React Query 失敗？

```
假設流程:
Build 時 Server Component 執行
  ↓
useLocalStorage hook 初始化改變
  ↓
React context 設置順序改變
  ↓
QueryClientProvider 未正確初始化
  ↓
useInfiniteQuery/useMutation 拋出 "No QueryClient set" 錯誤
```

---

## 🔗 相關 Issues

- **#41**: bug: React 19 ESLint fix triggers React Query SSG failure
- **#40**: refactor: Implement React Query prefetching pattern for better performance
- **#30**: Dependencies Upgrade Plan (2025-10)

---

## 💡 後續步驟

### 對 Issue #40 的啟示

1. **不能簡單移除這個 commit**
   - 因為 React 19 ESLint 規則是有效的
   - 需要在修復 React Query 的同時保留這個改進

2. **正確的解決方案**
   - 實作 prefetching pattern（Server Component side）
   - 使用 HydrationBoundary 傳遞初始狀態
   - 這樣 SSG 時就不需要 QueryClient

3. **測試策略**
   - 在本地驗證 build 輸出為 Static (○)
   - 用 Chrome DevTools 確認 React Query 正常運作
   - 驗證無限滾動功能

---

## 📌 重要發現

**這不是依賴升級的問題**

- 依賴升級本身是好的（f7a577b）
- 問題出在 React 19 ESLint 修復的實現方式

**這是架構問題**

- 當前使用 force-dynamic 是臨時解決方案
- 長期解決方案必須用 Server Component prefetching pattern

---

## ✅ Bisect 結論

```
透過 git bisect 精確定位:
- 問題不在依賴升級
- 問題不在其他 React Query 改動
- 問題在於 React 19 ESLint 規則修復導致的組件初始化順序改變
- 根本解決需要架構層面的修改（Issue #40）
```
