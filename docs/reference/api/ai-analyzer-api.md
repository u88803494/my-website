---
title: "POST /api/ai-analyzer - General AI Analysis API"
type: reference
status: stable
audience: [developer, ai]
tags: [api, gemini, ai, analysis]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/api/README.md
  - reference/api/define-api.md
ai_context: |
  General-purpose AI analysis endpoint for various analysis needs using
  Google Gemini with flexible prompt structure.
---

# POST /api/ai-analyzer

使用 Google Gemini 2.5 Flash Lite 進行通用 AI 分析。

## 端點

```
POST /api/ai-analyzer
```

## 說明

彈性的 AI 分析端點,接受自訂的分析需求和提示。

## 請求

### Headers

```
Content-Type: application/json
```

### Body

```typescript
interface AIAnalyzerRequest {
  need: string; // 需要什麼類型的分析
  prompt: string; // 要分析的內容或問題
}
```

### 範例

```bash
curl -X POST https://henryleelab.com/api/ai-analyzer \
  -H "Content-Type: application/json" \
  -d '{
    "need": "code review",
    "prompt": "function add(a, b) { return a + b; }"
  }'
```

## 回應

### 成功 (200)

```typescript
interface AIAnalyzerResponse {
  analysis: string; // AI 生成的分析結果
}
```

### 範例回應

```json
{
  "analysis": "This function implements simple addition. Consider adding type annotations and input validation for production use..."
}
```

### 錯誤 (400)

```json
{
  "success": false,
  "error": "Missing required fields: need or prompt"
}
```

### 錯誤 (500)

```json
{
  "success": false,
  "error": "Gemini API error"
}
```

## 實作

### 位置

```
apps/my-website/src/app/api/ai-analyzer/route.ts
```

### 依賴項目

- **Gemini API**: Google Generative AI SDK
- **模型**: gemini-2.5-flash-lite
- **環境變數**: 必須設定 `GEMINI_API_KEY`

### 提示結構

```typescript
const systemPrompt = `You are an expert ${need} assistant.`;
const userPrompt = prompt;
```

## 使用情境

### 程式碼審查

```javascript
fetch("/api/ai-analyzer", {
  method: "POST",
  body: JSON.stringify({
    need: "code review",
    prompt: "function calculate() { ... }",
  }),
});
```

### 內容分析

```javascript
fetch("/api/ai-analyzer", {
  method: "POST",
  body: JSON.stringify({
    need: "content analysis",
    prompt: "This article discusses...",
  }),
});
```

### 一般問題

```javascript
fetch("/api/ai-analyzer", {
  method: "POST",
  body: JSON.stringify({
    need: "technical explanation",
    prompt: "Explain how React hooks work",
  }),
});
```

## 速率限制

- **Gemini 免費版**: 每分鐘 60 個請求
- 與 `/api/define` 共用限制

## 錯誤代碼

| 代碼           | 說明                | 狀態碼 |
| -------------- | ------------------- | ------ |
| MISSING_FIELDS | 缺少 need 或 prompt | 400    |
| API_ERROR      | Gemini API 失敗     | 500    |
| RATE_LIMIT     | 超過速率限制        | 429    |
| NO_API_KEY     | 缺少 API 金鑰       | 500    |

## React Query 整合

```typescript
const { mutate, data, isPending } = useMutation({
  mutationFn: ({ need, prompt }: AIAnalyzerRequest) =>
    fetch("/api/ai-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ need, prompt }),
    }).then((res) => res.json()),
});
```

## 相關文件

- [API 概覽](./README.md)
- [POST /api/define](./define-api.md)
- [架構參考](../architecture.md)
