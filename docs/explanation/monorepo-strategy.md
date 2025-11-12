---
title: Monorepo Strategy with Turborepo（使用 Turborepo 的 Monorepo 策略）
type: explanation
status: stable
audience: [developer, architect]
tags: [monorepo, turborepo, architecture, tooling]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/architecture.md
  - explanation/feature-based-architecture.md
  - guides/development-setup.md
ai_context: |
  解釋為什麼本專案使用 Turborepo 的 monorepo 架構、
  其優勢、權衡取捨，以及如何隨專案成長而擴展。
---

# Monorepo Strategy with Turborepo（使用 Turborepo 的 Monorepo 策略）

## 概述

本專案使用 **monorepo**（單一儲存庫包含多個 packages），由 **Turborepo** 和 **pnpm workspaces** 管理。

**核心原則**：一個儲存庫、多個 packages、共享工具。

---

## 為什麼使用 Monorepo？

### 傳統多儲存庫的問題

在多儲存庫設定中，程式碼分散在多個儲存庫中：

```
my-website-app/           # 主應用程式
my-website-shared/        # 共享 utilities
my-website-tsconfig/      # TypeScript configs
```

**問題**：

1. **版本同步** - 確保所有儲存庫使用相容版本
2. **跨儲存庫變更** - 單一功能需要多個 PRs
3. **工具重複** - ESLint/Prettier configs 到處重複
4. **依賴管理** - 複雜的儲存庫間依賴追蹤
5. **CI/CD 複雜性** - 多個 pipelines 需要維護
6. **開發者體驗** - 需要 clone/install/setup 多個儲存庫

---

## Monorepo 解決方案

所有程式碼在一個儲存庫中：

```
my-website/
├── apps/
│   └── my-website/           # 主要 Next.js app
├── packages/
│   ├── shared/               # 共享 utilities/types
│   ├── tsconfig/             # 共享 TypeScript configs
│   ├── eslint-config/        # 共享 ESLint configs
│   └── tailwind-config/      # 共享 Tailwind configs
└── pnpm-workspace.yaml       # Workspace 配置
```

**優勢**：

1. ✅ **原子變更** - 跨 package 變更只需一個 PR
2. ✅ **共享工具** - 一個 ESLint/Prettier config 適用所有
3. ✅ **單一依賴樹** - pnpm 管理所有東西
4. ✅ **快速 CI/CD** - Turborepo 快取和並行化
5. ✅ **開發者體驗** - clone 一次，到處執行

---

## 架構

### Workspace 結構

```
root/
├── apps/                     # 應用程式（可部署）
│   └── my-website/           # 主要 Next.js 15 應用程式
│       ├── src/
│       ├── package.json      # App 特定的依賴
│       └── tsconfig.json     # 擴展 @packages/tsconfig
├── packages/                 # 共享 packages（libraries）
│   ├── shared/               # Utilities、types、constants
│   │   ├── src/
│   │   └── package.json
│   ├── tsconfig/             # 共享 TS configs
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── package.json
│   ├── eslint-config/        # 共享 ESLint configs
│   └── tailwind-config/      # 共享 Tailwind configs
├── pnpm-workspace.yaml       # 定義 workspace packages
├── turbo.json                # Turborepo pipeline 配置
└── package.json              # Root package.json（workspace 命令）
```

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*" # 所有 apps
  - "packages/*" # 所有 packages
