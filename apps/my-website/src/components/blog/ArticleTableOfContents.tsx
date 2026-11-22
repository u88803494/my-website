"use client";

import { cn } from "@packages/shared/utils";
import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

const ARTICLE_SELECTOR = "#article-content";
// Distance from the viewport top (slightly below the fixed navbar height): once a
// heading scrolls past this line it's treated as "currently reading this section" and
// stays active until the next heading crosses it too — not just briefly highlighted
// during the crossing moment
const TRIGGER_LINE_PX = 100;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ArticleTableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tickingRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const article = document.querySelector(ARTICLE_SELECTOR);
    if (!article) return;

    const elements = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2, h3"));
    if (elements.length === 0) return;

    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        depth: el.tagName === "H2" ? 2 : 3,
      })),
    );

    let rafId: number | null = null;

    function updateActiveHeading() {
      rafId = null;
      tickingRef.current = false;
      let current: string | null = elements[0]?.id ?? null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= TRIGGER_LINE_PX) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    }

    function handleScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafId = requestAnimationFrame(updateActiveHeading);
    }

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Positions the indicator against the active link's actual offsetTop/offsetHeight.
  // A ratio-based position (activeIndex / headings.length) assumes every entry is
  // the same height and ignores the gap-1 spacing between them — both wrong as
  // soon as a heading's text wraps, and it silently drifts once the list is tall
  // enough to scroll, since percentages resolve against the scroll container's
  // visible height, not its full content height.
  //
  // ResizeObserver rather than a one-shot read on [activeId, headings]: the link
  // can still be at its unstyled 0-height on the very first frame this effect
  // runs (e.g. dev-mode Tailwind JIT hasn't compiled a class combination used
  // for the first time, or web fonts are still loading), and since the effect's
  // dependencies only change when the active heading itself changes, a bad
  // first read would otherwise never get corrected until the reader scrolls
  // past the next heading. The observer's callback re-fires once the browser
  // actually resolves the real size.
  useEffect(() => {
    const link = activeLinkRef.current;
    const indicator = indicatorRef.current;
    if (!link || !indicator) return;

    const sync = () => {
      indicator.style.top = `${link.offsetTop}px`;
      indicator.style.height = `${link.offsetHeight}px`;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(link);
    return () => observer.disconnect();
  }, [activeId, headings]);

  // A long-scrolled article moves the active heading out of the TOC's own
  // (independently scrolling) viewport, leaving it looking like no section is
  // active at all. Reduced motion gets an instant jump instead of a smooth one,
  // matching the same preference respected for the click handler below.
  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "nearest",
    });
  }, [activeId]);

  if (headings.length === 0) return null;

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);

    // A native hash-link click moves the browser's sequential focus position to
    // the target; preventDefault above (needed for the smooth-scroll override)
    // skips that, so a keyboard user who activates a TOC entry ends up back in
    // the TOC on the next Tab press instead of inside the article. tabindex=-1
    // makes an arbitrary element focusable without adding it to the Tab order.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  return (
    <nav aria-label="文章目錄" className="sticky top-24 hidden max-h-[calc(100vh-8rem)] lg:block">
      <div className="border-base-200 relative flex flex-col gap-1 overflow-y-auto border-l pl-4" ref={listRef}>
        {activeId && (
          <span
            aria-hidden="true"
            className="from-primary to-secondary absolute left-[-1px] w-0.5 rounded-full bg-gradient-to-b transition-[top,height] duration-300 ease-out motion-reduce:transition-none"
            ref={indicatorRef}
          />
        )}
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <a
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "truncate py-1 text-sm transition-colors",
                heading.depth === 3 && "pl-3",
                isActive ? "text-primary font-medium" : "text-base-content/50 hover:text-base-content/80",
              )}
              href={`#${heading.id}`}
              key={heading.id}
              onClick={(event) => handleClick(event, heading.id)}
              ref={isActive ? activeLinkRef : undefined}
              title={heading.text}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
