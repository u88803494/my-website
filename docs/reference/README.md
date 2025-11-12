# 📋 參考文件

**資訊導向文件** - 完整的技術規格、API、配置及實務資訊。

## 📖 理念

參考文件提供精確、不摻雜情感的技術資訊。它描述事物如何運作，但不進行教學或指導。

**特點：**

- ✅ 資訊導向（陳述事實）
- ✅ 全面且準確
- ✅ 組織良好且結構化
- ✅ 格式一致
- ✅ 易於掃描和搜尋

**不適用於：**

- ❌ 解釋概念（請使用 [說明文件](../explanation/)）
- ❌ 逐步教學（請使用 [教學文件](../tutorials/)）
- ❌ 解決問題（請使用 [指南](../guides/)）

---

## 📚 可用的參考文件

### 系統與架構

- **[架構](./architecture.md)** - 系統架構與組件關係
- **環境變數** - 所有環境變數 _(即將推出)_
- **CLI 指令** - 可用的 pnpm scripts 和指令 _(即將推出)_

### Git 與 CI/CD

- **[Commitlint 規則](./commitlint-rules.md)** - Commit 訊息規則與範圍
- **[Git Hooks](./git-hooks.md)** - Pre-commit、commit-msg、pre-push 配置

### API

- **[API 參考](./api/)** - 所有端點的完整 API 規格

---

## 🔍 組織原則

### 按技術領域分類

參考文件按技術領域組織，而非按使用者任務：

- **System**：架構、環境、CLI
- **Git/CI**：Commit 規則、hooks、自動化
- **API**：REST endpoints、GraphQL queries
- **Components**：React 組件、hooks、工具函式（如有需要）

### 一致的結構

每份參考文件都遵循標準格式：

1. **概述**：簡短描述
2. **規格**：完整的技術細節
3. **參數/選項**：所有可用的配置
4. **範例**：最小可運作範例
5. **相關**：連結到指南和說明文件

---

## 🆕 建立新的參考文件

使用[參考文件範本](../.templates/reference-template.md)：

```bash
cp docs/.templates/reference-template.md docs/reference/your-reference.md
```

**命名慣例：**

- 使用 kebab-case：`your-reference.md`
- 具體明確：`commitlint-rules.md` 而非 `rules.md`
- 事實性名稱：`git-hooks.md` 而非 `git-hooks-guide.md`

**必要章節：**

1. 概述（記錄什麼）
2. 規格（完整細節）
3. 所有選項/參數（詳盡清單）
4. 範例（最小、可運作的程式碼）
5. 相關文件（交叉引用）

**最佳實踐：**

- 內容務求詳盡完整
- 使用表格呈現結構化資料
- 包含型別簽名
- 提供最小範例（非教學）
- 保持說明簡短（連結到說明文件）

---

## 🤖 給 AI Agents

當使用者詢問**技術規格**或**「什麼是」**類型的問題時：

1. 檢查參考文件是否存在
2. 如不存在，使用範本建立
3. 專注於事實，而非流程
4. 包含所有選項/參數
5. 連結到指南了解操作方式，連結到說明文件了解原因

**範例對應：**

- 「允許哪些 commit 類型？」 → Commitlint Rules 參考
- 「有哪些環境變數可用？」 → Environment Variables 參考
- 「如何使用 git hooks？」 → Git Workflow 指南（非參考文件）
- 「為什麼我們使用這個模式？」 → 說明文件（非參考文件）

**API 文件格式：**

```markdown
# POST /api/endpoint

## Request

### Headers

- `Content-Type: application/json`

### Body

\`\`\`typescript
interface Request {
param: string;
}
\`\`\`

## Response

### Success (200)

\`\`\`typescript
interface Response {
data: string;
}
\`\`\`

### Error (400, 500)

\`\`\`typescript
interface ErrorResponse {
error: string;
}
\`\`\`

## Implementation

- Location: `apps/my-website/src/app/api/endpoint/route.ts`
- Uses: Gemini API, rate limiting
```
