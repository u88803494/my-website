# Implementation Plan

- [x] 1. 建立基礎 monorepo 架構和共享設定
  - 創建 packages 目錄結構和基礎配置
  - 設定 @packages/eslint-config 共享 ESLint 配置
  - 設定 @packages/tsconfig 共享 TypeScript 配置
  - 配置 workspace、TypeScript paths 和 Turbo
  - _Requirements: 1.1, 1.2, 2.2, 2.3, 5.1, 5.2, 5.3_

- [ ] 2. 創建 @packages/shared package
  - 創建 packages/shared 目錄結構和 package.json
  - 遷移共用 utils、types、constants 到 shared
  - 遷移共用 React 組件到 shared
  - 配置 TypeScript 和 build 設定
  - 修復現有代碼中的 @packages/shared 引用
  - _Requirements: 1.1, 1.3, 2.1, 4.2, 4.3_

- [ ] 3. 遷移可重用功能 packages（依序執行）

- [ ] 3.1 創建並遷移 @packages/blog package
  - 創建 packages/blog 目錄結構和 package.json
  - 遷移 BlogFeature 組件、hooks、types 到新 package
  - 抽取 medium-articles API 路由中的業務邏輯到 services 目錄
  - 更新 API 路由使用新的服務函數
  - 配置 package 的 TypeScript 和 build 設定
  - _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_

- [ ] 3.2 創建並遷移 @packages/ai-dictionary package
  - 創建 packages/ai-dictionary 目錄結構和 package.json
  - 遷移 AIDictionaryFeature 組件、hooks、types 到新 package
  - 抽取 define API 路由中的業務邏輯到 services 目錄
  - 更新 API 路由使用新的服務函數
  - 配置 package 的 TypeScript 和 build 設定
  - _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_

- [ ] 3.3 創建並遷移 @packages/ai-analyzer package
  - 創建 packages/ai-analyzer 目錄結構和 package.json
  - 遷移 AIAnalyzerFeature 組件、hooks、types 到新 package
  - 抽取 API 路由中的業務邏輯到 services 目錄
  - 更新 API 路由使用新的服務函數
  - 配置 package 的 TypeScript 和 build 設定
  - _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_

- [ ] 3.4 創建並遷移 @packages/time-tracker package
  - 創建 packages/time-tracker 目錄結構和 package.json
  - 遷移 TimeTrackerFeature 組件、hooks、types、utils、constants 到新 package
  - 配置 TypeScript 和 build 設定
  - 更新主應用中的 import 路徑
  - _Requirements: 1.1, 1.3, 2.1, 3.1, 3.2_

- [ ] 4. 保持和優化 Web 專用功能

- [ ] 4.1 確保 Web 專用 features 功能完整
  - 確認 features/resume/ 運作正常
  - 確認 features/about/ 運作正常
  - 確認 features/not-found/ 運作正常
  - 驗證所有頁面路由正確
  - _Requirements: 1.4, 3.3_

- [ ] 4.2 優化主應用的依賴和配置
  - 更新 package.json 添加 packages 依賴 (shared, ai-analyzer, ai-dictionary, blog, time-tracker)
  - 清理不再需要的直接依賴（移到對應 packages）
  - 優化 TypeScript 配置支援 packages 和 features 路徑
  - 更新 ESLint 配置適用於新結構
  - _Requirements: 1.2, 5.2, 5.3_

- [ ] 5. 配置開發工具和優化

- [ ] 5.1 配置 Turbo 支援 packages 並行構建
  - 更新 turbo.json 添加 packages 的 build、lint 任務
  - 配置任務依賴關係確保正確的構建順序
  - 設置緩存策略提升構建效能
  - _Requirements: 5.1_

- [ ] 5.2 設置 packages 的版本管理（可選）
  - 安裝和配置 changesets 進行版本管理
  - 創建初始 changeset 配置文件
  - 為每個 package 設置初始版本號
  - 測試版本更新和發布流程
  - _Requirements: 6.4_

- [ ] 6. 測試和驗證

- [ ] 6.1 驗證所有功能正常運作
  - 測試可重用 packages 的功能（blog, ai-dictionary, ai-analyzer, time-tracker）
  - 測試 web 專用 features 的功能（resume, about, not-found）
  - 測試所有 API 端點正常運作
  - 驗證 TypeScript 類型檢查無錯誤
  - 確認 build 和 dev 模式都正常運作
  - _Requirements: 1.4, 1.5, 3.3_

- [ ] 6.2 驗證 packages 獨立性和依賴關係
  - 檢查 packages 之間沒有循環依賴
  - 驗證每個 package 可以獨立 build 和 lint
  - 測試 workspace 依賴解析正確
  - 確認共享依賴通過 peerDependencies 正確管理
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7. 文檔和最終優化

- [ ] 7.1 創建 packages 文檔和使用指南
  - 為每個可重用 package 創建 README.md 文件
  - 文檔化 package 的 API 和使用方式
  - 創建整體 monorepo 的開發指南
  - 更新根目錄 README 說明新的專案結構（packages vs features）
  - _Requirements: 6.1, 6.2_

- [ ] 7.2 最終測試和效能優化
  - 執行完整的端到端測試
  - 檢查 bundle 大小和載入效能
  - 驗證所有 lint 和 type check 通過
  - 確認部署流程正常運作
  - _Requirements: 3.4_
