/**
 * Golden tests: run real Medium export HTML through the full parsePost()
 * pipeline and compare the resulting Markdown body against an approved
 * snapshot.
 *
 * corpus.test.ts only re-checks output already committed to content/blog —
 * it can catch a *known* defect shape recurring, but it never re-runs the
 * converter, so it cannot catch a brand-new kind of regression (e.g. a
 * dropped heading level, mangled inline code, a broken fence). These
 * fixtures are real (not synthetic) exports, each independently verified
 * (via cheerio, the same parser the converter uses — not just a text grep)
 * to actually contain the structure its filename claims, so it exercises
 * that feature in combination with everything else a real post also
 * contains, not just in the isolated unit-test fixtures in
 * markdown-blocks.test.ts / markdown-inline.test.ts:
 * - ordered-list.html: a real <ol> with multiple <li> items
 * - gist-embed.html: a real GitHub Gist embed, downgraded to a link
 * - iframe-embed.html: a real <iframe> embed (YouTube)
 * - blockquote-hard-break.html: a real <blockquote> whose text contains a
 *   <br> hard break
 * - backtick-in-code.html: a real <pre> block whose *code content* (not
 *   prose describing code) contains a literal backtick, forcing
 *   convertPre's fence-lengthening to actually fire
 *
 * A genuine nested list (an <li> directly containing a <ul>/<ol>) does not
 * exist anywhere in the 259-file source export — checked with the same
 * cheerio-based query used to verify the fixtures above, not just assumed.
 * Medium's editor doesn't appear to ever produce that HTML shape, so there
 * is no real fixture to add for it; ordered-list.html covers the list
 * feature this corpus actually exercises for real.
 */
import * as path from "path";
import { describe, expect, it } from "vitest";

import { parsePost } from "../parse";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

const FIXTURES = [
  "ordered-list.html",
  "gist-embed.html",
  "iframe-embed.html",
  "blockquote-hard-break.html",
  "backtick-in-code.html",
];

describe("golden: real Medium export → Markdown body", () => {
  it.each(FIXTURES)("%s", async (fixture) => {
    const post = await parsePost(path.join(FIXTURES_DIR, fixture));
    await expect(post.body).toMatchFileSnapshot(`__snapshots__/golden/${fixture.replace(/\.html$/, ".md")}`);
  });
});
