# Monorepo Improvement Suggestions

## ✅ Completed Improvements

### 1. Lint-staged Configuration Enhancement

**Problem**: lint-staged 配置不夠完善，未能阻止有問題的程式碼被提交

**Solutions Applied**:

- ✅ 將配置從 JSON 改為 JS 檔案，支援註解說明
- ✅ 新增 `lint-staged` 腳本到 package.json
- ✅ 實施三階段檢查流程：
  1. **Prettier 格式化** - 確保程式碼風格一致
  2. **ESLint 檢查** - 程式碼品質與規範檢查（--max-warnings=0）
  3. **TypeScript 型別檢查** - 嚴格模式型別安全檢查（--strict）
- ✅ 分離不同檔案類型的處理邏輯，避免重複執行

**Result**: 現在任何有 ESLint 錯誤、TypeScript 型別錯誤或格式問題的程式碼都無法通過 pre-commit 檢查

### 2. 清理舊配置

- ✅ 移除了 `apps/docs` 相關的舊配置檔案
- ✅ 重新生成 pnpm-lock.yaml 移除無效引用

## Suggestions for Improvement

1. **Monorepo Structure**:
   - Consider using workspaces or similar setups to better manage packages within the monorepo environment.
   - Ensure each subpackage has its `package.json` specifying local dependencies where needed.

2. **Consolidated Type Checking**:
   - Use a single `tsconfig` file for shared TypeScript settings across packages, with each package extending from it.

3. **Build Process**:
   - Centralize the build scripts to avoid duplication, possibly within a tools or scripts directory that's shared across services.

4. **Code Quality**:
   - Implement consistent lint and formatting tools, like ESLint and Prettier.
   - Ensure all packages have the same ESLint configuration to maintain consistency.

5. **Testing**:
   - Utilize a shared testing configuration and utilities module.
   - Have centralized CI/CD setup to cover all packages, easing the testing and deployment process.

6. **Documentation**:
   - Consider using a tool like Storybook for UI components to provide better documentation.
   - Ensure API documentation is consistently maintained for all packages.
