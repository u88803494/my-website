# ADR-005: 採用 Vercel AI SDK 作為 AI 整合方案

---

title: 採用 Vercel AI SDK 作為 AI 整合方案
type: adr
status: accepted
date: 2025-12-28
deciders: [Henry Lee]
consulted: []
informed: []
tags: [ai, streaming, sdk, architecture]
related:

- ../reference/api/ai-chat.md
  ai_context: |
  為 AI Chat 功能選擇整合方案，需要支援 streaming response 和多模型切換。
  經評估後選擇 Vercel AI SDK，因其統一 API 和優秀的 React 整合。

---

## 狀態

**已接受**

- 提議日期：2025-12-28
- 接受日期：2025-12-28

## 背景

**我們面臨的議題或問題是什麼？**

專案需要為 AI Chat 功能選擇合適的 AI 整合方案。目前專案已使用 `@google/generative-ai` 直接呼叫 Gemini API（用於 AI Dictionary 和 AI Analyzer），但這種方式有以下限制：

**技術限制**：

- 直接使用各家 SDK 需要分別處理不同的 API 格式
- Streaming response 需要自行實作 Server-Sent Events (SSE)
- 多模型切換需要大量 boilerplate code

**業務需求**：

- 需要展示 streaming 打字機效果（提升 AI 體驗感）
- 需要支援多模型切換（Gemini/OpenAI/Claude）以最大化免費額度
- 作為求職作品集，需要展示現代 AI 整合能力

**開發體驗**：

- 希望有統一的 API 介面
- 希望有現成的 React hooks 減少樣板代碼
- 希望減少維護成本

## 決策

**採用 Vercel AI SDK 作為 AI 整合方案。**

Vercel AI SDK 提供：

- 統一的 `streamText` / `generateText` API
- 內建 React hooks：`useChat`、`useCompletion`
- 多 provider 支援：`@ai-sdk/google`、`@ai-sdk/openai`、`@ai-sdk/anthropic`
- 完善的 TypeScript 支援

## 後果

### 正面影響

- ✅ **統一 API**：使用相同的 `streamText` 函數，只需切換 model 參數即可切換 provider
- ✅ **內建 React hooks**：`useChat` 自動處理訊息狀態、streaming、錯誤處理
- ✅ **完善的 streaming 支援**：自動處理 SSE、自動更新 UI
- ✅ **類型安全**：完整的 TypeScript 定義
- ✅ **社群活躍**：Vercel 維護，更新頻繁，文件完善
- ✅ **履歷加分**：展示使用業界標準 AI SDK 的能力

### 負面影響

- ❌ **額外依賴**：需要安裝多個 packages（`ai`、`@ai-sdk/google` 等）
- ❌ **學習曲線**：需要學習新的 API 和 hooks 用法
- ❌ **與現有實作不一致**：AI Dictionary 仍使用 `@google/generative-ai`，造成兩種模式並存

### 中性影響

- ℹ️ 未來可考慮將 AI Dictionary 也遷移至 Vercel AI SDK，統一技術棧
- ℹ️ 需要額外的環境變數設定（`OPENAI_API_KEY`、`ANTHROPIC_API_KEY`）

## 考慮過的替代方案

### 替代方案 1：直接使用各家 SDK

**描述**：繼續使用 `@google/generative-ai`，並視需要加入 `openai`、`@anthropic-ai/sdk`。

**優點**：

- 不需要學習新的抽象層
- 完全控制 API 呼叫細節
- 減少依賴數量

**缺點**：

- 需要自行實作 streaming 邏輯
- 多模型切換需要大量條件判斷
- 每個 provider 的 API 格式不同，維護成本高

**未選擇原因**：開發效率低，需要重複造輪子。

---

### 替代方案 2：LangChain.js

**描述**：使用 LangChain.js 作為 AI 整合層。

**優點**：

- 功能豐富（chains、agents、memory、RAG）
- 社群龐大
- 多 provider 支援

**缺點**：

- 過於複雜，對於簡單的 chat 功能是過度設計
- Bundle size 較大
- 學習曲線陡峭
- React 整合不如 Vercel AI SDK 原生

**未選擇原因**：對於目前需求（streaming chat）過於複雜，未來若需要 RAG 可再評估。

---

### 替代方案 3：自行實作 Streaming

**描述**：使用原生 `@google/generative-ai` 搭配自行實作的 SSE streaming。

**優點**：

- 完全控制實作細節
- 無額外依賴

**缺點**：

- 需要自行處理 SSE 編碼/解碼
- 需要自行管理 React 狀態
- 錯誤處理複雜
- 多模型支援需要大量重構

**未選擇原因**：重複造輪子，開發時間長，維護成本高。

## 實作

**此決策將如何實作？**

1. 安裝依賴：

   ```bash
   pnpm add ai @ai-sdk/google @ai-sdk/openai @ai-sdk/anthropic
   ```

2. 建立 API route：

   ```typescript
   // app/api/chat/route.ts
   import { streamText } from "ai";
   import { google } from "@ai-sdk/google";

   export async function POST(req: Request) {
     const { messages, model } = await req.json();

     const result = streamText({
       model: google("gemini-2.0-flash"),
       messages,
     });

     return result.toDataStreamResponse();
   }
   ```

3. 建立前端頁面：

   ```typescript
   // app/ai-chat/page.tsx
   "use client";
   import { useChat } from "ai/react";

   export default function ChatPage() {
     const { messages, input, handleInputChange, handleSubmit } = useChat();
     // ...
   }
   ```

**時程**：v1 基礎版預計 3-4 天完成

**相依性**：

- 需要 `GEMINI_API_KEY` 環境變數（已有）
- 可選：`OPENAI_API_KEY`、`ANTHROPIC_API_KEY`

## 驗證

**我們如何確認此決策是正確的？**

- ✅ Streaming response 能正常運作（打字機效果）
- ✅ 多模型切換能順利進行
- ✅ 開發體驗優於直接使用各家 SDK
- ✅ 錯誤處理正常運作
- ✅ 手機/桌面響應式正常

**審查日期**：2026-03-28（3 個月後評估是否需要調整）

## 相關文件

### 參考文件 (Reference)

- [Vercel AI SDK 官方文件](https://sdk.vercel.ai)
- [useChat Hook 文件](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)

### 相關 ADR

- [ADR-001: React Query SSG Pattern](./001-react-query-ssg-pattern.md) - 相關的 React 架構決策

---

## 備註

### 研究與參考資料

- [Vercel AI SDK GitHub](https://github.com/vercel/ai)
- [AI SDK 支援的 Providers](https://sdk.vercel.ai/providers)
- [Streaming 實作範例](https://sdk.vercel.ai/docs/getting-started/nextjs-app-router)

### 討論歷程

- 2025-12-28：經過 AI 前端市場研究後，決定採用 Vercel AI SDK 提升履歷競爭力
