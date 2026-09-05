/**
 * String helpers shared by the parsing and rendering stages.
 */

/**
 * Normalize non-breaking spaces (U+00A0) and collapse runs of whitespace.
 *
 * Newlines collapse too: inside HTML text they are insignificant whitespace,
 * and a stray one in a title or summary would break the YAML frontmatter.
 * Hard line breaks come from <br>, which is handled separately.
 */
export function normalizeText(text: string): string {
  return text.replace(/\u00A0/g, " ").replace(/\s+/g, " ");
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

/**
 * Move whitespace inside an emphasis span outside the markers.
 *
 * Medium commonly emits "<strong>Change </strong>directory". Trimming and
 * dropping that space produced "**Change **directory" — CommonMark does not
 * read a "**" followed by a space as emphasis at all, so the markers were
 * printed literally instead of rendering bold. Moving the space out yields
 * "**Change** directory", which does.
 */
export function wrapWithPadding(inner: string, marker: string): string {
  const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(inner);
  if (!match) return inner;

  const [, lead, core, trail] = match;
  if (!core) return lead || trail ? " " : "";

  return `${lead}${marker}${core}${marker}${trail}`;
}

/** Truncate to a sensible meta-description length. */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

/**
 * Escape a value for safe embedding in a double-quoted YAML scalar.
 * A literal newline would terminate the scalar and corrupt the frontmatter, so
 * it is folded to a space here as well as upstream in normalizeText.
 */
export function yamlString(value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ").trim();

  return `"${escaped}"`;
}
