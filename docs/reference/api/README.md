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

# API Reference

Complete reference for all API endpoints in the my-website application.

## Overview

**Base URL**: `https://henryleelab.com/api`
**Local Development**: `http://localhost:3000/api`

### Authentication

Currently, all APIs are public (no authentication required).

### Rate Limiting

No rate limiting implemented (relies on Vercel's default limits).

---

## Available Endpoints

### AI Features

- [POST /api/define](./define-api.md) - AI word analysis with etymology, definitions, examples
- [POST /api/ai-analyzer](./ai-analyzer-api.md) - General AI analysis for various use cases

### Content

- [GET /api/medium-articles](./medium-articles-api.md) - Fetch cached Medium articles with pagination

---

## Common Response Formats

### Success Response

```typescript
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

### Error Response

```typescript
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                           |
| ---- | --------------------- | ------------------------------- |
| 200  | OK                    | Successful GET/POST             |
| 400  | Bad Request           | Invalid input parameters        |
| 500  | Internal Server Error | Server-side error (API failure) |

---

## Error Handling

All APIs use consistent error format:

```typescript
interface ErrorResponse {
  success: false;
  error: string; // Human-readable error message
  details?: {
    // Optional additional context
    code?: string;
    field?: string;
  };
}
```

### Common Errors

**Missing Required Fields**:

```json
{
  "success": false,
  "error": "Missing required field: word",
  "details": { "field": "word" }
}
```

**API Rate Limit**:

```json
{
  "success": false,
  "error": "Gemini API rate limit exceeded",
  "details": { "code": "RATE_LIMIT" }
}
```

**Server Error**:

```json
{
  "success": false,
  "error": "Internal server error",
  "details": { "code": "INTERNAL_ERROR" }
}
```

---

## Environment Variables

Required for API functionality:

```bash
GEMINI_API_KEY=your_key_here  # Required for AI features
NODE_ENV=development           # Environment mode
```

Get Gemini API key: [https://ai.google.dev/](https://ai.google.dev/)

---

## Testing

### Using curl

```bash
# Test /api/define
curl -X POST http://localhost:3000/api/define \
  -H "Content-Type: application/json" \
  -d '{"word": "serendipity", "type": "etymology"}'

# Test /api/medium-articles
curl http://localhost:3000/api/medium-articles
```

### Using Postman

Import collection: [API Collection](../../../scripts/postman-collection.json) _(future)_

---

## Related Documentation

- [Architecture Reference](../architecture.md) - System architecture
- [Development Setup](../../guides/development-setup.md) - Local setup
- [POST /api/define](./define-api.md) - Word analysis endpoint
- [POST /api/ai-analyzer](./ai-analyzer-api.md) - General AI analysis
- [GET /api/medium-articles](./medium-articles-api.md) - Articles endpoint
