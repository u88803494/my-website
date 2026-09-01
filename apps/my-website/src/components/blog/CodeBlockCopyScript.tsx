"use client";

import { useEffect } from "react";

const COPIED_CLASS = "is-copied";
const COPIED_DURATION_MS = 2000;

/**
 * MDX articles are compiled to a static JSX function body at build time
 * (see src/lib/mdx/renderMdx.tsx) — there is no way to attach a per-block
 * client component to each <button data-copy-button> rehype-copy-button.ts
 * inserts. Instead, mount this once on the article page and delegate the
 * click handling globally.
 */
export function CodeBlockCopyScript() {
  useEffect(() => {
    const pendingButtons = new Set<HTMLButtonElement>();

    function handleClick(event: MouseEvent) {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-button]");
      if (!button) return;

      if (pendingButtons.has(button)) return;

      const code = button.closest("figure")?.querySelector("pre")?.textContent;
      if (!code) return;

      pendingButtons.add(button);
      navigator.clipboard
        .writeText(code)
        .then(() => {
          button.classList.add(COPIED_CLASS);
          window.setTimeout(() => {
            button.classList.remove(COPIED_CLASS);
            pendingButtons.delete(button);
          }, COPIED_DURATION_MS);
        })
        .catch(() => {
          pendingButtons.delete(button);
        });
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      pendingButtons.clear();
    };
  }, []);

  return null;
}
