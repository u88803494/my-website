# Git Workflow Guide：實作 Pre-commit 與 Pre-push 檢查

---

title: Git Workflow Guide - Pre-commit 與 Pre-push 檢查
type: guide
status: stable
audience: [developer]
tags: [git, workflow, automation, hooks, commitlint]
created: 2025-11-07
updated: 2025-11-07
difficulty: intermediate
estimated_time: 30 minutes
related:

- reference/commitlint-rules.md
- reference/git-hooks.md
- explanation/git-hooks-research.md
- adr/003-git-hooks-optimization.md
  ai_context: |
  實作 git 自動化檢查的逐步指南，包含 pre-commit hooks、pre-push 驗證、commitlint 與 commit 大小驗證。

---

## 概覽

**您將完成的目標：**
在 Turborepo monorepo 專案中設定自動化 git hooks，用於程式碼品質檢查、commit 訊息驗證與 commit 大小限制。

**重要性：**
自動化 git hooks 可及早發現錯誤、強制執行程式碼標準，並透過快速回饋改善開發體驗，且不會拖慢開發流程。

---

## 先決條件

開始之前，請確保您具備：

- [ ] 已安裝 Node.js 與 pnpm
- [ ] 專案中已安裝 Husky
- [ ] Turborepo 已設定 lint 與 type-check scripts
- [ ] 對 git hooks 有基本理解

**假定知識：**

- Git 基礎（commit、push、staging）
- Package.json script 設定
- TypeScript 與 ESLint 基礎

---

## 步驟

### 步驟 1：安裝必要相依套件

安裝 commitlint 及其設定檔：

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**預期結果**：相依套件已新增至 `package.json` 與 `node_modules`。

**此步驟原因**：Commitlint 依 Conventional Commits 規範驗證 commit 訊息。

---

### 步驟 2：建立 Commit 大小驗證腳本

建立 `scripts/validate-commit-size.js`：

```javascript
#!/usr/bin/env node

const { execSync } = require("child_process");

// Configuration
const MAX_FILES = 15;
const MAX_LINES = 500;

// Exclude patterns
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

function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => {
    if (pattern.startsWith("**/")) {
      const suffix = pattern.substring(3);
      if (suffix.startsWith("*.")) {
        const ext = suffix.substring(1);
        return filePath.endsWith(ext);
      }
      return filePath.endsWith(suffix) || filePath.includes("/" + suffix);
    }
    const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, "[^/]*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  });
}

try {
  // Get staged files
  const stagedFiles = execSync("git diff --cached --name-only", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter(Boolean)
    .filter((f) => !isExcluded(f));

  // Check file count
  if (stagedFiles.length > MAX_FILES) {
    console.error("");
    console.error(
      `❌ Commit contains too many files: ${stagedFiles.length}/${MAX_FILES}`,
    );
    console.error("");
    console.error("📝 Please split changes into smaller commits");
    console.error("");
    console.error("Modified files:");
    stagedFiles.forEach((file) => console.error(`  - ${file}`));
    console.error("");
    process.exit(1);
  }

  // Check line changes
  const diffStats = execSync("git diff --cached --numstat", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter(Boolean)
    .filter((line) => {
      const filename = line.split("\t")[2];
      return filename && !isExcluded(filename);
    });

  let totalAdded = 0;
  let totalDeleted = 0;

  diffStats.forEach((line) => {
    const [added, deleted] = line.split("\t").map(Number);
    if (!isNaN(added)) totalAdded += added;
    if (!isNaN(deleted)) totalDeleted += deleted;
  });

  const totalChanges = totalAdded + totalDeleted;

  if (totalChanges > MAX_LINES) {
    console.error("");
    console.error(
      `❌ Commit changes too many lines: ${totalChanges}/${MAX_LINES}`,
    );
    console.error(
      `   Added: ${totalAdded} lines, Deleted: ${totalDeleted} lines`,
    );
    console.error("");
    console.error("📝 Please split changes into smaller commits");
    console.error("");
    process.exit(1);
  }

  // Success
  console.log("");
  console.log("✅ Commit size validation passed:");
  console.log(`   Files: ${stagedFiles.length}/${MAX_FILES}`);
  console.log(
    `   Lines: ${totalChanges}/${MAX_LINES} (Added: ${totalAdded}, Deleted: ${totalDeleted})`,
  );
  console.log("");
} catch (error) {
  console.error("");
  console.error("❌ Error validating commit size:", error.message);
  console.error("");
  process.exit(1);
}
```

