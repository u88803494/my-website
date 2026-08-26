---
title: Commitlint 配置規則參考手冊
type: reference
status: stable
audience: [developer, ai]
tags: [commitlint, git, validation, configuration]
created: 2025-11-07
updated: 2025-11-07
version: 1.0.0
related:
  - guides/git-workflow.md
  - explanation/git-hooks-research.md
  - adr/003-git-hooks-optimization.md
ai_context: |
  Complete reference documentation for all available commitlint rules and configuration options.
---

# Commitlint 規則參考手冊

## 概述

**本文件說明內容**：完整的 commitlint 規則、格式和配置選項規範，用於根據 Conventional Commits 規範驗證提交訊息。

**使用情境**：

- 為專案配置 commitlint
- 理解驗證錯誤訊息
- 自訂提交訊息要求
- 建立團隊特定的提交標準

**檔案位置**：`commitlint.config.ts` 或 `commitlint.config.js`

---

## 快速參考

**最常用的操作：**

| 操作         | 規則                                      | 說明             |
| ------------ | ----------------------------------------- | ---------------- |
| 要求類型     | `type-empty: [2, 'never']`                | 類型不可為空     |
| 有效類型     | `type-enum: [2, 'always', [...]]`         | 限制允許的類型   |
| 範圍格式     | `scope-case: [2, 'always', 'kebab-case']` | 強制範圍命名格式 |
| 主旨長度     | `subject-max-length: [2, 'always', 72]`   | 限制主旨長度     |
| 無句點       | `subject-full-stop: [2, 'never', '.']`    | 防止結尾句點     |
| 標題行總長度 | `header-max-length: [2, 'always', 100]`   | 標題行總長度限制 |

---

## 完整規範

### 規則結構

```javascript
'rule-name': [level, applicable, value]
```

**參數**：

- **level**：`0`（停用）| `1`（警告）| `2`（錯誤）
- **applicable**：`'always'` | `'never'`
- **value**：規則特定的配置值

**範例**：

```javascript
{
  'type-enum': [2, 'always', ['feat', 'fix']], // 如果類型不在清單中則錯誤
  'scope-empty': [1, 'never'],                  // 如果範圍為空則警告
  'body-max-length': [0]                        // 已停用
}
```

---

## 類型規則

### type-enum

- **類型**：`Array<string>`
- **預設值**：無（必須配置）
- **必需**：建議使用
- **說明**：將提交類型限制為特定值

**範例**：

```typescript
{
  'type-enum': [
    2,
    'always',
    [
      'feat',      // 新功能
      'fix',       // 錯誤修復
      'docs',      // 文件
      'style',     // 格式化
      'refactor',  // 程式碼重構
      'perf',      // 效能優化
      'test',      // 測試
      'build',     // 建置系統
      'ci',        // CI 配置
      'chore',     // 維護
      'revert',    // 還原提交
    ],
  ],
}
```

---

### type-case

- **類型**：`string`
- **預設值**：無
- **必需**：否
- **說明**：強制類型的大小寫格式

**有效值**：

- `lower-case` - 全小寫（建議）
- `upper-case` - 全大寫
- `camel-case` - 駝峰命名
- `kebab-case` - 短橫線命名
- `pascal-case` - 帕斯卡命名
- `sentence-case` - 句子格式
- `snake-case` - 底線命名
- `start-case` - 單字首字母大寫

**範例**：

```typescript
{
  'type-case': [2, 'always', 'lower-case']
}
```

---

### type-empty

- **類型**：`boolean`
- **預設值**：無
- **必需**：是（建議）
- **說明**：控制類型是否可為空

**範例**：

```typescript
{
  'type-empty': [2, 'never']  // 類型不可為空
}
```

---

### type-max-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：類型的最大長度

**範例**：

```typescript
{
  'type-max-length': [2, 'always', 20]
}
```

---

### type-min-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：類型的最小長度

**範例**：

```typescript
{
  'type-min-length': [2, 'always', 3]
}
```

---

## 範圍規則

### scope-enum

- **類型**：`Array<string>`
- **預設值**：無
- **必需**：建議用於 monorepo
- **說明**：將範圍限制為特定值

**範例**：

```typescript
{
  'scope-enum': [
    2,
    'always',
    [
      // Apps
      'my-website',

      // Packages
      'shared',
      'tsconfig',
      'eslint-config',

      // Features
      'resume',
      'blog',
      'ai-dictionary',

      // Infrastructure
      'deps',
      'config',
      'ci',
      'docs',
    ],
  ],
}
```

---

### scope-case

- **類型**：`string`
- **預設值**：無
- **必需**：是（建議）
- **說明**：強制範圍的大小寫格式

**有效值**：與 `type-case` 相同

**範例**：

```typescript
{
  'scope-case': [2, 'always', 'kebab-case']
}
```

---

### scope-empty

