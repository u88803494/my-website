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

export function ArticleTableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tickingRef = useRef(false);

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

  if (headings.length === 0) return null;

  const activeIndex = headings.findIndex((heading) => heading.id === activeId);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav aria-label="文章目錄" className="sticky top-24 hidden max-h-[calc(100vh-8rem)] lg:block">
      <div className="border-base-200 relative flex flex-col gap-1 overflow-y-auto border-l pl-4">
        {activeIndex >= 0 && (
          <span
            aria-hidden="true"
            className="from-primary to-secondary absolute left-[-1px] w-0.5 rounded-full bg-gradient-to-b transition-all duration-300 ease-out"
            style={{
              top: `${(activeIndex / headings.length) * 100}%`,
              height: `${(1 / headings.length) * 100}%`,
            }}
          />
        )}
        {headings.map((heading) => (
          <a
            className={cn(
              "truncate py-1 text-sm transition-colors",
              heading.depth === 3 && "pl-3",
              heading.id === activeId ? "text-primary font-medium" : "text-base-content/50 hover:text-base-content/80",
            )}
            href={`#${heading.id}`}
            key={heading.id}
            onClick={(event) => handleClick(event, heading.id)}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
