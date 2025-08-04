# CI/CD 流程設定指南

本專案使用 Turbo 加速建置，並整合 GitHub Actions 和 Vercel 進行自動化部署。

## 🚀 Turbo Remote Cache 設定（選用）

### 本地設定

```bash
# 登入 Turbo 帳號並設定 Remote Cache
pnpm dlx turbo login
```

### GitHub Actions 設定

在 GitHub repository 的 Settings > Secrets and variables > Actions 中添加：

- `TURBO_TOKEN`: 從 `turbo login` 取得的 token
- `TURBO_TEAM`: 您的 team slug

完成後，編輯 `.github/workflows/ci.yml` 檔案，將 `turbo-remote-cache-setup` job 的條件從 `if: false` 改為 `if: true`。

## 📋 CI/CD 流程說明

### GitHub Actions 工作流程

1. **程式碼品質檢查** (`quality-checks`)
   - TypeScript 型別檢查
   - ESLint 程式碼檢查
   - Prettier 格式檢查
   - 使用 `pnpm turbo:check` 加速檢查

2. **專案建置** (`build`)
   - 依賴項目安裝
   - 使用 `pnpm turbo:build` 建置專案
   - 上傳建置結果作為 artifact

3. **部署預覽** (`deploy-preview`)
   - 僅在 Pull Request 時觸發
   - 部署到 Vercel 預覽環境

4. **正式部署** (`deploy-production`)
   - 僅在 main 分支推送時觸發
   - 部署到 Vercel 正式環境

### Vercel 部署設定

專案已設定 `vercel.json`，使用以下指令：

- 安裝依賴：`pnpm install --frozen-lockfile`
- 建置專案：`pnpm turbo:build`

## 🔧 Vercel 環境變數設定

在 Vercel Dashboard 的專案設定中添加以下 Secrets（如果需要）：

- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: 組織 ID
- `VERCEL_PROJECT_ID`: 專案 ID

## 📝 指令對照表

| 原本指令         | 優化後指令                       | 說明                        |
| ---------------- | -------------------------------- | --------------------------- |
| `pnpm run check` | `pnpm turbo:check`               | 使用 Turbo 快取加速靜態檢查 |
| `pnpm run build` | `pnpm turbo:build`               | 使用 Turbo 快取加速建置     |
| `pnpm install`   | `pnpm install --frozen-lockfile` | CI 環境使用鎖定版本安裝     |

## 🎯 效能優化

透過 Turbo Remote Cache，可以：

- ✅ 跨機器共享建置快取
- ✅ 大幅減少 CI 執行時間
- ✅ 節省 GitHub Actions 用量
- ✅ 提升開發體驗

## 🐛 疑難排解

### Turbo 快取問題

```bash
# 清除本地快取
pnpm dlx turbo prune

# 檢查 Turbo 設定
pnpm dlx turbo run build --dry-run
```

### GitHub Actions 失敗

1. 檢查 Node.js 版本是否正確
2. 確認 pnpm 版本與 `packageManager` 設定一致
3. 檢查 Secrets 是否正確設定

### Vercel 部署失敗

1. 確認 `vercel.json` 設定正確
2. 檢查環境變數是否完整
3. 查看 Vercel 建置日誌
