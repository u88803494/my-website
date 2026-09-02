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
          return href ? `[${inner}](${href})` : inner;
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
