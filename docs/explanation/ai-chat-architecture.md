---
title: AI Chat 架構設計
type: explanation
status: stable
audience: [developer, architect, ai]
tags: [architecture, ai, chat, streaming, vercel-ai-sdk]
created: 2026-01-06
updated: 2026-01-06
related:
  - reference/api/chat-api.md
  - explanation/feature-based-architecture.md
  - adr/005-vercel-ai-sdk.md
ai_context: |
  解釋 AI Chat 功能的架構設計、技術決策、資料流程，
  以及為什麼選擇這樣的實作方式。
---

# AI Chat 架構設計

## 概述

AI Chat 是一個支援多 AI Provider 的即時對話功能，採用 **Vercel AI SDK** 實現串流回應，遵循專案的 **Feature-Based Architecture**。

**核心設計原則**：

- 🔄 **串流優先**：即時顯示 AI 回應，提升使用者體驗
- 🔌 **多 Provider 支援**：Google、Groq、Mistral 可無縫切換
- 🛡️ **安全第一**：多層防護機制
- 📦 **DRY 原則**：前後端共用配置和型別

---

## 系統架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │  AIChatFeature  │───▶│    useChat()    │                      │
│  │   (Orchestrator)│    │ (@ai-sdk/react) │                      │
│  └────────┬────────┘    └────────┬────────┘                      │
│           │                      │                                │
│  ┌────────▼────────┐    ┌────────▼────────┐                      │
│  │  ModelSelector  │    │  ChatContainer  │                      │
│  │  ChatInput      │    │  ChatMessage    │                      │
│  └─────────────────┘    └─────────────────┘                      │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    POST /api/chat (Streaming)
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        Backend (Next.js API)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Security Layer                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │    │
│  │  │  Rate    │  │ Payload  │  │ Content  │  │  Input   │ │    │
│  │  │ Limiting │  │  Size    │  │  Type    │  │Validation│ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                │                                  │
│  ┌─────────────────────────────▼───────────────────────────┐    │
│  │                  Provider Router                         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │    │
│  │  │  Google  │  │   Groq   │  │ Mistral  │               │    │
│  │  │ (Gemini) │  │ (Llama)  │  │(Codestral)│              │    │
│  │  └──────────┘  └──────────┘  └──────────┘               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                     Shared Package (@packages/shared)            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  AI_MODELS   │  │ RATE_LIMIT   │  │ parseAIError │           │
│  │  (配置)      │  │  CONFIG      │  │  Message()   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 資料流程

### 1. 使用者發送訊息

```
User Input
    │
    ▼
ChatInput.handleSubmit()
    │
    ▼
useChat().sendMessage({ text })
    │
    ▼
DefaultChatTransport → POST /api/chat
    │
    ▼
[Request with messages + model]
```

### 2. 後端處理流程

```
POST /api/chat
    │
    ├─▶ Content-Type 驗證 (415 if invalid)
    │
    ├─▶ Payload 大小檢查 (413 if too large)
    │
    ├─▶ Rate Limiting 檢查 (429 if exceeded)
    │
    ├─▶ JSON 解析
    │
    ├─▶ Message Validation
    │   ├─ 陣列格式
    │   ├─ 訊息數量 (≤50)
    │   ├─ Role 驗證
    │   ├─ Content 非空白
    │   └─ Content 長度 (≤32KB)
    │
    ├─▶ Model Resolution
    │   └─ 無效 Model → 使用預設
    │
    ├─▶ Provider Selection
    │   ├─ 取得 Model 對應的 Provider
    │   ├─ 檢查 API Key
    │   └─ 建立 Provider Instance
    │
    └─▶ streamText() → Streaming Response
```

### 3. 串流回應處理

```
Server: streamText()
    │
    ▼
text/event-stream
    │
    ▼
useChat() 自動解析
    │
    ▼
messages 狀態更新
    │
    ▼
ChatMessage 即時渲染
```

---

## 目錄結構

