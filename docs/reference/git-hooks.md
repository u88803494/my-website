# Git Hooks 配置參考手冊

---

title: Git Hooks 配置與實作參考手冊
type: reference
status: stable
audience: [developer, ai]
tags: [git, hooks, husky, lint-staged, automation]
created: 2025-11-07
updated: 2025-11-07
version: 1.0.0
related:

- guides/git-workflow.md
- reference/commitlint-rules.md
- explanation/git-hooks-research.md
- adr/003-git-hooks-optimization.md
  ai_context: |
  Complete reference for git hooks configuration including pre-commit, commit-msg,
  and pre-push hooks with Husky integration and commit size validation.

---

## 概述

**本文件說明內容**：完整的 git hooks 配置規範，包含使用 Husky、lint-staged 和自訂驗證腳本的 pre-commit、commit-msg 和 pre-push hooks。

**使用情境**：

- 配置自動化程式碼品質檢查
- 設定提交訊息驗證
- 實作提交大小限制
- 排查 git hook 問題

**檔案位置**：專案根目錄的 `.husky/` 目錄

---

## 快速參考

**最常用的操作：**

| 操作            | 檔案                              | 指令                                   |
| --------------- | --------------------------------- | -------------------------------------- |
| 快速格式化/檢查 | `.husky/pre-commit`               | `pnpm lint-staged`                     |
| 驗證提交訊息    | `.husky/commit-msg`               | `npx commitlint --edit $1`             |
| 完整型別檢查    | `.husky/pre-push`                 | `pnpm run check-types`                 |
| 驗證提交大小    | `scripts/validate-commit-size.js` | `node scripts/validate-commit-size.js` |
| 略過 hooks      | CLI                               | `git commit --no-verify`               |

---

## 完整規範

### Pre-commit Hook

**位置**：`.husky/pre-commit`

**目的**：在提交前對暫存檔案進行快速驗證

**執行時間**：約 1-5 秒

**配置**：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 檢查暫存檔案
pnpm lint-staged

# 驗證提交大小
node scripts/validate-commit-size.js
```

**執行流程**：

```
1. 觸發 git commit
2. 執行 lint-staged（對暫存檔案執行 Prettier + ESLint）
3. 執行提交大小驗證
4. 如果全部通過 → 繼續到 commit-msg hook
5. 如果任一失敗 → 中止提交
```

**結束代碼**：

- `0` - 成功，繼續到 commit-msg hook
- `1` - 失敗，中止提交

---

### Commit-msg Hook

**位置**：`.husky/commit-msg`

**目的**：驗證提交訊息格式

**執行時間**：約 0.1 秒

**配置**：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

**參數**：

- `$1` - 提交訊息檔案的路徑（`.git/COMMIT_EDITMSG`）

**執行流程**：

```
1. Pre-commit hook 通過
2. 從 $1 讀取提交訊息
3. 根據 commitlint 規則驗證
4. 如果通過 → 建立提交
5. 如果失敗 → 中止提交
```

**結束代碼**：

- `0` - 有效的提交訊息
- `1` - 無效的提交訊息

---

### Pre-push Hook

**位置**：`.husky/pre-push`

**目的**：在推送前進行全面驗證

**執行時間**：約 10-20 秒（首次執行），約 2-5 秒（快取後）

**配置**：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running comprehensive checks before push..."
echo ""

# TypeScript 型別檢查
echo "📘 Type checking..."
pnpm run check-types || { echo "\n❌ Type check failed. Please fix errors before pushing."; exit 1; }

# ESLint 完整檢查
echo ""
echo "🔧 Linting..."
pnpm run lint || { echo "\n❌ Linting failed. Please fix errors before pushing."; exit 1; }

echo ""
echo "✅ All pre-push checks passed!"
```

**執行的指令**：

1. `pnpm run check-types` - TypeScript 完整專案檢查
2. `pnpm run lint` - ESLint 完整專案檢查，設定 `--max-warnings=0`

**執行流程**：

```
1. 觸發 git push
2. 在整個專案上執行 TypeScript 型別檢查
3. 如果失敗 → 顯示錯誤訊息並中止推送
4. 在整個專案上執行 ESLint
5. 如果失敗 → 顯示錯誤訊息並中止推送
6. 如果全部通過 → 繼續推送
```

**結束代碼**：

- `0` - 所有檢查通過
- `1` - 型別檢查失敗或檢查程式碼失敗

---

## lint-staged 配置

**位置**：`lint-staged.config.js`

**目的**：僅在暫存檔案上執行格式化工具和檢查工具

**配置**：

```javascript
module.exports = {
  "apps/my-website/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "packages/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "**/*.{json,css,scss,md,mdx,yaml,yml}": ["prettier --write"],
};
```

**檔案模式**：

| 模式                                   | 符合的檔案                       | 指令              |
| -------------------------------------- | -------------------------------- | ----------------- |
| `apps/my-website/**/*.{js,jsx,ts,tsx}` | App 的 JavaScript/TypeScript     | Prettier + ESLint |
| `packages/**/*.{js,jsx,ts,tsx}`        | Package 的 JavaScript/TypeScript | Prettier + ESLint |
| `**/*.{json,css,scss,md,mdx,yaml,yml}` | 所有配置/樣式/文件檔案           | 僅 Prettier       |

