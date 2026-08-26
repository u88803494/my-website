# ADR-006: 新增 Expo React Native 應用到 Monorepo

## 狀態

**Proposed**

## 背景

當前的 henryleelab.com 網站使用 Next.js 16 構建，包含以下主要功能：

- Resume/Portfolio 展示
- Blog（Medium 整合）
- AI Dictionary（Gemini API）
- AI Analyzer
- Time Tracker

用戶希望新增 mobile 版本以：

1. **履歷展示**：在面試時展示跨平台開發能力
2. **個人使用**：Time Tracker 更適合行動裝置隨手記錄
3. **技術探索**：學習 React Native/Expo 生態系

## 決策

**在現有 Turborepo monorepo 中新增 Expo 應用（`apps/mobile`）**，而非：

- ❌ 創建獨立的 React Native 專案
- ❌ 使用 Flutter 或其他跨平台框架
- ❌ 將現有 Next.js 轉換為 Expo Web

## 理由

### 1. 為什麼選擇 Expo？

| 考量點     | Expo                      | 純 React Native | Flutter       |
| ---------- | ------------------------- | --------------- | ------------- |
| 學習曲線   | ✅ 低（React 開發者友好） | 🟡 中           | 🟡 中（Dart） |
| 代碼複用   | ✅ 高（~75%）             | ✅ 高           | ❌ 無法複用   |
| 開發體驗   | ✅ Expo Go 即時預覽       | 🟡 需模擬器     | 🟡 需模擬器   |
| 無需上架   | ✅ Expo Go 即可           | ❌ 需原生構建   | ❌ 需原生構建 |
| TypeScript | ✅ 原生支持               | ✅ 支持         | ❌ Dart       |

### 2. 為什麼在 Monorepo 內？

- **代碼共享**：Types、constants、utils 直接引用 `@packages/shared`
- **統一工具鏈**：ESLint、TypeScript、Prettier 配置共用
- **API 調用**：共用 React Query 配置和 API 客戶端
- **一致性**：業務邏輯變更自動同步到兩端

### 3. 代碼複用分析

```
可直接複用（~75%）          需要重寫（~25%）
──────────────────────      ─────────────────
✅ TypeScript Types          ❌ UI Components
✅ Constants                  ❌ Tailwind/DaisyUI
✅ API Client                 ❌ Framer Motion
✅ React Query Hooks          ❌ lucide-react
✅ Business Logic             ❌ localStorage API
✅ Validation Utils
✅ Date Calculations
✅ Formatting Utils
```

## 架構影響

### 目錄結構變更

```diff
my-website/
├── apps/
│   ├── my-website/           # Next.js (不變)
+   └── mobile/               # 新增 Expo 應用
+       ├── app/              # Expo Router 頁面
+       ├── src/
+       │   ├── features/     # 功能模組（參照 Web 結構）
+       │   ├── components/   # RN UI 組件
+       │   └── lib/          # RN 專用工具
+       ├── app.json
+       └── package.json
├── packages/
│   ├── shared/               # 輕微調整
+   │   ├── src/
+   │   │   ├── types/        # (不變)
+   │   │   ├── constants/    # (不變)
+   │   │   └── utils/
+   │   │       ├── cn.ts     # 標記 web-only
+   │   │       └── ...       # 其他保持不變
+   └── api-client/           # 可選：統一 API 層
```

### 依賴關係

```
apps/mobile
├── @packages/shared          # types, constants, utils
├── @packages/api-client      # (如果創建)
├── expo                      # Expo SDK
├── expo-router               # 檔案式路由
├── @tanstack/react-query     # 狀態管理
├── react-native-reanimated   # 動畫
├── nativewind                # Tailwind for RN (可選)
└── lucide-react-native       # 圖標
```

## 功能移植策略

