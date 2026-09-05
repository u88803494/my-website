/**
 * Test helpers for the Medium → MDX converter.
 *
 * Fixtures store only the body fragment; this module wraps it in the
 * microformats2 h-entry skeleton that Medium's exporter actually emits, so a
 * fixture stays readable and stays focused on the one structure it exercises.
 */

import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";

interface EntryOptions {
  title?: string;
  subtitle?: string;
  /** Omitted for drafts, which carry no <time class="dt-published">. */
  published?: string;
}

export function mediumEntry(bodyHtml: string, options: EntryOptions = {}): string {
  const { title = "測試標題", subtitle, published = "2020-01-02T03:04:05.678Z" } = options;

  return `<!DOCTYPE html><html><head><title>${title}</title></head><body><article class="h-entry">
<header><h1 class="p-name">${title}</h1></header>
${subtitle === undefined ? "" : `<section data-field="subtitle" class="p-summary">${subtitle}</section>`}
<section data-field="body" class="e-content"><section class="section section--body"><div class="section-content"><div class="section-inner">
${bodyHtml}
</div></div></section></section>
<footer>${
    published
      ? `<p>By <a class="p-author h-card">Test</a> on <a href="https://medium.com/p/abcdef012345"><time class="dt-published" datetime="${published}">x</time></a>.</p>
<p><a href="https://medium.com/@test/post-abcdef012345" class="p-canonical">Canonical link</a></p>`
      : `<p><a href="https://medium.com/p/abcdef012345">View original.</a></p>`
  }</footer>
</article></body></html>`;
}

/** Load a body fragment and hand back both the API and the body element. */
export function loadBody(bodyHtml: string): { $: CheerioAPI; body: Element } {
  const $ = cheerio.load(mediumEntry(bodyHtml));
  const body = $('section[data-field="body"]').first().get(0);
  if (!body) throw new Error("fixture has no body section");
  return { $, body };
}

/** Load an inline fragment, returning its child nodes for convertInline. */
export function loadInline(html: string): { $: CheerioAPI; nodes: ReturnType<CheerioAPI>["prototype"] } {
  const $ = cheerio.load(`<div id="root">${html}</div>`);
  const root = $("#root").get(0);
  if (!root) throw new Error("fixture has no root");
  return { $, nodes: root.children as never };
}
