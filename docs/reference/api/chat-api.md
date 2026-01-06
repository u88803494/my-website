---
title: "POST /api/chat - AI Chat Streaming API"
type: reference
status: stable
audience: [developer, ai]
tags: [api, ai, chat, streaming, gemini, groq, mistral]
created: 2026-01-06
updated: 2026-01-06
related:
  - reference/api/README.md
  - reference/architecture.md
  - explanation/ai-chat-architecture.md
ai_context: |
  API endpoint for AI-powered chat with streaming responses.
  Supports multiple providers (Google Gemini, Groq, Mistral) with automatic
  rate limiting, input validation, and security hardening.
---

# POST /api/chat

AI 對話 API，支援多個 AI Provider 的串流回應。

## 端點

```
POST /api/chat
```

## 說明

處理使用者訊息並回傳 AI 助手的串流回應。支援 Google Gemini、Groq、Mistral 三個 Provider。

## 請求

### Headers

```
Content-Type: application/json
```

### Body

```typescript
interface ChatRequest {
  messages: Message[]; // 對話歷史
  model?: AIModelId; // 選用，預設為 "gemini-2.5-flash"
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

type AIModelId =
  | "gemini-2.5-flash"
  | "gemini-2.0-flash-exp"
  | "llama-3.3-70b"
  | "deepseek-r1"
  | "mistral-large"
  | "codestral";
```

### 範例

```bash
curl -X POST https://henryleelab.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "什麼是 TypeScript?" }
    ],
    "model": "gemini-2.5-flash"
  }'
```

## 回應

### 成功 (200) - Streaming

回傳 `text/event-stream` 格式的串流回應，使用 Vercel AI SDK 的 UI Message Stream 格式。

```typescript
// 串流事件格式
data: {"type":"text","text":"TypeScript 是..."}
data: {"type":"text","text":"一種程式語言..."}
data: {"type":"finish","finishReason":"stop"}
```

### Headers

成功回應包含以下 headers：

```
Content-Type: text/event-stream
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1704531600
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### 錯誤回應

#### 400 Bad Request

```json
{
  "error": "訊息格式不正確"
}
```

#### 413 Payload Too Large

```json
{
  "error": "請求內容過大，請減少訊息數量"
}
```

#### 415 Unsupported Media Type

```json
{
  "error": "Content-Type 必須是 application/json"
}
```

#### 429 Too Many Requests

```json
{
  "error": "請求過於頻繁，請稍後再試",
  "retryAfter": 45
}
```

Headers:

```
Retry-After: 45
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704531600
```

#### 503 Service Unavailable

```json
{
  "error": "此模型目前無法使用，請選擇其他模型",
  "errorType": "model_unavailable",
  "suggestAlternative": true
}
```

## 支援的模型

| Model ID             | Provider | 說明                    |
| -------------------- | -------- | ----------------------- |
| gemini-2.5-flash     | Google   | Gemini 2.5 Flash (預設) |
| gemini-2.0-flash-exp | Google   | Gemini 2.0 Flash 實驗版 |
| llama-3.3-70b        | Groq     | Llama 3.3 70B           |
| deepseek-r1          | Groq     | DeepSeek R1             |
| mistral-large        | Mistral  | Mistral Large           |
| codestral            | Mistral  | Codestral (程式碼專用)  |

## 限制

### 請求限制

| 項目         | 限制值 | 說明                   |
| ------------ | ------ | ---------------------- |
| Payload 大小 | 512 KB | 整體請求大小           |
| 訊息數量     | 50     | 單次請求最大訊息數     |
| 單一訊息長度 | 32 KB  | 每則訊息的最大字元數   |
| 輸出 Token   | 4096   | AI 回應的最大 token 數 |

### Rate Limiting

| 類型    | 限制        | 時間窗口 |
| ------- | ----------- | -------- |
| 一般 IP | 20 requests | 1 分鐘   |
| 未知 IP | 5 requests  | 1 分鐘   |

## 實作

### 位置

```
apps/my-website/src/app/api/chat/route.ts
```

### 依賴項目

- **@ai-sdk/google**: Google Gemini SDK
- **@ai-sdk/groq**: Groq SDK
- **@ai-sdk/mistral**: Mistral SDK
- **ai**: Vercel AI SDK Core

### 環境變數

| 變數名稱        | 必要性 | 說明              |
| --------------- | ------ | ----------------- |
| GEMINI_API_KEY  | 必要   | Google Gemini Key |
| GROQ_API_KEY    | 選用   | Groq API Key      |
| MISTRAL_API_KEY | 選用   | Mistral API Key   |

## 錯誤代碼

| errorType         | 說明           | 狀態碼 | 可重試 |
| ----------------- | -------------- | ------ | ------ |
| quota_exceeded    | API 配額已用完 | 429    | 否     |
| rate_limited      | 請求頻率過高   | 429    | 是     |
| model_unavailable | 模型不可用     | 503    | 否     |
| auth_error        | API Key 無效   | 503    | 否     |
| network_error     | 網路連線問題   | 503    | 是     |
| unknown           | 未知錯誤       | 500    | 是     |

## 使用範例

### 基本對話

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "你好！" }],
  }),
});

const reader = response.body?.getReader();
// 處理串流回應...
```

### 使用 Vercel AI SDK

```typescript
import { useChat } from "@ai-sdk/react";

const { messages, sendMessage, status } = useChat({
  api: "/api/chat",
  body: { model: "gemini-2.5-flash" },
});

// 發送訊息
sendMessage({ text: "什麼是 React?" });
```

### 切換模型

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "寫一個排序演算法" }],
    model: "codestral", // 使用 Codestral 處理程式碼
  }),
});
```

## Health Check 端點

```
GET /api/chat/health
```

回傳 Provider 狀態和可用模型資訊：

```json
{
  "status": "healthy",
  "timestamp": "2026-01-06T12:00:00.000Z",
  "providers": {
    "google": { "configured": true, "modelCount": 2 },
    "groq": { "configured": true, "modelCount": 2 },
    "mistral": { "configured": false, "modelCount": 2 }
  },
  "totalModels": 6,
  "availableModels": 4
}
```

## 相關文件

- [API 概覽](./README.md)
- [AI Chat 架構說明](../../explanation/ai-chat-architecture.md)
- [POST /api/define](./define-api.md)
- [POST /api/ai-analyzer](./ai-analyzer-api.md)
