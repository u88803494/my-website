/**
 * Next.js Instrumentation Hook
 *
 * This file is automatically executed by Next.js when the server starts.
 * Used to initialize the structured logging system with next-logger.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@packages/shared/utils/logger");

    // Initialize next-logger to intercept Next.js console logs
    await import("next-logger");

    logger.info("Logger system initialized");
  }
}
