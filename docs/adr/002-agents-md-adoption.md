# ADR 002: 採用 AGENTS.md 標準進行 AI 配置

## 狀態

已接受

## 日期

2025-11-04

## 背景

### 問題

多個 AI 編碼工具需要各自獨立的配置檔案，造成重複與維護負擔：

- **Claude Code**：需要 `CLAUDE.md`（13KB）
- **Cursor IDE**：需要 `.cursorrules`（8.7KB）
- **Windsurf IDE**：無配置檔案
- **Gemini CLI**：可透過 `settings.json` 配置
- **Qwen**：已棄用，使用 `PROJECT_SUMMARY.md`

**此方法的問題：**

- ❌ 內容重複（CLAUDE.md 與 .cursorrules 之間約 70% 重疊）
- ❌ 同步負擔（每次變更需更新 3+ 個檔案）
- ❌ 不同 AI 工具間存在不一致風險
- ❌ 缺乏業界標準配置格式

### 業界標準：AGENTS.md

研究發現 [AGENTS.md](https://agents.md/) 為新興開放標準：

- **採用度**：20,000+ GitHub repositories
- **支援工具**：Cursor、Windsurf、Gemini CLI、RooCode、Zed、GitHub Copilot
- **社群**：強大社群支持（例如 GitHub Issue #6235 獲得 1000+ 👍）
- **Apache Superset** 及其他主要專案已採用

**Claude Code 現況：**

- 截至 2025 年 11 月尚未原生支援 AGENTS.md
- 功能請求待處理：https://github.com/anthropics/claude-code/issues/6235
- **可用的變通方案**：在 CLAUDE.md 中透過 `@AGENTS.md` 語法引用

## 決策

採用 **AGENTS.md 作為通用 AI 配置的唯一真實來源**，並搭配工具特定的包裝檔案：

```
AGENTS.md                    # 主要配置（業界標準，約 200 行）
├── CLAUDE.md                # Claude Code 入口（@AGENTS.md + 特定功能）
├── .cursorrules → AGENTS.md # 符號連結（Cursor IDE）
└── .windsurfrules → AGENTS.md # 符號連結（Windsurf IDE）
```

### 配置策略

**AGENTS.md 包含：**

- 專案概述與溝通準則
- Monorepo 結構與開發指令
- 架構模式與邊界
- 程式碼標準（TypeScript、命名、import 順序）
- 樣式指南（Tailwind、DaisyUI）
- 狀態管理模式
- Git 慣例

**CLAUDE.md 包含：**

- `@AGENTS.md` 引用（匯入所有通用配置）
- Claude Code 特定功能：
  - React Query + Next.js SSG patterns
  - API routes 文件
  - Medium 文章自動化
  - Subagents 使用指南
  - MCP servers 配置
  - TodoWrite 任務管理
  - 指令層級結構
  - 工作流程最佳實踐

**工具特定設定：**

- **Cursor**：讀取 `.cursorrules`（符號連結 → AGENTS.md）
- **Windsurf**：讀取 `.windsurfrules`（符號連結 → AGENTS.md）
- **Gemini CLI**：透過 `settings.json` 配置 → `"contextFileName": "AGENTS.md"`
- **Claude Code**：讀取 `CLAUDE.md` → 引用 `@AGENTS.md`

## 後果

### 正面影響

✅ **唯一真實來源**

- 通用配置維護於單一位置（AGENTS.md）
- 更新透過符號連結與引用自動傳播

✅ **業界標準**

- 遵循廣泛採用的 AGENTS.md 規範
- 隨更多工具採用標準而具備未來性
- VS Code Copilot 也計劃支援

✅ **工具特定客製化**

- Claude Code 保留 CLAUDE.md 以支援特定功能
- 其他工具可視需要新增工具特定配置

✅ **降低維護成本**

- 在 AGENTS.md 更新一次 vs 更新 3+ 個獨立檔案
- Cursor/Windsurf 透過符號連結自動同步

✅ **向後相容**

- 現有工具立即繼續運作
- 不會破壞當前工作流程

### 負面影響

⚠️ **Claude Code 變通方案**

- 需要 `@AGENTS.md` 引用直到原生支援
- 增加一層間接引用
- 依賴 Issue #6235 以獲得完整原生支援

⚠️ **符號連結限制**

- Windows 需要開發者模式或管理員權限
- Claude Code 已知符號連結 bug（Issues #764、#1388、#3575）
- Cursor/Windsurf 符號連結支援需測試

⚠️ **檔案結構變更**

- 新檔案結構可能最初讓開發者困惑
- 需要文件更新

⚠️ **內容分割決策**

- 決定哪些內容放在 AGENTS.md vs CLAUDE.md 需要判斷
- 可能需要迭代與改進

### 緩解措施

- **文件**：詳盡的 ADR 與更新的專案文件說明理由
- **測試**：驗證所有 AI 工具正確讀取配置
- **備案**：若 Windows 符號連結失敗，可使用複製腳本作為備案
- **迭代**：內容分割可根據使用回饋調整

## 實作

### 建立的檔案

- `AGENTS.md` - 主要配置（207 行）
- `CLAUDE.md` - Claude Code 包裝檔案，含 @AGENTS.md 引用（202 行）

### 修改的檔案

- `.gemini/settings.json` - 新增 `"contextFileName": "AGENTS.md"`

### 建立的符號連結

- `.cursorrules → AGENTS.md`
- `.windsurfrules → AGENTS.md`

### 移除的檔案

- `.qwen/` 目錄（已棄用）

### 總大小影響

- **之前**：CLAUDE.md (13KB) + .cursorrules (8.7KB) = 21.7KB
- **之後**：AGENTS.md (7.9KB) + CLAUDE.md (6.5KB) + 符號連結 (0 bytes) = 14.4KB
- **減少**：約 33% 更小且無重複

## 參考資料

- [AGENTS.md 規範](https://agents.md/)
- [AGENT.md GitHub Repository](https://github.com/agentmd/agent.md)
- [Claude Code Issue #6235: 支援 AGENTS.md](https://github.com/anthropics/claude-code/issues/6235)
- [Factory's AGENTS.md 實作指南](https://docs.factory.ai/cli/configuration/agents-md)
- [Apache Superset 實作](https://github.com/apache/superset)

## 未來考量

### 當 Claude Code 新增原生 AGENTS.md 支援時

一旦 Issue #6235 解決：

1. **簡化 CLAUDE.md**：移除 `@AGENTS.md` 引用，僅保留 Claude 特定內容
2. **優先順序**：Claude Code 可能會先檢查 CLAUDE.md，然後檢查 AGENTS.md
3. **無破壞性變更**：當前結構保持向前相容
4. **可選**：考慮將 Claude 特定內容移至獨立檔案

### Monorepo 模組化（可選）

AGENTS.md 支援階層式配置：

```
apps/my-website/AGENTS.md    # App 特定規則（可選）
packages/shared/AGENTS.md    # Package 特定規則（可選）
```

優先順序：最接近的檔案優先 → 父目錄 → 根目錄

這可以在特定 packages 需要獨特配置時再新增。

## 測試

- [x] Claude Code 讀取 CLAUDE.md 和 @AGENTS.md 引用
- [x] Cursor 讀取 .cursorrules 符號連結
- [x] Windsurf 讀取 .windsurfrules 符號連結
- [x] Gemini CLI 透過 settings.json 讀取 AGENTS.md
- [x] `pnpm check` 通過
- [x] 無建置錯誤
- [x] Git 操作正常運作

## 批准

批准者：Henry Lee
日期：2025-11-04