```
apps/my-website/src/
├── app/
│   ├── ai-chat/
│   │   ├── layout.tsx        # 無 Footer 的特殊 layout
│   │   └── page.tsx          # 頁面進入點
│   └── api/
│       └── chat/
│           ├── route.ts      # 主要 API 端點
│           └── health/
│               └── route.ts  # Health Check 端點
│
├── features/
│   └── ai-chat/
│       ├── AIChatFeature.tsx # 主要功能組件 (Orchestrator)
│       ├── index.ts          # Barrel export
│       ├── components/
│       │   ├── index.ts
│       │   ├── ChatContainer.tsx  # 訊息容器 + Auto-scroll
│       │   ├── ChatInput.tsx      # 輸入框 + 送出邏輯
│       │   ├── ChatMessage.tsx    # 單則訊息 (memo 優化)
│       │   └── ModelSelector.tsx  # 模型下拉選單
│       └── constants/
│           └── models.ts     # Re-export from @packages/shared
│
├── lib/
│   └── rateLimit.ts          # Rate Limiting 實作
│
└── env.ts                    # T3 Env 環境變數驗證

packages/shared/src/
├── constants/
│   ├── aiModels.ts           # AI 模型配置 (SSOT)
│   ├── rateLimit.ts          # Rate Limit 配置
│   ├── routes.ts             # 路由常數
│   └── apiPaths.ts           # API 路徑常數
└── utils/
    └── aiErrorParser.ts      # 錯誤訊息解析器
```

---

## 為什麼選擇 Vercel AI SDK？

詳見 [ADR-005: Vercel AI SDK Selection](../adr/005-vercel-ai-sdk.md)

### 主要優勢

1. **統一的 Provider 介面**
   - 不同 AI Provider 使用相同的 API
   - 切換 Provider 只需改配置

2. **內建串流支援**
   - `streamText()` 自動處理 SSE
   - `useChat()` 自動解析串流

3. **React Hooks 整合**
   - `@ai-sdk/react` 提供開箱即用的 hooks
   - 自動管理 loading、error 狀態

4. **型別安全**
   - TypeScript 完整支援
   - 編譯時期錯誤檢查

---

## Provider 切換機制

### 設計目標

- 使用者可以隨時切換 AI 模型
- 後端只初始化需要的 Provider
- API Key 不會傳遞給錯誤的 Provider

### 實作方式

```typescript
// 1. 前端：透過 modelRef 傳遞選擇的模型
const modelRef = useRef(selectedModel);
modelRef.current = selectedModel;

const { sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: "/api/chat",
    body: () => ({ model: modelRef.current }),
  }),
});

// 2. 後端：根據模型決定 Provider
function getProviderForModel(modelId: AIModelId) {
  const model = getModelById(modelId);
  const config = getProviderConfig()[model.provider];

  if (!config.apiKey) {
    throw new Error("API key not configured");
  }

  return { provider: model.provider, apiKey: config.apiKey };
}

// 3. 只建立需要的 Provider Instance
const provider = createProviderInstance(
  providerInfo.provider,
  providerInfo.apiKey,
);
```

### 為什麼使用 `useRef`？

`useChat` 的 `body` 參數是在初始化時設定的。使用 `useRef` 確保每次發送訊息時都能讀取到最新的模型選擇，而不是閉包捕獲的舊值。

---

## 安全性設計

### 多層防護架構

```
Request
   │
   ├─▶ Layer 1: Content-Type 驗證
   │   └─ 只接受 application/json
   │
   ├─▶ Layer 2: Payload 大小限制
   │   └─ 512KB 上限，防止 DoS
   │
   ├─▶ Layer 3: Rate Limiting
   │   ├─ IP-based 限制
   │   ├─ 已知 IP: 20 req/min
   │   └─ 未知 IP: 5 req/min
   │
   ├─▶ Layer 4: Input Validation
   │   ├─ 訊息數量限制 (50)
   │   ├─ 單一訊息長度 (32KB)
   │   ├─ Role 白名單驗證
   │   └─ 空白內容檢查
   │
   └─▶ Layer 5: Output 限制
       └─ MAX_OUTPUT_TOKENS: 4096
```