**指令順序**：

1. `prettier --write` - 格式化程式碼
2. `eslint --fix --max-warnings=0` - 檢查並自動修復

**重要注意事項**：

- 指令按順序對每個檔案執行
- 修改後的檔案會自動重新暫存
- 遇到第一個錯誤時中止流程
- 不包含 TypeScript 檢查（已移至 pre-push）

---

## 提交大小驗證腳本

**位置**：`scripts/validate-commit-size.js`

**目的**：防止過大的提交

**配置**：

```javascript
#!/usr/bin/env node

const { execSync } = require("child_process");

// 配置
const MAX_FILES = 15;
const MAX_LINES = 500;

// 排除模式
const EXCLUDE_PATTERNS = [
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  "**/*.md",
  "scripts/**/*.ts",
  "scripts/**/*.js",
  "dist/**",
  "build/**",
  ".next/**",
  "*.generated.*",
  "*.config.ts",
  "*.config.js",
  ".serena/memories/**",
  "*.d.ts",
  "**/__snapshots__/**",
];
```

**參數**：

| 參數               | 類型       | 預設值 | 說明                 |
| ------------------ | ---------- | ------ | -------------------- |
| `MAX_FILES`        | `number`   | 15     | 允許的最大暫存檔案數 |
| `MAX_LINES`        | `number`   | 500    | 最大總行數變更       |
| `EXCLUDE_PATTERNS` | `string[]` | 見配置 | 要忽略的檔案         |

**驗證邏輯**：

```javascript
function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => {
    // 處理 **/ 前綴（任意深度）
    if (pattern.startsWith("**/")) {
      const suffix = pattern.substring(3);

      // 處理 **/*.ext 模式
      if (suffix.startsWith("*.")) {
        const ext = suffix.substring(1);
        return filePath.endsWith(ext);
      }

      // 處理 **/<path> 模式
      return filePath.endsWith(suffix) || filePath.includes("/" + suffix);
    }

    // 處理其他模式
    const regexPattern = pattern
      .replace(/\./g, "\\.") // 轉義點號
      .replace(/\*/g, "[^/]*"); // * 符合除 / 外的任何字元

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  });
}
```

**使用的 Git 指令**：

```bash
# 取得暫存檔案
git diff --cached --name-only

# 取得差異統計
git diff --cached --numstat
```

**輸出格式**：

**成功**：

```
✅ Commit size validation passed:
   Files: 8/15
   Lines: 250/500 (Added: 200, Deleted: 50)
```

**失敗（檔案過多）**：

```
❌ Commit contains too many files: 20/15

📝 Please split changes into smaller commits

Modified files:
  - src/feature1.tsx
  - src/feature2.tsx
  ...
```

**失敗（行數過多）**：

```
❌ Commit changes too many lines: 650/500
   Added: 450 lines, Deleted: 200 lines

📝 Please split changes into smaller commits
```

**結束代碼**：

- `0` - 驗證通過
- `1` - 驗證失敗或發生錯誤

---

## 排除模式參考

### 鎖定檔案

```javascript
'pnpm-lock.yaml',
'package-lock.json',
'yarn.lock',
'bun.lockb',
```

**原因**：自動產生，通常超過 9000 行

---

### 文件

```javascript
'**/*.md',
```

**原因**：文件檔案可能很長但不會造成複雜度問題

---

### 腳本

```javascript
'scripts/**/*.ts',
'scripts/**/*.js',
```

**原因**：單一用途的腳本可能合理地較長

---

### 建置輸出

```javascript
'dist/**',
'build/**',
'.next/**',
'.turbo/**',
'out/**',
```

**原因**：不應提交，但模式可防止意外

---

### 產生的檔案

```javascript
'*.generated.*',
'*.gen.*',
```

**原因**：自動產生的程式碼

---

### 配置檔案

```javascript
'*.config.ts',
'*.config.js',
'*.config.mjs',
'*.config.cjs',
```

**原因**：配置檔案可能很完整

---

### AI/工具輸出

```javascript
'.serena/memories/**',
'.kiro/specs/**',
```

**原因**：工具產生的內容

---

### 型別宣告

```javascript
'*.d.ts',
```

**原因**：型別定義檔案可能很大

---

### 測試快照

```javascript
'**/__snapshots__/**',
```

**原因**：測試快照可能很大

---

## Hook 略過

### 略過 Pre-commit 和 Commit-msg

```bash
git commit --no-verify -m "commit message"
# 或
git commit -n -m "commit message"
```

**略過項目**：

- lint-staged（Prettier + ESLint）
- 提交大小驗證
- Commitlint 訊息驗證

---

### 略過 Pre-push

```bash
git push --no-verify
# 或
git push -n
```

**略過項目**：

- TypeScript 型別檢查
- ESLint 完整專案檢查

---

### 使用指南

**何時使用 `--no-verify`**：

