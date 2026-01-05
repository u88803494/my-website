/**
 * In-Memory Rate Limiting Utility
 *
 * Simple rate limiter using in-memory Map storage.
 * Suitable for single-instance deployments.
 * For production with multiple instances, consider Upstash Redis.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
const MAX_MAP_SIZE = 10000; // Maximum entries to prevent memory exhaustion
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
  lastCleanup = now;
}

// Evict oldest entries when map exceeds size limit
function evictOldestEntries(): void {
  if (rateLimitMap.size <= MAX_MAP_SIZE) return;

  // Sort by resetTime and remove oldest entries
  const entries = Array.from(rateLimitMap.entries()).sort((a, b) => a[1].resetTime - b[1].resetTime);

  // Remove 10% of oldest entries
  const toRemove = Math.ceil(rateLimitMap.size * 0.1);
  for (let i = 0; i < toRemove && i < entries.length; i++) {
    const entry = entries[i];
    if (entry) {
      rateLimitMap.delete(entry[0]);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param limit - Maximum requests allowed in the window (default: 20)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Result object with success status, remaining requests, and reset time
 */
export function checkRateLimit(identifier: string, limit: number = 20, windowMs: number = 60000): RateLimitResult {
  cleanupExpiredEntries();
  evictOldestEntries();

  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // First request or window expired
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  // Within window, check limit
  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

// =============================================================================
// IP Address Utilities
// =============================================================================

/**
 * Validate IP address format to prevent header spoofing attacks
 * Accepts IPv4 and IPv6 formats
 */
function isValidIP(ip: string): boolean {
  // Max length check (IPv6 max is 45 chars)
  if (!ip || ip.length > 45) return false;

  // Only allow valid IP characters (digits, dots, colons, hex letters)
  if (!/^[\da-fA-F.:]+$/.test(ip)) return false;

  // Basic IPv4 pattern check
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(ip)) {
    // Validate each octet is 0-255
    const octets = ip.split(".");
    return octets.every((octet) => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }

  // Basic IPv6 pattern check (simplified)
  const ipv6Pattern = /^[\da-fA-F:]+$/;
  return ipv6Pattern.test(ip) && ip.includes(":");
}

/**
 * Get client IP from request headers
 * Prioritizes trusted platform headers over potentially spoofable ones
 *
 * Priority order:
 * 1. x-real-ip (Vercel - trusted, set by platform)
 * 2. cf-connecting-ip (Cloudflare - trusted, set by platform)
 * 3. x-forwarded-for (can be spoofed if not behind trusted proxy)
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;

  // Priority 1: Vercel's trusted header (cannot be spoofed)
  const xRealIP = headers.get("x-real-ip");
  if (xRealIP && isValidIP(xRealIP)) {
    return xRealIP;
  }

  // Priority 2: Cloudflare's trusted header (cannot be spoofed)
  const cfConnectingIP = headers.get("cf-connecting-ip");
  if (cfConnectingIP && isValidIP(cfConnectingIP)) {
    return cfConnectingIP;
  }

  // Priority 3: x-forwarded-for (potentially spoofable, use with caution)
  // When behind Vercel/Cloudflare, this is usually safe as they overwrite it
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIP = xForwardedFor.split(",")[0]?.trim();
    if (firstIP && isValidIP(firstIP)) {
      return firstIP;
    }
  }

  // Fallback for unknown IPs (stricter rate limit applied separately if needed)
  return "unknown";
}