**預期結果**：在 `scripts/` 目錄建立腳本檔案。

---

### 步驟 3：建立 Commitlint 設定檔

在專案根目錄建立 `commitlint.config.ts`：

```typescript
import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],

    "scope-enum": [
      2,
      "always",
      [
        "my-website",
        "shared",
        "tsconfig",
        "eslint-config",
        "resume",
        "blog",
        "ai-dictionary",
        "ai-analyzer",
        "time-tracker",
        "about",
        "not-found",
        "deps",
        "config",
        "ci",
        "scripts",
        "docs",
        "all",
      ],
    ],

    "header-max-length": [2, "always", 100],
    "subject-max-length": [2, "always", 72],
    "subject-case": [2, "always", "lower-case"],
    "subject-full-stop": [2, "never", "."],
    "subject-empty": [2, "never"],
    "body-leading-blank": [2, "always"],
    "scope-case": [2, "always", "kebab-case"],
    "scope-empty": [1, "never"],
  },

  helpUrl:
    "https://github.com/u88803494/my-website/blob/main/docs/guides/git-workflow.md",
};

export default Configuration;
```

**預期結果**：Commitlint 設定檔已建立。

---

### 步驟 4：設定 Git Hooks

#### 4.1 更新 `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Lint staged files
pnpm lint-staged

# Validate commit size
node scripts/validate-commit-size.js
```

#### 4.2 建立 `.husky/commit-msg`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

#### 4.3 建立 `.husky/pre-push`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running comprehensive checks before push..."
echo ""

# TypeScript type checking
echo "📘 Type checking..."
pnpm run check-types || { echo "\n❌ Type check failed. Please fix errors before pushing."; exit 1; }

# ESLint full check
echo ""
echo "🔧 Linting..."
pnpm run lint || { echo "\n❌ Linting failed. Please fix errors before pushing."; exit 1; }

echo ""
echo "✅ All pre-push checks passed!"
```

**預期結果**：三個 git hook 檔案已建立並設定完成。

---

### 步驟 5：更新 lint-staged 設定

修改 `lint-staged.config.js` 以移除 TypeScript 檢查：

```javascript
module.exports = {
  "apps/my-website/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
    // ❌ 已移除：tsc --noEmit
  ],
  "packages/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "**/*.{json,css,scss,md,mdx,yaml,yml}": ["prettier --write"],
};
```

**預期結果**：lint-staged 僅執行快速檢查（Prettier + ESLint）。

---

### 步驟 6：設定檔案權限

為所有 hook 檔案設定執行權限：

```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
chmod +x scripts/validate-commit-size.js
```

**預期結果**：所有腳本都具備執行權限。

---

## 驗證

**如何驗證成功：**

1. **Pre-commit 速度測試**：修改檔案並 commit。應在 < 5 秒內完成。
2. **Commitlint 驗證**：嘗試無效的 commit 訊息。應被拒絕。
3. **Commit 大小限制**：嘗試 commit 20 個檔案。應被拒絕。
4. **Pre-push 驗證**：在有型別錯誤時 push。應被阻擋。

**驗證指令：**

```bash
# 測試 1：Pre-commit 速度
echo "// test" >> test.ts
git add test.ts
time git commit -m "test: verify speed"
# 預期：< 5 秒

# 測試 2：無效的 commit 訊息
git commit -m "Add feature"
# 預期：❌ 錯誤

# 測試 3：有效的 commit 訊息
git commit -m "feat(test): add test file"
# 預期：✅ 成功

# 測試 4：Pre-push（程式碼正常時）
git push
# 預期：檢查後 ✅ 成功
```

---

## 疑難排解

### 問題 1：Pre-commit Hook 未執行

**症狀**：Commit 成功但未執行 hooks。

