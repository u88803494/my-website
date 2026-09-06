/**
 * URL validation and escaping for values taken from the Medium export.
 *
 * Everything here guards one boundary: the converter writes into
 * content/blog/**, and whatever lands there is compiled by Velite and executed
 * — at build time under next build, and again in the browser during hydration.
 * MDX treats an unescaped quote in a JSX attribute as the end of that
 * attribute, so a crafted src could introduce an expression attribute and run
 * arbitrary code. The current export is clean; these functions keep it that way
 * if the converter is ever pointed at content someone else produced.
 */

/** Schemes that may appear in article links. */
const SAFE_SCHEMES = new Set(["http:", "https:", "mailto:"]);

/** Hosts whose embeds are rendered as an iframe rather than downgraded. */
const EMBEDDABLE_HOSTS = new Set([
  "codepen.io",
  "codesandbox.io",
  "player.vimeo.com",
  "www.youtube-nocookie.com",
  "www.youtube.com",
  "youtube.com",
]);

/** A URL the converter is willing to emit, or undefined if it is not one. */
export function safeUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    return SAFE_SCHEMES.has(url.protocol) ? raw : undefined;
  } catch {
    return undefined;
  }
}

/** Whether an embed from this URL may be rendered as an iframe. */
export function isEmbeddableHost(url: string): boolean {
  try {
    const { host, protocol } = new URL(url);
    return protocol === "https:" && EMBEDDABLE_HOSTS.has(host);
  } catch {
    return false;
  }
}

/**
 * Escape a value for a JSX attribute.
 * A raw quote would close the attribute and let what follows become JSX.
 */
export function jsxAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Accept a plain pixel or percentage dimension, else fall back. */
export function dimensionAttr(value: string | undefined, fallback: string): string {
  return value && /^\d{1,5}(px|%)?$/.test(value) ? value : fallback;
}

/**
 * Render a URL as a Markdown link destination.
 *
 * A destination containing whitespace or parentheses has to use the angle
 * bracket form, or the closing paren ends the link early and the rest of the
 * URL spills into the document as raw text.
 */
export function mdDestination(url: string): string {
  if (/^[^\s<>()]*$/.test(url)) return url;
  if (!/[<>]/.test(url)) return `<${url}>`;

  return encodeURI(url).replace(/[<>]/g, (char) => (char === "<" ? "%3C" : "%3E"));
}
