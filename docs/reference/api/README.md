---
title: API Reference
type: reference
status: stable
audience: [developer, ai]
tags: [api, rest, endpoints, gemini]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/architecture.md
  - guides/development-setup.md
ai_context: |
  Complete API reference for all REST endpoints including authentication,
  request/response formats, and error handling.
---

# API 參考文件

my-website 應用程式所有 API 端點的完整參考文件。

## 概覽

**Base URL**: `https://henryleelab.com/api`
**本地開發環境**: `http://localhost:3000/api`

### 身份驗證

目前所有 API 皆為公開存取（無需身份驗證）。

### 速率限制

未實作速率限制（依賴 Vercel 的預設限制）。

---

## 可用端點

### AI 功能

- [POST /api/define](./define-api.md) - AI 單字分析,包含語源、定義、範例
- [POST /api/ai-analyzer](./ai-analyzer-api.md) - 通用 AI 分析,適用於各種使用情境

### 內容

- [GET /api/medium-articles](./medium-articles-api.md) - 取得快取的 Medium 文章,支援分頁

---

## 通用回應格式

### 成功回應

```typescript
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

### 錯誤回應

```typescript
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

### HTTP 狀態碼

| 狀態碼 | 說明           | 使用情境                 |
| ------ | -------------- | ------------------------ |
| 200    | OK             | 成功的 GET/POST 請求     |
| 400    | Bad Request    | 無效的輸入參數           |
| 500    | Internal Error | 伺服器端錯誤（API 故障） |

---

## 錯誤處理

所有 API 使用一致的錯誤格式：

```typescript
interface ErrorResponse {
  success: false;
  error: string; // 人類可讀的錯誤訊息
  details?: {
    // 選用的額外上下文
    code?: string;
    field?: string;
  };
}
```

### 常見錯誤

**缺少必填欄位**：

```json
{
  "success": false,
  "error": "Missing required field: word",
  "details": { "field": "word" }
}
```

**API 速率限制**：

```json
{
  "success": false,
  "error": "Gemini API rate limit exceeded",
  "details": { "code": "RATE_LIMIT" }
}
```

**伺服器錯誤**：

```json
{
  "success": false,
  "error": "Internal server error",
  "details": { "code": "INTERNAL_ERROR" }
}
```

---

## 環境變數

API 功能所需的環境變數：

```bash
GEMINI_API_KEY=your_key_here  # AI 功能必填
NODE_ENV=development           # 環境模式
```

取得 Gemini API 金鑰：[https://ai.google.dev/](https://ai.google.dev/)

---

## 測試

### 使用 curl

```bash
# 測試 /api/define
curl -X POST http://localhost:3000/api/define \
  -H "Content-Type: application/json" \
  -d '{"word": "serendipity", "type": "etymology"}'

# 測試 /api/medium-articles
curl http://localhost:3000/api/medium-articles
```

### 使用 Postman

匯入集合：[API Collection](../../../scripts/postman-collection.json) _（未來提供）_

---

## 相關文件

- [架構參考](../architecture.md) - 系統架構
- [開發環境設定](../../guides/development-setup.md) - 本地設定
- [POST /api/define](./define-api.md) - 單字分析端點
- [POST /api/ai-analyzer](./ai-analyzer-api.md) - 通用 AI 分析
- [GET /api/medium-articles](./medium-articles-api.md) - 文章端點
