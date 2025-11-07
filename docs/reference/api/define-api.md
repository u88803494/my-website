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

AI-powered word analysis using Google Gemini 2.5 Flash Lite.

## Endpoint

```
POST /api/define
```

## Description

Analyzes a word and returns comprehensive information including etymology, definitions, usage examples, and related words.

## Request

### Headers

```
Content-Type: application/json
```

### Body

```typescript
interface DefineRequest {
  word: string; // The word to analyze
  type: "etymology" | "definition" | "example" | "all"; // Analysis type
}
```

### Example

```bash
curl -X POST https://henryleelab.com/api/define \
  -H "Content-Type: application/json" \
  -d '{
    "word": "serendipity",
    "type": "etymology"
  }'
```

## Response

### Success (200)

```typescript
interface DefineResponse {
  word: string;
  etymology?: string; // Word origin and history
  definition?: string; // Meaning and usage
  examples?: string[]; // Usage examples
  relatedWords?: string[]; // Similar words
}
```

### Example Response

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

### Error (400)

```json
{
  "success": false,
  "error": "Missing required field: word"
}
```

### Error (500)

```json
{
  "success": false,
  "error": "Gemini API error",
  "details": { "code": "API_ERROR" }
}
```

## Implementation

### Location

```
apps/my-website/src/app/api/define/route.ts
```

### Dependencies

- **Gemini API**: Google Generative AI SDK
- **Model**: gemini-2.5-flash-lite
- **Environment**: `GEMINI_API_KEY` required

### Key Features

- Structured prompts for consistent output
- Error handling for API failures
- Type-safe request/response validation

## Rate Limits

- **Gemini Free Tier**: 60 requests per minute
- **No client-side limit**: Relies on Gemini's limits

## Error Codes

| Code         | Description                 | Status |
| ------------ | --------------------------- | ------ |
| MISSING_WORD | Word parameter not provided | 400    |
| API_ERROR    | Gemini API failure          | 500    |
| INVALID_TYPE | Invalid analysis type       | 400    |
| RATE_LIMIT   | Gemini rate limit exceeded  | 429    |
| NO_API_KEY   | Missing GEMINI_API_KEY      | 500    |

## Usage Examples

### Etymology Analysis

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

### Full Analysis

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
// Returns all fields: etymology, definition, examples, relatedWords
```

## React Query Integration

Used in `ai-dictionary` feature:

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

## Related

- [API Overview](./README.md)
- [POST /api/ai-analyzer](./ai-analyzer-api.md)
- [Architecture Reference](../architecture.md)
