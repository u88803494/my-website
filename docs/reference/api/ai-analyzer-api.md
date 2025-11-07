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

General-purpose AI analysis using Google Gemini 2.5 Flash Lite.

## Endpoint

```
POST /api/ai-analyzer
```

## Description

Flexible AI analysis endpoint that accepts custom analysis needs and prompts.

## Request

### Headers

```
Content-Type: application/json
```

### Body

```typescript
interface AIAnalyzerRequest {
  need: string; // What kind of analysis is needed
  prompt: string; // The content or question to analyze
}
```

### Example

```bash
curl -X POST https://henryleelab.com/api/ai-analyzer \
  -H "Content-Type: application/json" \
  -d '{
    "need": "code review",
    "prompt": "function add(a, b) { return a + b; }"
  }'
```

## Response

### Success (200)

```typescript
interface AIAnalyzerResponse {
  analysis: string; // AI-generated analysis result
}
```

### Example Response

```json
{
  "analysis": "This function implements simple addition. Consider adding type annotations and input validation for production use..."
}
```

### Error (400)

```json
{
  "success": false,
  "error": "Missing required fields: need or prompt"
}
```

### Error (500)

```json
{
  "success": false,
  "error": "Gemini API error"
}
```

## Implementation

### Location

```
apps/my-website/src/app/api/ai-analyzer/route.ts
```

### Dependencies

- **Gemini API**: Google Generative AI SDK
- **Model**: gemini-2.5-flash-lite
- **Environment**: `GEMINI_API_KEY` required

### Prompt Structure

```typescript
const systemPrompt = `You are an expert ${need} assistant.`;
const userPrompt = prompt;
```

## Use Cases

### Code Review

```javascript
fetch("/api/ai-analyzer", {
  method: "POST",
  body: JSON.stringify({
    need: "code review",
    prompt: "function calculate() { ... }",
  }),
});
```

### Content Analysis

```javascript
fetch("/api/ai-analyzer", {
  method: "POST",
  body: JSON.stringify({
    need: "content analysis",
    prompt: "This article discusses...",
  }),
});
```

### General Questions

```javascript
fetch("/api/ai-analyzer", {
  method: "POST",
  body: JSON.stringify({
    need: "technical explanation",
    prompt: "Explain how React hooks work",
  }),
});
```

## Rate Limits

- **Gemini Free Tier**: 60 requests per minute
- Same limits as `/api/define`

## Error Codes

| Code           | Description            | Status |
| -------------- | ---------------------- | ------ |
| MISSING_FIELDS | need or prompt missing | 400    |
| API_ERROR      | Gemini API failure     | 500    |
| RATE_LIMIT     | Rate limit exceeded    | 429    |
| NO_API_KEY     | Missing API key        | 500    |

## React Query Integration

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

## Related

- [API Overview](./README.md)
- [POST /api/define](./define-api.md)
- [Architecture Reference](../architecture.md)
