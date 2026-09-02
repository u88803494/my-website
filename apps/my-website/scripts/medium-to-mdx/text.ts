/**
 * String helpers shared by the parsing and rendering stages.
 */

/** Normalize non-breaking spaces (U+00A0) and collapse redundant whitespace. */
export function normalizeText(text: string): string {
  return text.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ");
}

/**
 * Escape characters that MDX would otherwise parse as JSX syntax.
 * Only applied to prose — never to code, where these characters are literal.
 */
export function escapeMdx(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/[{}]/g, (match) => `\\${match}`)
    .replace(/</g, "&lt;");
}

/**
 * Remove paired emphasis markers.
 * Headings are already emphasised by their level, so Medium's inline <strong>
 * would otherwise produce redundant "## **Title**". Only paired markers are
 * stripped, so a literal asterisk (e.g. "SELECT *") survives.
 */
export function stripEmphasis(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

/**
 * Build a URL slug from the post title.
 * CJK characters are preserved (\p{Letter} matches them); punctuation becomes a
 * dash. Velite's built-in s.slug() rejects these, so velite.config.ts uses a
 * matching custom validator.
 */
export function slugify(title: string): string {
  return title
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** Truncate to a sensible meta-description length. */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

/** Escape a value for safe embedding in a double-quoted YAML scalar. */
export function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
