/**
 * Golden tests: run real Medium export HTML through the full parsePost()
 * pipeline and compare the resulting Markdown body against an approved
 * snapshot.
 *
 * corpus.test.ts only re-checks output already committed to content/blog —
 * it can catch a *known* defect shape recurring, but it never re-runs the
 * converter, so it cannot catch a brand-new kind of regression (e.g. broken
 * nested-list indentation, a dropped heading level, mangled inline code).
 * These fixtures are real (not synthetic) exports, each chosen to exercise
 * one feature the unit tests test in isolation but not in combination with
 * everything else a real post also contains: a nested list, a GitHub Gist
 * embed, an iframe embed, a blockquote whose text has a <br> hard break, and
 * a <pre> block whose code contains a literal backtick run.
 */
import * as path from "path";
import { describe, expect, it } from "vitest";

import { parsePost } from "../parse";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

const FIXTURES = [
  "nested-list.html",
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