### Rate Limiting 實作

```typescript
// In-Memory Map with cleanup
const rateLimitMap = new Map<string, RateLimitRecord>();

// 定期清理過期記錄
function cleanupExpiredEntries() { ... }

// 記憶體保護 (最多 10,000 entries)
function evictOldestEntries() { ... }
```

### IP 驗證

```typescript
// 優先使用可信的 Platform Headers
function getClientIP(request: Request): string {
  // 1. Vercel x-real-ip (可信)
  // 2. Cloudflare cf-connecting-ip (可信)
  // 3. x-forwarded-for (需謹慎)
  // 4. "unknown" (套用更嚴格限制)
}
```

---

## 錯誤處理策略

### 統一的錯誤解析器

```typescript
// @packages/shared/utils/aiErrorParser.ts
function parseAIErrorMessage(message: string): ParsedAIError {
  return {
    type: AIErrorType,      // 錯誤分類
    message: string,        // 用戶友善訊息
    isQuotaError: boolean,  // 是否為配額問題
    isRetryable: boolean,   // 是否可重試
    suggestAlternative: boolean,  // 是否建議切換模型
    model?: string,         // 相關的模型名稱
  };
}
```

### 錯誤類型對應

| 錯誤類型          | HTTP Status | 前端處理              |
| ----------------- | ----------- | --------------------- |
| quota_exceeded    | 429         | 顯示警告 + 建議換模型 |
| rate_limited      | 429         | 顯示重試按鈕          |
| model_unavailable | 503         | 顯示錯誤 + 建議換模型 |
| auth_error        | 503         | 顯示設定錯誤          |
| network_error     | 503         | 顯示重試按鈕          |
| unknown           | 500         | 顯示通用錯誤 + 重試   |

---

## 效能優化

### 前端優化

1. **React.memo** - ChatMessage 避免不必要 re-render
2. **useMemo** - textContent 計算結果快取
3. **useCallback** - Handler 函數引用穩定
4. **useRef** - 模型選擇不觸發 re-render

### 後端優化

1. **Provider 延遲初始化** - 只建立需要的 Provider
2. **Rate Limit Map Cleanup** - 定期清理過期記錄
3. **Eviction 策略** - 超過上限時移除最舊記錄

---

## 擴展指南

### 新增 AI Provider

1. 安裝 SDK：`pnpm add @ai-sdk/[provider]`

2. 更新 `aiModels.ts`：

   ```typescript
   export type AIModelProvider = "google" | "groq" | "mistral" | "newprovider";

   export const AI_MODELS: AIModelInfo[] = [
     // ... existing
     { id: "new-model", name: "New Model", provider: "newprovider", ... },
   ];
   ```

3. 更新 `route.ts`：

   ```typescript
   import { createNewProvider } from "@ai-sdk/newprovider";

   function getProviderConfig() {
     return {
       // ... existing
       newprovider: {
         apiKey: env.NEWPROVIDER_API_KEY,
         models: AI_MODELS.filter((m) => m.provider === "newprovider").map(
           (m) => m.id,
         ),
       },
     };
   }

   function createProviderInstance(provider, apiKey) {
     switch (provider) {
       // ... existing
       case "newprovider":
         return createNewProvider({ apiKey });
     }
   }
   ```

4. 更新 `env.ts` 加入新的環境變數

### 新增功能

- **Markdown 渲染**：見 Issue #66
- **智慧 Auto-Scroll**：見 Issue #67
- **訊息虛擬化**：見 Issue #73

---

## 相關文件

- [Chat API Reference](../reference/api/chat-api.md)
- [ADR-005: Vercel AI SDK Selection](../adr/005-vercel-ai-sdk.md)
- [Feature-Based Architecture](./feature-based-architecture.md)
