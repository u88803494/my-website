---
title: "POST /api/define - Word Analysis API"
type: reference
status: stable
audience: [developer, ai]
tags: [api, gemini, ai, dictionary, etymology]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/api/README.md
  - reference/architecture.md
ai_context: |
  API endpoint for AI-powered word analysis including etymology, definitions,
  usage examples, and related words using Google Gemini.
---

# POST /api/define

使用 Google Gemini 2.5 Flash Lite 進行 AI 驅動的單字分析。

## 端點

```
POST /api/define
```

## 說明

分析單字並回傳完整資訊,包含語源、定義、使用範例和相關單字。

## 請求

### Headers

```
Content-Type: application/json
```

### Body

```typescript
interface DefineRequest {
  word: string; // 要分析的單字
  type: "etymology" | "definition" | "example" | "all"; // 分析類型
}
```

### 範例

```bash
curl -X POST https://henryleelab.com/api/define \
  -H "Content-Type: application/json" \
  -d '{
    "word": "serendipity",
    "type": "etymology"
  }'
```

## 回應

### 成功 (200)

```typescript
interface DefineResponse {
  word: string;
  etymology?: string; // 單字起源和歷史
  definition?: string; // 意義和用法
  examples?: string[]; // 使用範例
  relatedWords?: string[]; // 相關單字
}
```

### 範例回應

```json
{
  "word": "serendipity",
  "etymology": "Coined by Horace Walpole in 1754, from the Persian fairy tale 'The Three Princes of Serendip'...",
  "definition": "The occurrence of events by chance in a happy or beneficial way...",
  "examples": [
    "Meeting my best friend was pure serendipity.",
    "The discovery was a serendipitous accident."
  ],
  "relatedWords": ["fortuitous", "coincidental", "lucky"]
}
```

### 錯誤 (400)

```json
{
  "success": false,
  "error": "Missing required field: word"
}
```

### 錯誤 (500)

```json
{
  "success": false,
  "error": "Gemini API error",
  "details": { "code": "API_ERROR" }
}
```

## 實作

### 位置

```
apps/my-website/src/app/api/define/route.ts
```

### 依賴項目

- **Gemini API**: Google Generative AI SDK
- **模型**: gemini-2.5-flash-lite
- **環境變數**: 必須設定 `GEMINI_API_KEY`

### 主要特性

- 結構化提示以確保輸出一致性
- API 失敗的錯誤處理
- 請求/回應的型別安全驗證

## 速率限制

- **Gemini 免費版**: 每分鐘 60 個請求
- **無客戶端限制**: 依賴 Gemini 的限制

## 錯誤代碼

| 代碼         | 說明                 | 狀態碼 |
| ------------ | -------------------- | ------ |
| MISSING_WORD | 未提供 word 參數     | 400    |
| API_ERROR    | Gemini API 失敗      | 500    |
| INVALID_TYPE | 無效的分析類型       | 400    |
| RATE_LIMIT   | 超過 Gemini 速率限制 | 429    |
| NO_API_KEY   | 缺少 GEMINI_API_KEY  | 500    |

## 使用範例

### 語源分析

```javascript
const response = await fetch("/api/define", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    word: "algorithm",
    type: "etymology",
  }),
});

const data = await response.json();
console.log(data.etymology);
```

### 完整分析

```javascript
const response = await fetch("/api/define", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    word: "serendipity",
    type: "all",
  }),
});

const data = await response.json();
// 回傳所有欄位: etymology, definition, examples, relatedWords
```

## React Query 整合

用於 `ai-dictionary` 功能：

```typescript
const { mutate, data, isPending } = useMutation({
  mutationFn: (word: string) =>
    fetch("/api/define", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, type: "all" }),
    }).then((res) => res.json()),
});
```

## 相關文件

- [API 概覽](./README.md)
- [POST /api/ai-analyzer](./ai-analyzer-api.md)
- [架構參考](../architecture.md)
