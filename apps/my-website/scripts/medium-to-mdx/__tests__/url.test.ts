import { describe, expect, it } from "vitest";

import { dimensionAttr, isEmbeddableHost, jsxAttr, mdDestination, safeUrl } from "../url";

describe("safeUrl", () => {
  it("accepts http, https, and mailto", () => {
    expect(safeUrl("https://example.com")).toBe("https://example.com");
    expect(safeUrl("http://example.com")).toBe("http://example.com");
    expect(safeUrl("mailto:a@example.com")).toBe("mailto:a@example.com");
  });

  it("rejects javascript: and data: schemes", () => {
    expect(safeUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
  });

  it("rejects malformed URLs and undefined", () => {
    expect(safeUrl("not a url")).toBeUndefined();
    expect(safeUrl(undefined)).toBeUndefined();
  });
});

describe("isEmbeddableHost", () => {
  it("accepts an allow-listed host over https", () => {
    expect(isEmbeddableHost("https://www.youtube.com/embed/abc")).toBe(true);
  });

  it("rejects a non-listed host", () => {
    expect(isEmbeddableHost("https://evil.example.com/embed/abc")).toBe(false);
  });

  it("rejects the same host over http", () => {
    expect(isEmbeddableHost("http://www.youtube.com/embed/abc")).toBe(false);
  });
});

describe("jsxAttr", () => {
  it("escapes characters that would break out of a JSX attribute", () => {
    expect(jsxAttr(`x" onLoad={alert(1)} y="`)).toBe("x&quot; onLoad={alert(1)} y=&quot;");
  });
});

describe("dimensionAttr", () => {
  it("accepts a plain pixel or percentage value", () => {
    expect(dimensionAttr("700", "393")).toBe("700");
    expect(dimensionAttr("100%", "393")).toBe("100%");
  });

  it("falls back for anything else, including an attribute-injection attempt", () => {
    expect(dimensionAttr('" onLoad={alert(1)}', "393")).toBe("393");
    expect(dimensionAttr(undefined, "393")).toBe("393");
  });
});

describe("mdDestination", () => {
  it("returns a clean URL unchanged, so ordinary links produce no diff", () => {
    expect(mdDestination("https://example.com/a/b")).toBe("https://example.com/a/b");
  });

  it("wraps a URL containing whitespace or parentheses in angle brackets", () => {
    expect(mdDestination("https://example.com/a b")).toBe("<https://example.com/a b>");
    expect(mdDestination("https://example.com/p(1)")).toBe("<https://example.com/p(1)>");
  });

  it("percent-encodes angle brackets themselves", () => {
    expect(mdDestination("https://example.com/<script>")).toBe("https://example.com/%3Cscript%3E");
  });
});
