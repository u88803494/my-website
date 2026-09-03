import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Inserts a static, inert <button data-copy-button> into every code block
 * produced by rehype-pretty-code (identified by the
 * `data-rehype-pretty-code-figure` attribute it adds to the wrapping
 * <figure>). No inline event handlers — click handling is wired up by a
 * single global event-delegation client component (CodeBlockCopyScript)
 * mounted once on the article page, since MDX output here is compiled to
 * a static JSX function body at build time and can't host a client
 * component per code block.
 */
export function rehypeCopyButton() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "figure" || !("data-rehype-pretty-code-figure" in node.properties)) {
        return;
      }

      // No text child node: the visible "Copy"/"Copied" text is entirely driven by
      // the CSS ::after content, toggled via the .is-copied class (see globals.css),
      // since this output is static HTML with no React state to swap the text with
      node.children.push({
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          "data-copy-button": "",
          "aria-label": "複製程式碼",
        },
        children: [],
      });
    });
  };
}