| 功能              | 複用策略              | 特殊處理                    |
| ----------------- | --------------------- | --------------------------- |
| **Time Tracker**  | hooks/utils 100% 複用 | localStorage → AsyncStorage |
| **AI Dictionary** | service 層複用        | 調用現有 API endpoint       |
| **AI Analyzer**   | 同上                  | 同上                        |
| **Resume**        | 數據結構複用          | UI 完全重寫                 |
| **Blog**          | API 調用複用          | UI 適配行動閱讀             |
| **About**         | 數據複用              | UI 簡化                     |

## 開發與測試策略

### 開發環境

```bash
# 開發方式（無需開發者帳號）
pnpm --filter mobile dev     # 啟動 Expo 開發伺服器
# 使用 Expo Go app 掃描 QR code 即可在真機預覽
```

### 測試策略

- **開發階段**：Expo Go（iOS/Android 都可用）
- **進階測試**：iOS Simulator / Android Emulator
- **不需要**：App Store / Play Store 上架準備

## 風險與緩解

| 風險                           | 等級  | 緩解措施                           |
| ------------------------------ | ----- | ---------------------------------- |
| pnpm workspace + Metro 相容性  | 🟡 中 | 使用 `@expo/metro-config` 正確配置 |
| NativeWind + Tailwind 4 相容性 | 🟡 中 | 初期用 StyleSheet，穩定後升級      |
| 雙平台 UI 差異                 | 🟢 低 | `Platform.select()` 處理           |
| API 端點跨域問題               | 🟢 低 | RN 無 CORS 限制                    |

## 替代方案考量

### 方案 A：獨立 React Native 專案（已排除）

- ❌ 無法共享代碼
- ❌ 重複維護 types/constants
- ❌ 不符合 monorepo 最佳實踐

### 方案 B：Expo Web 取代 Next.js（已排除）

- ❌ 失去 SSG/SSR 優勢
- ❌ SEO 受影響
- ❌ 現有投資損失

### 方案 C：PWA（已排除）

- ❌ 無法展示 React Native 技能
- ❌ 功能受限（推送、離線）
- ❌ 履歷展示價值較低

## 實施計劃

### Phase 1：基礎建設

- [ ] 創建 `apps/mobile` Expo 應用
- [ ] 配置 pnpm workspace 和 metro.config.js
- [ ] 設置 TypeScript、ESLint 共用配置
- [ ] 驗證 `@packages/shared` 引用正常

### Phase 2：核心功能移植

- [ ] Time Tracker（優先級最高）
- [ ] AI Dictionary
- [ ] AI Analyzer

### Phase 3：展示功能

- [ ] Resume 頁面
- [ ] About 頁面
- [ ] Blog 列表

### Phase 4：優化

- [ ] 導航優化
- [ ] 動畫效果
- [ ] 深色模式支持

## 成功指標

1. **技術指標**
   - 所有 5 個主要功能在 mobile 可用
   - 代碼複用率 ≥ 70%
   - 無需開發者帳號即可在真機測試

2. **展示指標**
   - 可在面試時用 Expo Go 即時展示
   - README 包含 QR code 可供他人體驗

## 技術選型

| 領域         | 推薦方案                     | 備選方案           |
| ------------ | ---------------------------- | ------------------ |
| **路由**     | Expo Router (file-based)     | React Navigation   |
| **樣式**     | NativeWind (Tailwind for RN) | StyleSheet         |
| **狀態管理** | React Query + AsyncStorage   | Zustand            |
| **動畫**     | React Native Reanimated      | Animated API       |
| **圖標**     | lucide-react-native          | @expo/vector-icons |
| **開發工具** | Expo Go (開發) + EAS (構建)  | -                  |

## 參考資料

- [Expo 官方文檔](https://docs.expo.dev/)
- [Expo Router 文檔](https://expo.github.io/router/)
- [React Query + React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [NativeWind](https://www.nativewind.dev/)
- [Turborepo + Expo 範例](https://github.com/vercel/turbo/tree/main/examples/with-react-native-web)
