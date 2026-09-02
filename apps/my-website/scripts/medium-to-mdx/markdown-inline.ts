import type { CheerioAPI } from "cheerio";
import type { AnyNode, Element } from "domhandler";

import { escapeMdx, normalizeText } from "./text";

export function isElement(node: AnyNode): node is Element {
  return node.type === "tag";
}

/** Convert inline-level nodes (text, emphasis, links, inline code) to Markdown. */
export function convertInline($: CheerioAPI, nodes: AnyNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return escapeMdx(normalizeText(node.data));
      }

      if (!isElement(node)) return "";

      const inner = convertInline($, node.children ?? []);

      switch (node.tagName) {
        case "a": {
          const href = node.attribs["href"];
          if (!href) return inner;

          // Medium sometimes auto-links text that is already inside a link.
          // Recursing would emit [label]([inner](url)) — a malformed link that
          // Velite then reads as a file path. Fall back to plain text.
          const label = $(node).find("a").length > 0 ? escapeMdx(normalizeText($(node).text())) : inner;

          // A link labelled with its own URL adds nothing, and wrapping it
          // corrupts posts that show markdown syntax as prose: Medium auto-links
          // the URL inside a literal "[text](url)" example, and re-wrapping it
          // yields "[text]([url](url))".
          if (label.trim() === href) return href;

          return `[${label}](${href})`;
        }
        case "b":
        case "strong":
          return inner.trim() ? `**${inner.trim()}**` : "";
        case "br":
          // Markdown hard line break
          return "  \n";
        case "code":
          // Inline code is literal: take raw text, do not escape for MDX
          return `\`${normalizeText($(node).text())}\``;
        case "em":
        case "i":
          return inner.trim() ? `*${inner.trim()}*` : "";
        default:
          return inner;
      }
    })
    .join("");
}