- ✅ 緊急生產修復
- ✅ 功能分支上的臨時提交（計畫 rebase）
- ✅ 已知的工具誤報

**何時不要使用**：

- ❌ 常規開發工作流程
- ❌ 直接提交到 main/master 的提交
- ❌ 為了避免修復合法問題

**監控**：

- 追蹤略過使用（應 < 5% 的提交）
- 在 PR 審查中檢視略過的提交
- 處理需要頻繁略過的模式

---

## 疑難排解參考

### Hook 未執行

**症狀**：提交成功但未執行 hooks

**可能原因**：

1. Hooks 不可執行
2. Husky 未安裝
3. `.git/hooks` 未指向 `.husky`

**解決方案**：

```bash
# 重新安裝 Husky
pnpm exec husky install

# 設定執行權限
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push

# 驗證 hook 檔案存在
ls -la .husky/
```

---

### Pre-commit 太慢

**症狀**：Pre-commit 超過 5 秒

**可能原因**：

1. 暫存檔案過多
2. 檔案大小過大
3. ESLint 規則緩慢

**解決方案**：

```bash
# 檢查暫存檔案
git diff --cached --name-only | wc -l

# 一次暫存較少檔案
git add file1.ts file2.ts
git commit -m "..."

# 考慮分成多個提交
```

---

### Pre-push 總是失敗

**症狀**：即使修復後型別檢查或檢查仍失敗

**可能原因**：

1. 未暫存檔案中的錯誤
2. Turborepo 快取損壞
3. 依賴不同步

**解決方案**：

```bash
# 清除 Turborepo 快取
rm -rf .turbo

# 重新安裝依賴
pnpm install

# 手動執行檢查
pnpm run check-types
pnpm run lint

# 檢查未暫存的變更
git status
```

---

### 提交大小驗證誤報

**症狀**：合法的提交被拒絕

**可能原因**：

1. 檔案應該被排除
2. 限制對專案過於嚴格
3. 模式匹配問題

**解決方案**：

```javascript
// 在 scripts/validate-commit-size.js 中新增到 EXCLUDE_PATTERNS
const EXCLUDE_PATTERNS = [
  // ... 現有模式
  "src/specific-file.ts", // 排除特定檔案
  "migrations/**", // 排除目錄
];

// 或調整限制
const MAX_FILES = 20; // 從 15 增加
const MAX_LINES = 800; // 從 500 增加
```

---

## 效能指標

### Pre-commit Hook

| 操作               | 時間          | 快取 |
| ------------------ | ------------- | ---- |
| Prettier（1 檔案） | 約 0.1 秒     | 無   |
| ESLint（1 檔案）   | 約 0.3 秒     | 是   |
| 提交大小檢查       | 約 0.1 秒     | 無   |
| **總計（典型）**   | **約 1-3 秒** | 部分 |

---

### Commit-msg Hook

| 操作            | 時間      | 快取 |
| --------------- | --------- | ---- |
| Commitlint 驗證 | 約 0.1 秒 | 無   |

---

### Pre-push Hook

| 操作                    | 時間            | 快取 |
| ----------------------- | --------------- | ---- |
| TypeScript 檢查（首次） | 約 10-15 秒     | 無   |
| TypeScript 檢查（快取） | 約 2-3 秒       | 是   |
| ESLint（首次）          | 約 5-8 秒       | 無   |
| ESLint（快取）          | 約 1-2 秒       | 是   |
| **總計（首次）**        | **約 15-23 秒** | 無   |
| **總計（快取）**        | **約 3-5 秒**   | 是   |

---

## 相容性

**支援版本**：

- Git: >= 2.0.0
- Node.js: >= 16.0.0
- Husky: >= 8.0.0
- lint-staged: >= 13.0.0

**已知問題**：

- Git worktrees 可能需要單獨設定 Husky
- Windows 需要 Git Bash 或 WSL 來執行 shell 腳本
- 某些 CI 環境需要明確安裝 Husky

---

## 另請參閱

### 指南

- [Git 工作流程實作指南](../guides/git-workflow.md) - 逐步設定說明

### 參考

- [Commitlint 規則參考](./commitlint-rules.md) - 完整的 commitlint 配置

### 說明

- [Git Hooks 研究與最佳實務](../explanation/git-hooks-research.md) - 為何做出這些決策

### ADR

- [ADR-003：Git Hooks 最佳化](../adr/003-git-hooks-optimization.md) - 技術決策

### 外部文件

- [Husky 文件](https://typicode.github.io/husky/)
- [lint-staged 文件](https://github.com/lint-staged/lint-staged)
- [Git Hooks 文件](https://git-scm.com/docs/githooks)

---

## 更新日誌

### 版本 1.0.0 (2025-11-05)

- 初始 git hooks 配置
- 實作帶 lint-staged 的 pre-commit
- 新增帶 commitlint 的 commit-msg
- 建立帶完整驗證的 pre-push
- 實作提交大小驗證腳本
- 新增完整的排除模式
- 修復 pre-push 結束代碼檢查
- 修復 markdown 排除模式匹配
