import type { CheerioAPI } from "cheerio";
import type { AnyNode, Element } from "domhandler";

import { convertInline, isElement } from "./markdown-inline";
import { escapeMdx, normalizeText, stripEmphasis } from "./text";
import type { BodyContext } from "./types";

/** Elements that produce a Markdown block; anything else is descended into. */
const BLOCK_TAGS = new Set(["blockquote", "figure", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul", "p", "pre"]);

/**
 * Convert a <pre> code block.
 * Medium stores line breaks inside <pre> as <br> tags rather than newline
 * characters, so they must be restored before reading the text content —
 * otherwise every line collapses into one.
 */
export function convertPre($: CheerioAPI, element: Element): string {
  const clone = $(element).clone();
  clone.find("br").replaceWith("\n");

  const code = clone
    .text()
    .replace(/\u00A0/g, " ")
    .replace(/\n+$/, "");

  // An empty <pre> would otherwise emit an empty fence, which swallows the
  // following block into it.
  if (!code.trim()) return "";

  // Some posts contain literal ``` inside the code (markdown typed into
  // Medium's code block). The fence must be longer than the longest run of
  // backticks it contains, or it closes early and the rest leaks into prose.
  const longestRun = Math.max(0, ...[...code.matchAll(/`+/g)].map((match) => match[0].length));
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  const lang = element.attribs["data-code-block-lang"] ?? "";

  return `${fence}${lang}\n${code}\n${fence}`;
}

/** Convert a <figure>: image, GitHub Gist embed, or iframe embed. */
export function convertFigure($: CheerioAPI, element: Element): string {
  const figure = $(element);

  // GitHub Gist embeds rely on document.write() and silently fail in React,
  // so they are downgraded to a plain link.
  const gistScript = figure.find('script[src*="gist.github.com"]').attr("src");
  if (gistScript) {
    return `[📄 在 GitHub Gist 查看完整程式碼](${gistScript.replace(/\.js$/, "")})`;
  }

  // Real iframes (YouTube) are kept as-is — MDX renders inline HTML.
  const iframe = figure.find("iframe").first();
  const iframeSrc = iframe.attr("src");
  if (iframeSrc) {
    const width = iframe.attr("width") ?? "700";
    const height = iframe.attr("height") ?? "393";
    return `<iframe src="${iframeSrc}" width="${width}" height="${height}" frameBorder="0" allowFullScreen></iframe>`;
  }

  const src = figure.find("img").first().attr("src");
  if (!src) return "";

  // Images keep their Medium CDN URL; self-hosting is tracked separately.
  const caption = normalizeText(figure.find("figcaption").text()).trim();
  const image = `![${escapeMdx(caption)}](${src})`;
  return caption ? `${image}\n\n*${escapeMdx(caption)}*` : image;
}

/** Convert <ul>/<ol>, recursing into nested lists with proper indentation. */
export function convertList($: CheerioAPI, element: Element, depth: number): string {
  const ordered = element.tagName === "ol";
  const indent = "  ".repeat(depth);

  return $(element)
    .children("li")
    .toArray()
    .map((li, index) => {
      const marker = ordered ? `${index + 1}.` : "-";

      // Split direct nested lists from the item's own inline content
      const nested = $(li).children("ul, ol").toArray();
      const ownNodes = (li.children ?? []).filter(
        (child) => !(isElement(child) && (child.tagName === "ul" || child.tagName === "ol")),
      );

      const head = `${indent}${marker} ${convertInline($, ownNodes).trim()}`;
      const nestedText = nested.map((list) => convertList($, list, depth + 1)).join("\n");

      return nestedText ? `${head}\n${nestedText}` : head;
    })
    .join("\n");
}

/** Convert a blockquote, prefixing every line with "> ". */
export function convertBlockquote($: CheerioAPI, element: Element): string {
  return convertInline($, element.children ?? [])
    .trim()
    .split("\n")
    .map((line) => `> ${line.trim()}`)
    .join("\n");
}

/**
 * Neutralize a paragraph that starts with `import` or `export`.
 *
 * MDX parses those at the start of a line as ESM statements and fails on prose
 * like "export function add(a, b)". Replacing the first character with its HTML
 * entity renders identically while no longer matching the ESM grammar.
 */
function escapeEsmKeyword(text: string): string {
  if (!/^(import|export)\b/.test(text)) return text;
  return `&#${text.charCodeAt(0)};${text.slice(1)}`;
}

/**
 * Escape a leading # or > so the paragraph stays a paragraph.
 *
 * Medium has real headings and blockquotes, so a paragraph *starting* with
 * these characters is literal text — typically a post explaining Markdown
 * syntax. List markers (- and 1.) are deliberately not escaped: authors often
 * typed lists as plain paragraphs, and letting Markdown parse them restores the
 * list semantics they meant.
 */
function escapeLeadingBlockMarker(text: string): string {
  return text.replace(/^([#>])/, "\\$1");
}

/**
 * Medium's exporter brackets every section with a divider <hr>. It is layout,
 * not authored content.
 */
function isStructuralNode(node: Element): boolean {
  return node.tagName === "hr" || (node.attribs["class"] ?? "").includes("section-divider");
}

/**
 * Convert an h1-h3 heading, dropping the one that merely repeats the post title
 * (the exporter emits it as graf--title at the top of the body).
 */
function convertMajorHeading($: CheerioAPI, node: Element, context: BodyContext): string | null {
  const text = stripEmphasis(convertInline($, node.children ?? []).trim());
  if (!text) return null;

  const isRepeatedTitle = (node.attribs["class"] ?? "").includes("graf--title") || text === context.title;
  if (!context.titleHeadingSkipped && isRepeatedTitle) {
    context.titleHeadingSkipped = true;
    return null;
  }

  return `## ${text}`;
}

/** Convert one block-level element; null means "produces no output". */
function convertBlockElement($: CheerioAPI, node: Element, context: BodyContext): string | null {
  switch (node.tagName) {
    case "blockquote":
      return convertBlockquote($, node) || null;
    case "figure":
      return convertFigure($, node) || null;
    case "h1":
    case "h2":
    case "h3":
      return convertMajorHeading($, node, context);
    case "h4":
    case "h5":
    case "h6": {
      const text = stripEmphasis(convertInline($, node.children ?? []).trim());
      return text ? `### ${text}` : null;
    }
    case "ol":
    case "ul":
      return convertList($, node, 0) || null;
    case "p": {
      if ((node.attribs["class"] ?? "").includes("graf--empty")) return null;
      const text = convertInline($, node.children ?? []).trim();
      return text ? escapeLeadingBlockMarker(escapeEsmKeyword(text)) : null;
    }
    case "pre":
      return convertPre($, node);
    default:
      return null;
  }
}

/** Walk the article body and emit Markdown blocks. */
export function convertBody($: CheerioAPI, bodyElement: Element, title: string): string {
  const blocks: string[] = [];
  const context: BodyContext = { title, titleHeadingSkipped: false };

  const walk = (nodes: AnyNode[]): void => {
    for (const node of nodes) {
      if (!isElement(node) || isStructuralNode(node)) continue;

      // Non-block elements (section, div, ...) are wrappers — descend into them
      if (!BLOCK_TAGS.has(node.tagName)) {
        walk(node.children ?? []);
        continue;
      }

      const block = convertBlockElement($, node, context);
      if (block?.trim()) blocks.push(block);
    }
  };

  walk(bodyElement.children ?? []);

  return blocks
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