```

**結果**：pnpm 將每個目錄視為一個 workspace。

---

## Turborepo 優勢

### 1. 智能快取

**沒有 Turborepo**：

```bash
pnpm run build    # 每次都建置所有東西（慢！）
```

**使用 Turborepo**：

```bash
pnpm run build    # 首次執行：建置全部
pnpm run build    # 第二次執行：快取命中，瞬間完成！⚡
```

**運作原理**：

- Turborepo 對輸入（原始檔、依賴、env vars）進行雜湊
- 如果雜湊匹配之前的執行，使用快取的輸出
- 如果雜湊改變，只重新建置受影響的 packages

### 2. 並行執行

**沒有 Turborepo**：

```bash
# 序列執行
cd packages/shared && pnpm build
cd apps/my-website && pnpm build
# 總計：5 分鐘
```

**使用 Turborepo**：

```bash
# 並行執行
turbo run build
# 並行執行 shared + my-website
# 總計：2 分鐘 ⚡
```

### 3. 增量建置

**只改變了單一 package？** Turborepo 只重新建置該 package 及其依賴者。

```bash
# 改變了 packages/shared
turbo run build
# 重新建置：
#  - packages/shared（已改變）
#  - apps/my-website（依賴 shared）
# 跳過：其他 packages（未受影響）
```

---

## 依賴管理

### 內部依賴

Packages 可以相互依賴：

```json
// apps/my-website/package.json
{
  "dependencies": {
    "@packages/shared": "workspace:*"
  }
}
```

**`workspace:*`** = "使用此 workspace 中的版本"。

**優勢**：

- 不需要發布到 npm
- 變更立即可用
- 跨 packages 的 type-safe

### 外部依賴

```json
// apps/my-website/package.json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0"
  }
}
```

**pnpm** 在 workspaces 間去重依賴。

**結果**：如果兩個 packages 使用 `react@19.0.0`，只安裝一份副本。

---

## Turborepo Pipeline

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "check-types": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": true
    }
  }
}
```

**Pipeline 規則**：

- **`build`**：依賴依賴項的 `build`（`^build`）
- **`check-types`**：依賴依賴項的 `build`
- **`lint`**：可快取（無依賴）

**結果**：Turborepo 知道執行順序，可以安全地並行化。

---

## 開發工作流程

### 安裝依賴

```bash
# 安裝所有 workspaces
pnpm install

# 為特定 workspace 新增依賴
pnpm --filter my-website add next
pnpm --filter @packages/shared add date-fns

# 為 root 新增 dev 依賴
pnpm add -D -w turbo
```

### 執行命令

```bash
# 在所有 workspaces 中執行（Turborepo）
pnpm dev          # 啟動所有 dev servers
pnpm build        # 建置所有 packages
pnpm check-types  # 檢查所有 packages 的類型

# 在特定 workspace 中執行
pnpm --filter my-website dev
pnpm --filter @packages/shared build

# 在所有符合模式的 packages 中執行
pnpm --filter "@packages/*" build
```

### 新增 Package

```bash
# 建立 package 目錄
mkdir -p packages/new-package/src

# 建立 package.json
cat > packages/new-package/package.json << EOF
{
  "name": "@packages/new-package",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
EOF

# pnpm 自動偵測它
pnpm install
```

---

## 共享配置

### TypeScript Configs

```
packages/tsconfig/
├── base.json          # 共享 base config
├── nextjs.json        # Next.js 特定 config
└── package.json
```

**在 apps 中使用**：

