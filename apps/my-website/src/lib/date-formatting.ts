/**
 * Format a date for ISO 8601 (RFC 3339) representation.
 * Used for <time dateTime> attributes and metadata.
 */
export function formatDateISO8601(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString();
}

/**
 * Format a date for display in Traditional Chinese locale.
 * Always uses UTC timezone for consistency across users.
 * Example output: "2024年12月25日"
 */
export function formatDateLocalized(date: Date | string, locale: string = "zh-TW"): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Extract just the date part (YYYY-MM-DD) from ISO date string.
 * Useful for date comparisons and simple display.
 */
export function formatDateSimple(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}
