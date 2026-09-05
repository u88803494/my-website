"use client";

import { useEffect, useRef } from "react";

const COPIED_CLASS = "is-copied";
const COPIED_DURATION_MS = 2000;
const IDLE_LABEL = "複製程式碼";
const COPIED_LABEL = "已複製到剪貼簿";

/**
 * MDX articles are compiled to a static JSX function body at build time
 * (see src/lib/mdx/renderMdx.tsx) — there is no way to attach a per-block
 * client component to each <button data-copy-button> rehype-copy-button.ts
 * inserts. Instead, mount this once on the article page and delegate the
 * click handling globally.
 */
export function CodeBlockCopyScript() {
  const statusRef = useRef<HTMLDivElement>(null);

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
          // The visible "複製"/"已複製" swap is CSS-only (::after content, see
          // globals.css) and screen readers do not read pseudo-element content
          // at all. aria-label additionally overrides it entirely when present,
          // which announces the change only if the button itself is focused —
          // Safari does not move keyboard focus to a <button> on a plain
          // click, so a mouse-click copy there changes the label on an
          // unfocused element and VoiceOver announces nothing. The aria-live
          // region below announces regardless of what currently has focus.
          button.setAttribute("aria-label", COPIED_LABEL);
          if (statusRef.current) statusRef.current.textContent = COPIED_LABEL;
          window.setTimeout(() => {
            button.classList.remove(COPIED_CLASS);
            button.setAttribute("aria-label", IDLE_LABEL);
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

  return <div ref={statusRef} role="status" aria-live="polite" className="sr-only" />;
}
