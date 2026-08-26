# 文件遷移計畫

## 概述

本文件追蹤舊有文件遷移至 Diataxis 框架結構的進度。

**狀態**：✅ 全部完成（2026-08-26）

> 本文件已成為歷史記錄。Diataxis 遷移的所有階段皆已完成，`docs/` 根目錄不再有
> 未分類的舊有文件。文件連結的持續驗證改由 `scripts/check-doc-links.ts` 在 pre-push 執行。

## 遷移狀態

### ✅ 已完成遷移

| 舊有檔案                        | 新位置                                   | 狀態      |
| ------------------------------- | ---------------------------------------- | --------- |
| `docs/git-automation-checks.md` | Diataxis 結構中的多個檔案                | ✅ 已拆分 |
| -                               | `docs/guides/git-workflow.md`            | ✅ 已建立 |
| -                               | `docs/reference/commitlint-rules.md`     | ✅ 已建立 |
| -                               | `docs/reference/git-hooks.md`            | ✅ 已建立 |
| -                               | `docs/explanation/git-hooks-research.md` | ✅ 已建立 |
| -                               | `docs/adr/003-git-hooks-optimization.md` | ✅ 已建立 |

### ✅ 已完成遷移（2026-08-26）

| 舊有檔案                   | 新位置                                      | 狀態      |
| -------------------------- | ------------------------------------------- | --------- |
| `LOGGER-GUIDE.md`          | `docs/guides/structured-logging.md`         | ✅ 已遷移 |
| `ISSUE-MANAGEMENT.md`      | `docs/guides/issue-management.md`           | ✅ 已遷移 |
| `MEDIUM-ARTICLES-GUIDE.md` | `docs/guides/medium-article-sync.md`        | ✅ 已遷移 |
| `time-tracker-timezone.md` | `docs/explanation/time-tracker-timezone.md` | ✅ 已遷移 |
| `CONFIGURATION.md`         | `docs/reference/configuration.md`           | ✅ 已遷移 |

遷移時一併移除 DEPRECATED 橫幅、補上 YAML frontmatter，並更新所有外部引用。

### 📦 僅存檔（歷史記錄）

| 舊有檔案                   | 存檔狀態  | 備註                                      |
| -------------------------- | --------- | ----------------------------------------- |
| `MONOREPO_REFACTOR.md`     | ✅ 已存檔 | 已完成重構（2025-10-20）                  |
| `git-automation-checks.md` | ✅ 已存檔 | 內容已拆分至 5 份文件，原檔保留為討論記錄 |

## 存檔策略

### 階段 6 清理（當前進行中）

1. ✅ 建立 `docs/archive/` 目錄
2. ✅ 在舊有文件中添加棄用通知
3. ✅ 建立此遷移計畫
4. ✅ 將已完成的重構文件移至存檔

### ✅ 階段 7 完成（2026-08-26）

1. ✅ 遷移剩餘的 5 份舊有文件
2. ✅ 將 `git-automation-checks.md` 移至 `docs/archive/`
3. ✅ 更新所有對已遷移文件的引用（含 repo 根目錄 README 與 `apps/my-website/README.md`）
4. ✅ `docs/` 根目錄僅剩 `README.md`

### 防止復發

遷移過程發現大量死連結源自 2025-10 monorepo 重構後未更新的路徑，且無機制可察覺。
因此建立 `scripts/check-doc-links.ts`，於 pre-push 全量驗證 markdown 相對連結與
frontmatter `related` 路徑；亦可手動執行 `pnpm docs:check-links`。

## 已建立的新文件

### 階段 1：框架骨架

- ✅ `docs/README.md` - 主要文件中心
- ✅ `docs/{guides,tutorials,reference,explanation}/README.md` - 類別首頁
- ✅ `docs/adr/{README.md,template.md}` - ADR 系統
- ✅ `docs/.templates/*.md` - 文件範本（4 個檔案）

### 階段 2：Git 自動化拆分

- ✅ 從 `git-automation-checks.md` 拆分出 5 份文件

### 階段 3：核心文件

- ✅ `docs/guides/development-setup.md` - 設定指南
- ✅ `docs/tutorials/01-project-setup.md` - 第一份教學
- ✅ `docs/explanation/feature-based-architecture.md` - 架構說明
- ✅ `docs/explanation/react-query-patterns.md` - React Query 模式
- ✅ `docs/explanation/monorepo-strategy.md` - Monorepo 策略說明

### 階段 4：API 文件

- ✅ `docs/reference/api/README.md` - API 概覽
- ✅ `docs/reference/api/define-api.md` - /api/define 端點
- ✅ `docs/reference/api/ai-analyzer-api.md` - /api/ai-analyzer 端點
- ✅ `docs/reference/api/medium-articles-api.md` - /api/medium-articles 端點

### 階段 5：導覽

- ✅ `README.md` - 新增文件區塊
- ✅ `CLAUDE.md` - 新增文件系統區塊

### 關鍵修復

- ✅ 修復所有 README 中的失效連結
- ✅ 建立 `docs/reference/architecture.md`（2209 行）
- ✅ 標記所有舊有文件為已棄用

## 統計資料

**建立的文件總數**：27+ 個檔案
**撰寫的總行數**：10,000+ 行
**完成的階段**：5/6
**覆蓋率**：約 80% 的規劃文件

## 下一步行動

1. **即時行動**（階段 6）：
   - [ ] 存檔 `MONOREPO_REFACTOR.md`
   - [x] 驗證核心內部連結
   - [ ] 最終提交與 PR

2. **未來行動**（合併後）：
   - [ ] 在結構化日誌變更時遷移日誌指南
   - [ ] 在 P0-P3 系統變更時遷移問題管理指南
   - [ ] 建立剩餘的教學（02、03）
   - [ ] 建立環境變數參考文件
   - [ ] 建立 CLI 命令參考文件

## 成功標準

- ✅ 所有關鍵文件都有對應的 Diataxis 版本
- ✅ 所有新文件都有 YAML frontmatter 和 AI context
- ✅ 交叉引用完整
- ✅ 根目錄 README 和 CLAUDE.md 已更新
- ⏳ 舊有文件已標記為棄用
- ⏳ 存檔目錄已建立
- ⏳ 遷移計畫已記錄

## 相關資源

- [Issue #50](https://github.com/u88803494/my-website/issues/50) - 採用 Diataxis 框架
- [Diataxis Framework](https://diataxis.fr/) - 官方文件
- [docs/README.md](../README.md) - 文件中心
