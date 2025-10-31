# AI 功能開發優先順序建議（最終版本）

## 關鍵決策：字典獨立部署策略

**決定時間**: 2025-10-27
**決策**:

- 字典保留在 monorepo，但使用獨立部署
- 先完成 Issue #30 依賴升級，再進行獨立部署
- 個人網站展示字典的方式稍後評估（精簡版 Demo vs iframe）

**理由**:

- 避免個人網站變成一大包
- 字典和個人網站可以各自獨立管理和更新
- 保持 monorepo 優勢（共享套件）同時獲得獨立部署彈性

---

## 最終執行順序（已根據使用者反饋調整）

### Phase 1: 基礎建設（最優先）

1. **Issue #30**: 📦 Dependencies Upgrade Plan (2025-10)
   - **URL**: https://github.com/u88803494/my-website/issues/30
   - **優先級**: ⭐⭐⭐⭐⭐ (最高)
   - **預估時間**: 3-5 天
   - **必須優先**: 確保 monorepo 技術棧最新，為後續開發打穩基礎
   - **升級項目**: Next.js, React Query, TypeScript, ESLint, Turbo 等

### Phase 2: 字典獨立部署架構

2. **Issue #37**: 🚀 AI Dictionary - Independent Deployment Architecture
   - **URL**: https://github.com/u88803494/my-website/issues/37
   - **優先級**: ⭐⭐⭐⭐⭐ (從規劃變成立即執行)
   - **預估時間**: 2-3 天
   - **實作方式**: 保留在 monorepo，但獨立部署
   - **核心工作**:
     - 設定獨立 Vercel 專案（或其他平台）
     - 獨立 domain 配置
     - 獨立環境變數管理
     - 獨立 CI/CD pipeline
     - 建立 turbo 獨立 build 設定

3. **新 Issue (待建立)**: Dictionary Display Strategy for Personal Site
   - 評估個人網站如何展示字典
   - 選項 A: 精簡版/Demo 版
   - 選項 B: iframe 嵌入獨立站
   - 暫時建立 issue，phase 2 完成後再決定

### Phase 3: 字典功能增強（在獨立部署後進行）

4. **Issue #36**: 🎨 AI Dictionary - UI Enhancement
   - **URL**: https://github.com/u88803494/my-website/issues/36
   - **優先級**: ⭐⭐⭐⭐
   - **預估時間**: 3-5 天
   - 為語音輸入和學習追蹤預留 UI 空間

5. **Issue #32**: 🎤 AI Dictionary - Voice Input Support
   - **URL**: https://github.com/u88803494/my-website/issues/32
   - **優先級**: ⭐⭐⭐⭐
   - **預估時間**: 2-3 天
   - Web Speech API, 中文語音辨識

6. **Issue #33**: 📊 AI Dictionary - Learning Progress Tracking
   - **URL**: https://github.com/u88803494/my-website/issues/33
   - **優先級**: ⭐⭐⭐⭐
   - **預估時間**: 3-5 天
   - 資料視覺化, recharts, 學習追蹤

### Phase 4: 個人網站 AI 功能開發

7. **Issue #35**: 🛡️ Unified Error Handling & Environment Validation
   - **URL**: https://github.com/u88803494/my-website/issues/35
   - **優先級**: ⭐⭐⭐
   - **預估時間**: 1 週
   - 為所有 AI 功能提供穩定基礎
   - Closes #25, #26

8. **Issue #31**: 🤖 AI Chat Assistant with Streaming Responses
   - **URL**: https://github.com/u88803494/my-website/issues/31
   - **優先級**: ⭐⭐⭐⭐⭐ (求職作品集核心)
   - **預估時間**: 1-2 週
   - SSE streaming, 對話管理, Gemini API
   - 最能展示 AI 整合能力

