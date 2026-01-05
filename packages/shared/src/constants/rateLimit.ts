/**
 * Rate Limiting Configuration
 * Centralized constants for all rate-limited APIs
 */

export const RATE_LIMIT_CONFIG = {
  chat: {
    limit: 20, // requests per window
    unknownIpLimit: 5, // stricter limit for unidentified IPs
    windowMs: 60 * 1000, // 1 minute
  },
  define: {
    limit: 30,
    windowMs: 60 * 1000,
  },
  aiAnalyzer: {
    limit: 10,
    windowMs: 60 * 1000,
  },
} as const;

export type RateLimitConfigKey = keyof typeof RATE_LIMIT_CONFIG;
