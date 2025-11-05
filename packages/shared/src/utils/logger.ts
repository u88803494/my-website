import pino from "pino";

/**
 * Shared logger configuration for the monorepo.
 *
 * Features:
 * - Development: Pretty-printed colored output via pino-pretty
 * - Production: Structured JSON logs for machine parsing
 * - Automatic environment detection via NODE_ENV
 * - Support for multiple log levels: debug, info, warn, error
 *
 * @example
 * ```ts
 * import { logger } from "@packages/shared/utils/logger";
 *
 * logger.info({ userId: "123" }, "User logged in");
 * logger.error({ error: err.message }, "Request failed");
 * ```
 */

const isDevelopment = process.env.NODE_ENV !== "production";

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

/**
 * Create a child logger with additional context.
 *
 * @example
 * ```ts
 * const apiLogger = createLogger({ context: "api" });
 * apiLogger.info({ route: "/api/define" }, "Request received");
 * ```
 */
export function createLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}

/**
 * Log request metadata for API routes.
 *
 * @example
 * ```ts
 * logRequest("/api/define", "POST", { userId: "123" });
 * ```
 */
export function logRequest(
  route: string,
  method: string,
  metadata?: Record<string, unknown>,
) {
  logger.info({ route, method, ...metadata }, "API request received");
}

/**
 * Log error with stack trace and context.
 *
 * @example
 * ```ts
 * try {
 *   // ... some code
 * } catch (error) {
 *   logError("Failed to process request", error, { userId: "123" });
 * }
 * ```
 */
export function logError(
  message: string,
  error: unknown,
  context?: Record<string, unknown>,
) {
  const errorDetails = error instanceof Error
    ? { message: error.message, stack: error.stack, name: error.name }
    : { error: String(error) };

  logger.error({ ...errorDetails, ...context }, message);
}