**原因**：Git hooks 未正確初始化或權限問題。

**解決方法**：

```bash
# 重新安裝 husky
pnpm exec husky install

# 設定權限
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

---

### 問題 2：Commitlint 對有效訊息失敗

**症狀**：錯誤訊息「scope must be one of [...]」但 scope 有效。

**原因**：Scope 不在設定清單中。

**解決方法**：
將 scope 新增至 `commitlint.config.ts`：

```typescript
"scope-enum": [
  2,
  "always",
  [
    // ... 現有 scopes
    "your-new-scope",
  ],
],
```

---

### 問題 3：Pre-push 太慢

**症狀**：Pre-push 執行時間超過 20 秒。

**原因**：沒有 Turborepo cache。

**解決方法**：
第一次 push 會較慢。後續 push 會使用 cache（約 3-5 秒）。緊急情況下可使用：

```bash
git push --no-verify
```

⚠️ **警告**：僅在緊急情況使用 `--no-verify`。使用率應 < 5%。

---

### 問題 4：Lock 檔案被計入 Commit 大小

**症狀**：`pnpm-lock.yaml` 變更觸發大小限制。

**原因**：檔案不在排除模式中。

**解決方法**：
Lock 檔案已被排除。如問題持續，請驗證 `scripts/validate-commit-size.js` 中的 `EXCLUDE_PATTERNS`。

---

## 技巧與最佳實踐

- 💡 **技巧 1**：使用符合專案結構的描述性 scopes（features、packages）
- 💡 **技巧 2**：在 commit 前先在本地執行 `pnpm run check` 以及早發現問題
- 💡 **技巧 3**：如需暫時繞過 hooks，請謹慎使用 `--no-verify`
- 💡 **技巧 4**：根據團隊需求調整驗證腳本中的 `MAX_FILES` 與 `MAX_LINES`
- ⚠️ **警告**：永遠不要永久停用 hooks - 它們是您的安全網

---

## 相關文件

### 概念

- [Git Hooks 研究與最佳實踐](../explanation/git-hooks-research.md) - 業界研究與理論基礎

### 參考

- [Commitlint 規則參考](../reference/commitlint-rules.md) - 完整規則規範
- [Git Hooks 設定參考](../reference/git-hooks.md) - Hook 實作細節

### ADR

- [ADR-003：Git Hooks 最佳化](../adr/003-git-hooks-optimization.md) - 技術決策

---

## 常見問題

### Q1：為何不在 pre-commit 執行 TypeScript 檢查？

**A**：TypeScript 必須檢查整個專案（8-15 秒），對 pre-commit 來說太慢。87% 的開發者期望 pre-commit 在 < 3 秒內完成。我們將型別檢查移至 pre-push。

---

### Q2：緊急情況下可以跳過這些檢查嗎？

**A**：可以，使用 `--no-verify` flag：

```bash
# 跳過 pre-commit 與 commit-msg
git commit --no-verify -m "emergency fix"

# 跳過 pre-push
git push --no-verify
```

然而，這應該很少使用（< 5% 的 commits）。

---

### Q3：如何從大小驗證中排除特定檔案？

**A**：將 patterns 新增至 `scripts/validate-commit-size.js` 的 `EXCLUDE_PATTERNS`：

```javascript
const EXCLUDE_PATTERNS = [
  // ... 現有 patterns
  "src/legacy/**", // 排除目錄
  "migration-*.ts", // 排除 pattern
];
```

---

### Q4：如果我的 commit 確實需要 20 個檔案怎麼辦？

**A**：考慮是否可以邏輯性分割。如果不行，調整驗證腳本中的 `MAX_FILES` 或使用 `--no-verify` 並說明理由。

---

## 下一步

完成本指南後，您可能想要：

1. [理解這些決策背後的研究](../explanation/git-hooks-research.md)
2. [檢視完整的 commitlint 設定選項](../reference/commitlint-rules.md)
3. [閱讀架構決策記錄](../adr/003-git-hooks-optimization.md)
4. 設定 CI/CD 以執行相同的檢查
5. 考慮新增 conventional changelog 生成