- **類型**：`boolean`
- **預設值**：無
- **必需**：可選
- **說明**：控制範圍是否可為空

**範例**：

```typescript
{
  'scope-empty': [1, 'never']  // 如果範圍為空則警告
}
```

---

### scope-max-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：範圍的最大長度

**範例**：

```typescript
{
  'scope-max-length': [2, 'always', 30]
}
```

---

### scope-min-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：範圍的最小長度

**範例**：

```typescript
{
  'scope-min-length': [2, 'always', 3]
}
```

---

## 主旨規則

### subject-case

- **類型**：`string | Array<string>`
- **預設值**：無
- **必需**：是（建議）
- **說明**：強制主旨的大小寫格式

**有效值**：與 `type-case` 相同

**範例**：

```typescript
{
  'subject-case': [2, 'always', 'lower-case']
}

// 或允許多種格式
{
  'subject-case': [
    2,
    'always',
    ['lower-case', 'sentence-case']
  ]
}
```

---

### subject-empty

- **類型**：`boolean`
- **預設值**：無
- **必需**：是
- **說明**：控制主旨是否可為空

**範例**：

```typescript
{
  'subject-empty': [2, 'never']  // 主旨不可為空
}
```

---

### subject-full-stop

- **類型**：`string`
- **預設值**：`'.'`
- **必需**：是（建議）
- **說明**：控制主旨結尾的標點符號

**範例**：

```typescript
{
  'subject-full-stop': [2, 'never', '.']  // 不可有結尾句點
}
```

---

### subject-max-length

- **類型**：`number`
- **預設值**：無
- **必需**：是（建議）
- **說明**：主旨的最大長度

**範例**：

```typescript
{
  'subject-max-length': [2, 'always', 72]  // Git 標準
}
```

---

### subject-min-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：主旨的最小長度

**範例**：

```typescript
{
  'subject-min-length': [2, 'always', 10]
}
```

---

## 標題行規則

### header-case

- **類型**：`string`
- **預設值**：無
- **必需**：否
- **說明**：強制標題行的大小寫格式

**有效值**：與 `type-case` 相同

**範例**：

```typescript
{
  'header-case': [2, 'always', 'lower-case']
}
```

---

### header-full-stop

- **類型**：`string`
- **預設值**：`'.'`
- **必需**：否
- **說明**：控制標題行結尾的標點符號

**範例**：

```typescript
{
  'header-full-stop': [2, 'never', '.']
}
```

---

### header-max-length

- **類型**：`number`
- **預設值**：無
- **必需**：是（建議）
- **說明**：整個標題行的最大長度

**範例**：

```typescript
{
  'header-max-length': [2, 'always', 100]
}
```

---

### header-min-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：標題行的最小長度

**範例**：

```typescript
{
  'header-min-length': [2, 'always', 10]
}
```

---

### header-trim

- **類型**：`boolean`
- **預設值**：無
- **必需**：否
- **說明**：修剪標題行的空白字元

**範例**：

```typescript
{
  'header-trim': [2, 'always']
}
```

---

## 內文規則

### body-leading-blank

- **類型**：`boolean`
- **預設值**：無
- **必需**：是（建議）
- **說明**：要求內文前有空白行

**範例**：

```typescript
{
  'body-leading-blank': [2, 'always']
}
```

---

### body-empty

- **類型**：`boolean`
- **預設值**：無
- **必需**：否
- **說明**：控制內文是否可為空

**範例**：

```typescript
{
  'body-empty': [1, 'never']  // 如果內文為空則警告
}
```

---

### body-max-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：內文的最大總長度

**範例**：

```typescript
{
  'body-max-length': [2, 'always', 500]
}
```

---

### body-max-line-length

- **類型**：`number`
- **預設值**：無
- **必需**：是（建議）
- **說明**：內文每行的最大長度

**範例**：

```typescript
{
  'body-max-line-length': [2, 'always', 100]
}
```

---

### body-min-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：內文的最小總長度

**範例**：

```typescript
{
  'body-min-length': [2, 'always', 20]
}
```

---

## 頁尾規則

### footer-leading-blank

- **類型**：`boolean`
- **預設值**：無
- **必需**：是（建議）
- **說明**：要求頁尾前有空白行

**範例**：

```typescript
{
  'footer-leading-blank': [2, 'always']
}
```

---

### footer-empty

- **類型**：`boolean`
- **預設值**：無
- **必需**：否
- **說明**：控制頁尾是否可為空

**範例**：

```typescript
{
  'footer-empty': [1, 'never']
}
```

---

### footer-max-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：頁尾的最大總長度

**範例**：

```typescript
{
  'footer-max-length': [2, 'always', 100]
}
```

---

### footer-max-line-length

- **類型**：`number`
- **預設值**：無
- **必需**：否
- **說明**：頁尾每行的最大長度

**範例**：

```typescript
{
  'footer-max-line-length': [2, 'always', 100]
}
```

