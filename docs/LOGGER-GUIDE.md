# 📋 Structured Logging Guide

Complete guide for using the structured logging system in this project.

## 🎯 Overview

This project uses **Pino** + **next-logger** for structured logging, providing:

- **Development**: Pretty-printed colored output for easy debugging
- **Production**: JSON-formatted logs for machine parsing and analysis
- **Automatic environment detection** via `NODE_ENV`
- **Multiple log levels**: debug, info, warn, error

## 📦 Technology Stack

- **[Pino](https://getpino.io/)** - Fast, low-overhead Node.js logger
- **[pino-pretty](https://github.com/pinojs/pino-pretty)** - Pretty-print pino logs
- **[next-logger](https://www.npmjs.com/package/next-logger)** - Next.js logging interceptor

## 🚀 Quick Start

### Basic Usage

```typescript
import { logger } from "@packages/shared/utils/logger";

// Simple logging
logger.info("Server started successfully");
logger.warn("API rate limit approaching");
logger.error("Failed to process request");

// Structured logging with metadata
logger.info({ userId: "123", action: "login" }, "User logged in");
logger.error({ error: err.message, route: "/api/define" }, "Request failed");
```

### API Route Usage

```typescript
import { createLogger, logError } from "@packages/shared/utils/logger";

// Create context-specific logger
const logger = createLogger({ context: "api/define" });

export async function POST(request: NextRequest) {
  try {
    logger.info({ word }, "Word analysis request received");

    const result = await analyzeWord(word, apiKey);

    logger.info({ word, success: true }, "Analysis completed");
    return NextResponse.json(result);
  } catch (error) {
    logError("Word analysis failed", error, { route: "/api/define" });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
```

## 🛠️ API Reference

### Core Functions

#### `logger`

The main logger instance with all standard pino methods.

```typescript
logger.debug("Debug message");
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message");
```

#### `createLogger(bindings)`

Create a child logger with additional context.

**Parameters:**

- `bindings` - Object containing context metadata

**Returns:** Child logger instance

**Example:**

```typescript
const apiLogger = createLogger({ context: "api/medium-articles" });
apiLogger.info({ cursor, limit }, "Fetching articles");
```

#### `logRequest(route, method, metadata?)`

Log API request information in a structured format.

**Parameters:**

- `route` - API route path (e.g., "/api/define")
- `method` - HTTP method (e.g., "POST", "GET")
- `metadata` - Optional additional context

**Example:**

```typescript
logRequest("/api/define", "POST", { userId: "123" });
```

#### `logError(message, error, context?)`

Log errors with full stack traces and context.

**Parameters:**

- `message` - Human-readable error description
- `error` - Error object or unknown error
- `context` - Optional additional context

**Example:**

```typescript
try {
  await dangerousOperation();
} catch (error) {
  logError("Operation failed", error, { operationId: "123" });
}
```

## 📊 Log Output Examples

### Development Environment

Pretty-printed colored output with timestamps:

```
[2025-11-04 15:30:00] INFO  (12345): Word analysis request received
    context: "api/define"
    word: "hello"

[2025-11-04 15:30:01] INFO  (12345): Analysis completed
    context: "api/define"
    word: "hello"
    success: true
```

### Production Environment

JSON-formatted structured logs:

```json
{
  "level": "info",
  "time": "2025-11-04T15:30:00.000Z",
  "pid": 12345,
  "hostname": "server-1",
  "context": "api/define",
  "word": "hello",
  "msg": "Word analysis request received"
}

{
  "level": "info",
  "time": "2025-11-04T15:30:01.000Z",
  "pid": 12345,
  "hostname": "server-1",
  "context": "api/define",
  "word": "hello",
  "success": true,
  "msg": "Analysis completed"
}
```

## ✅ Best Practices

### 1. Use Structured Metadata

**Good:**

```typescript
logger.info({ userId: "123", action: "purchase", amount: 99.99 }, "Purchase completed");
```

**Bad:**

```typescript
logger.info(`User 123 completed purchase of $99.99`); // String interpolation loses structure
```

### 2. Create Context-Specific Loggers

**Good:**

```typescript
const logger = createLogger({ context: "api/define" });
logger.info({ word }, "Processing request");
```

**Bad:**

```typescript
import { logger } from "@packages/shared/utils/logger";
logger.info({ word, context: "api/define" }, "Processing request"); // Redundant context
```

### 3. Always Log Errors with Context

**Good:**

```typescript
logError("Payment processing failed", error, {
  userId: "123",
  amount: 99.99,
  paymentMethod: "credit_card",
});
```

**Bad:**

```typescript
logger.error("Error:", error); // Minimal context, hard to debug
```

### 4. Use Appropriate Log Levels

- **debug**: Detailed diagnostic information (disabled in production)
- **info**: General informational messages (normal operation)
- **warn**: Warning messages (potential issues)
- **error**: Error messages (requires attention)

### 5. Don't Log Sensitive Data

**Never log:**

- Passwords
- API keys
- Authentication tokens
- Credit card numbers
- Personal identification numbers (PII)

**Good:**

```typescript
logger.info({ userId: "123" }, "User authenticated");
```

**Bad:**

```typescript
logger.info({ userId: "123", password: "secret123" }, "User authenticated"); // ❌ Never do this!
```

## 🔧 Configuration

### Environment Variables

Control logging behavior with environment variables:

```bash
# Log level (default: "debug" in dev, "info" in prod)
LOG_LEVEL=debug

# Node environment
NODE_ENV=development  # Pretty-printed output
NODE_ENV=production   # JSON output
```

### Custom Configuration

The logger is configured in `packages/shared/src/utils/logger.ts`:

```typescript
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
```

## 📚 Integration Points

### Next.js Instrumentation

Logger initialization happens in `apps/my-website/instrumentation.ts`:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@packages/shared/utils/logger");
    await import("next-logger");
    logger.info("Logger system initialized");
  }
}
```

### Next.js Configuration

Required configuration in `apps/my-website/next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true, // Enable instrumentation
  },
  serverExternalPackages: ["pino", "pino-pretty"], // Prevent bundling
};
```

## 🐛 Debugging

### Enable Debug Logs

```bash
# Development
LOG_LEVEL=debug pnpm dev

# Production
LOG_LEVEL=debug pnpm start
```

### View Production Logs

Production logs are JSON-formatted for easy parsing:

```bash
# Filter by log level
cat logs.json | grep '"level":"error"'

# Filter by context
cat logs.json | grep '"context":"api/define"'

# Pretty print with jq
cat logs.json | jq 'select(.level == "error")'
```

## 🔗 Resources

- [Pino Documentation](https://getpino.io/)
- [pino-pretty Documentation](https://github.com/pinojs/pino-pretty)
- [next-logger Documentation](https://www.npmjs.com/package/next-logger)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)

## 📝 Migration Guide

### From console.log to logger

**Before:**

```typescript
console.log("User logged in", userId);
console.error("Error:", error);
```

**After:**

```typescript
logger.info({ userId }, "User logged in");
logError("Operation failed", error, { userId });
```

### From console.error to logError

**Before:**

```typescript
try {
  await operation();
} catch (error) {
  console.error("Operation failed:", error);
}
```

**After:**

```typescript
try {
  await operation();
} catch (error) {
  logError("Operation failed", error, { operationId: "123" });
}
```

---

**Last Updated**: 2025-11-04