```json
// apps/my-website/tsconfig.json
{
  "extends": "@packages/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**優勢**：

- TS 設定的單一真相來源
- 更新一次，到處應用
- 跨 packages 的類型一致性

### ESLint Configs

```
packages/eslint-config/
├── next.js            # Next.js 特定規則
├── base.js            # 共享 base 規則
└── package.json
```

**使用**：

```js
// apps/my-website/.eslintrc.js
module.exports = {
  extends: ["@packages/eslint-config/next"],
};
```

---

## 考慮過的替代方案

### 1. Nx

**優點**：

- 更多功能（affected commands、graph visualization）
- 更適合大型企業
- Plugin 生態系統

**缺點**：

- 更複雜的配置
- 更陡峭的學習曲線
- 更重的工具

**為什麼不選擇**：Turborepo 對中小型專案更簡單。

### 2. Lerna

**優點**：

- 成熟、廣泛採用
- 適合發布到 npm

**缺點**：

- 比 Turborepo 慢（沒有快取）
- 較不活躍的開發
- 沒有智能任務排程

**為什麼不選擇**：Turborepo 更快更現代。

### 3. Yarn Workspaces（單獨）

**優點**：

- 簡單，內建於 Yarn
- 良好的依賴管理

**缺點**：

- 沒有任務編排（沒有 Turborepo 功能）
- 沒有快取
- 手動並行化

**為什麼不選擇**：需要 Turborepo 的速度和快取。

### 4. Multi-Repo（Polyrepo）

**優點**：

- 獨立版本控制
- 清楚的邊界
- 隔離的 CI/CD

**缺點**：

- 版本同步地獄
- 跨儲存庫變更痛苦
- 工具重複

**為什麼不選擇**：對本專案規模而言，Monorepo 的 DX 更優。

---

## 權衡取捨

### 我們獲得的

- ✅ **原子變更** - 跨 package 功能只需單一 PR
- ✅ **共享工具** - 一個 config 統治一切
- ✅ **快速建置** - Turborepo 快取節省數小時
- ✅ **類型安全** - 跨 workspace 邊界的 TypeScript

### 我們接受的

- ⚠️ **更大的儲存庫** - 更多檔案在一處
- ⚠️ **建置複雜性** - 更多活動部件
- ⚠️ **Merge conflicts** - 更多開發者在同一個儲存庫中（透過基於功能的架構緩解）

---

## 擴展策略

### 目前狀態（小型專案）

```
apps/
└── my-website/       # 單一 app

packages/
├── shared/           # Utilities
├── tsconfig/         # Configs
├── eslint-config/    # Configs
└── tailwind-config/  # Configs
```

**3-5 個 packages，1 個 app，可管理的大小。**

### 未來成長（中型專案）

```
apps/
├── my-website/       # 主網站
└── admin-panel/      # Admin 介面

packages/
├── ui/               # 共享 UI components
├── api-client/       # API client library
├── shared/           # Utilities
└── configs/          # 共享 configs
```

**5-10 個 packages，2-3 個 apps，Turborepo 發光。**

### 企業規模（大型專案）

```
apps/
├── web/              # 主網站
├── mobile/           # Mobile app（React Native）
├── admin/            # Admin panel
└── api/              # Backend API

packages/
├── ui/               # Component library
├── models/           # Data models
├── api-client/       # API client
├── utils/            # Utilities
└── configs/          # 共享 configs
```

**10+ packages，5+ apps，可能需要 Nx。**

---

## 最佳實踐

### ✅ 應該做的

1. **使用 workspace protocol** - 對內部依賴使用 `workspace:*`
2. **共享 configs** - 每個專案一個 ESLint/TS config
3. **積極快取** - 讓 Turborepo 快取所有東西
4. **記錄依賴** - 新增依賴時更新 turbo.json

### ❌ 不應該做的

1. **不要嵌套 workspaces** - 保持扁平結構
2. **不要跳過 turbo.json** - 正確配置 pipelines
3. **不要忽略快取** - 使用快取提升速度
4. **不要重複 configs** - 提取到 packages/

---

## CI/CD 整合

### Vercel Deployment

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "outputs": [".next/**"],
      "cache": true
    }
  }
}
```

**Vercel 自動**：

- 偵測 Turborepo
- 使用遠端快取
- 只建置變更的 apps

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: pnpm install

- name: Build
  run: pnpm build # 使用 Turborepo 快取

- name: Test
  run: pnpm test
```

**Turborepo 快取** 大幅加速 CI。

---

## 相關文件

- [Architecture Reference](../reference/architecture.md) - 完整系統架構
- [Feature-Based Architecture](./feature-based-architecture.md) - 程式碼組織
- [Development Setup](../guides/development-setup.md) - 本地設定

---

## 延伸閱讀

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo.tools](https://monorepo.tools/)
- [Why Monorepos](https://monorepo.tools/#why-a-monorepo)