---

## 特殊規則

### references-empty

- **類型**：`boolean`
- **預設值**：無
- **必需**：否
- **說明**：控制是否要求引用議題

**範例**：

```typescript
{
  'references-empty': [2, 'never']  // 必須引用議題
}
```

---

### signed-off-by

- **類型**：`string`
- **預設值**：`'Signed-off-by:'`
- **必需**：否
- **說明**：要求 signed-off-by 標記

**範例**：

```typescript
{
  'signed-off-by': [2, 'always', 'Signed-off-by:']
}
```

---

### trailer-exists

- **類型**：`string`
- **預設值**：無
- **必需**：否
- **說明**：要求特定的尾部標記存在

**範例**：

```typescript
{
  'trailer-exists': [2, 'always', 'Co-authored-by:']
}
```

---

## 完整配置範例

```typescript
import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // 類型規則
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
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // 範圍規則
    "scope-enum": [
      2,
      "always",
      [
        "my-website",
        "shared",
        "resume",
        "blog",
        "deps",
        "config",
        "ci",
        "docs",
      ],
    ],
    "scope-case": [2, "always", "kebab-case"],
    "scope-empty": [1, "never"], // 警告

    // 主旨規則
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-max-length": [2, "always", 72],

    // 標題行規則
    "header-max-length": [2, "always", 100],

    // 內文規則
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 100],

    // 頁尾規則（可選）
    "footer-leading-blank": [2, "always"],
  },

  helpUrl:
    "https://github.com/u88803494/my-website/blob/main/docs/guides/git-workflow.md",
};

export default Configuration;
```

---

## 大小寫格式參考

| 格式            | 範例                      | 使用情境             |
| --------------- | ------------------------- | -------------------- |
| `lower-case`    | `feat`, `my-scope`        | 類型和範圍的標準格式 |
| `upper-case`    | `FEAT`, `MY-SCOPE`        | 組織風格             |
| `camel-case`    | `myScope`, `newFeature`   | JavaScript 風格      |
| `kebab-case`    | `my-scope`, `new-feature` | 建議用於範圍         |
| `pascal-case`   | `MyScope`, `NewFeature`   | 類別名稱             |
| `sentence-case` | `My scope`, `New feature` | 自然語言             |
| `snake-case`    | `my_scope`, `new_feature` | Python 風格          |
| `start-case`    | `My Scope`, `New Feature` | 標題格式             |

---

## 驗證範例

### 有效的提交

```bash
# 基本格式
feat(blog): add infinite scroll

# 帶內文
feat(blog): add infinite scroll

Implement infinite scroll pagination for blog posts
to improve user experience and reduce initial load time.

# 帶頁尾
fix(api): correct error handling

Fixes #123

# 多個範圍（如果已配置）
feat(blog,resume): add shared component
```

---

### 無效的提交

```bash
# 缺少類型
(blog): add feature
# 錯誤：類型不可為空

# 無效的類型
added(blog): new feature
# 錯誤：類型必須是 [feat, fix, ...] 之一

# 無效的範圍
feat(unknown): add feature
# 錯誤：範圍必須是 [blog, resume, ...] 之一

# 主旨過長
feat(blog): add this really long feature description that exceeds the maximum allowed length
# 錯誤：主旨不得超過 72 個字元

# 結尾句點
feat(blog): add feature.
# 錯誤：主旨不得以 '.' 結尾

# 內文前無空白行
feat(blog): add feature
This is the body without blank line.
# 錯誤：內文前必須有空白行
```

---

## 效能考量

- 📊 **驗證速度**：每次提交 < 100ms（可忽略）
- 📊 **記憶體使用**：< 10MB
- ⚡ **最佳化建議**：在 `scope-enum` 中使用簡單的字串模式而非複雜的正規表示式

---

## 相容性

**支援版本**：

- commitlint: >= 17.0.0
- Node.js: >= 16.0.0
- Git: >= 2.0.0

**已知問題**：

- Commitlint v18+ 的 `.ts` 配置檔需要 TypeScript 4.5+
- 某些規則可能會衝突（例如：`header-max-length` vs `subject-max-length + scope`）

---

## 另請參閱

### 指南

- [Git 工作流程指南](../guides/git-workflow.md) - 實作步驟

### 說明

- [Git Hooks 研究與最佳實務](../explanation/git-hooks-research.md) - 背景與原理

### 相關參考

- [Git Hooks 配置參考](./git-hooks.md) - Hook 實作細節

### 外部文件

- [Commitlint 官方文件](https://commitlint.js.org/)
- [Conventional Commits 規範](https://www.conventionalcommits.org/)

---

## 更新日誌

### 版本 1.0.0 (2025-11-05)

- 初始 commitlint 配置
- 新增 monorepo 專用範圍
- 配置建議規則
- 設定主旨和標題行長度限制
- 新增完整文件