9. **Issue #34**: 💬 AI Analyzer - Multi-turn Conversational Dialog
   - **URL**: https://github.com/u88803494/my-website/issues/34
   - **優先級**: ⭐⭐⭐⭐
   - **預估時間**: 3-5 天
   - 對話式需求挖掘, PRD 生成

---

## Issue 詳細資訊

### Issue #30: Dependencies Upgrade (優先執行)

- **狀態**: 已存在
- **必須優先的原因**:
  - 技術棧穩定性
  - 避免後續開發遇到相容性問題
  - 升級後字典獨立部署會更順暢

### Issue #31: AI Chat Assistant

- **優先級**: ⭐⭐⭐⭐⭐
- **推薦理由**: 最能展示 AI 整合能力
- **技術亮點**: SSE streaming, 對話管理, Markdown 渲染, Gemini API

### Issue #32: Voice Input

- **優先級**: ⭐⭐⭐⭐
- **推薦理由**: 快速實作，投資報酬率高
- **技術亮點**: Web Speech API, 中文語音辨識

### Issue #33: Learning Tracking

- **優先級**: ⭐⭐⭐⭐
- **推薦理由**: 展示資料視覺化能力
- **技術亮點**: recharts, 統計分析, 資料匯出

### Issue #34: Multi-turn Dialog

- **優先級**: ⭐⭐⭐⭐
- **推薦理由**: 展示對話式 AI 設計能力
- **技術亮點**: 多輪對話, 上下文管理, Prompt Engineering

### Issue #35: Error Handling

- **優先級**: ⭐⭐⭐
- **推薦理由**: 為所有功能提供穩定基礎
- **技術亮點**: Zod 驗證, Error Boundaries

### Issue #36: Dictionary UI Enhancement

- **優先級**: ⭐⭐⭐⭐
- **推薦理由**: 為後續功能預留 UI 空間
- **技術亮點**: Framer Motion, 響應式設計

### Issue #37: Independent Deployment (從規劃變成立即執行)

- **優先級**: ⭐⭐⭐⭐⭐ (Phase 2 核心)
- **實作方式**: 保留在 monorepo，獨立部署
- **核心任務**: 獨立 Vercel 專案, domain, CI/CD

---

## 架構決策紀錄

### 為何不完全拆成獨立 repo？

1. 保留 monorepo 優勢（共享套件: @packages/shared, @packages/tailwind-config）
2. 統一的開發工具鏈和 CI/CD
3. 更容易維護和重構
4. 但透過獨立部署獲得靈活性

### 字典獨立部署的技術細節

```yaml
目前結構:
  my-website/
  ├── apps/
  │   └── my-website/        # 個人網站主應用
  ├── packages/
  │   ├── ai-dictionary/     # 字典套件
  │   └── shared/            # 共享套件

獨立部署後:
  Vercel Project 1: my-website
    - 部署 apps/my-website
    - Domain: henrylee.dev (或現有 domain)

  Vercel Project 2: ai-dictionary
    - 部署 packages/ai-dictionary
    - Domain: dictionary.henrylee.dev (或獨立 domain)
    - 獨立環境變數
    - 獨立 build 設定（turbo filter）
```

### 個人網站展示字典策略（待評估）

- **選項 A**: 保留精簡版 Demo
- **選項 B**: iframe 嵌入獨立站
- **決策時間**: Phase 2 完成後

---

## 時間線估算

- **Phase 1**: 3-5 天（Issue #30）
- **Phase 2**: 2-3 天（Issue #37 + 新 issue）
- **Phase 3**: 8-13 天（Issue #36, #32, #33）
- **Phase 4**: 2-4 週（Issue #35, #31, #34）

**總計**: 約 4-6 週完成所有核心功能

---

## 更新記錄

- 2025-10-27 初版：建立所有 Issues
- 2025-10-27 最終版：根據使用者反饋調整執行順序
  - Issue #30 提升為最優先
  - Issue #37 從規劃變成立即執行
  - 確定字典獨立部署策略
