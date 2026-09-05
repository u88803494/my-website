import { describe, expect, it } from "vitest";

import { buildSlugPlan } from "../slug-plan";

const A = "2019-05-10_post-aaaaaaaaaaaa.html";
const B = "2019-05-17_post-bbbbbbbbbbbb.html";
const CANDIDATES = [
  { baseSlug: "同名文章", sourceFile: A },
  { baseSlug: "同名文章", sourceFile: B },
];

describe("buildSlugPlan", () => {
  it("gives the first source file the bare slug and suffixes the rest", () => {
    const plan = buildSlugPlan({ candidates: CANDIDATES });

    expect(plan.bySourceFile.get(A)).toBe("同名文章");
    expect(plan.bySourceFile.get(B)).toBe("同名文章-bbbbbb");
  });

  // The bug this class of change exists to prevent: --only used to shrink the
  // candidate list, so B saw no collision and took A's slug, overwriting a live
  // article. The plan is built from every candidate, so the answer cannot move.
  it("assigns the same slug whichever subset a run converts", () => {
    const full = buildSlugPlan({ candidates: CANDIDATES });
    const reversed = buildSlugPlan({ candidates: [...CANDIDATES].reverse() });

    expect(reversed.bySourceFile.get(A)).toBe(full.bySourceFile.get(A));
    expect(reversed.bySourceFile.get(B)).toBe(full.bySourceFile.get(B));
  });

  it("is stable across repeated builds", () => {
    const first = buildSlugPlan({ candidates: CANDIDATES });
    const second = buildSlugPlan({ candidates: CANDIDATES });

    expect([...second.bySourceFile]).toEqual([...first.bySourceFile]);
  });

  it("disambiguates a third collision without reusing a slug", () => {
    const third = { baseSlug: "同名文章", sourceFile: "2019-06-01_post-cccccccccccc.html" };
    const plan = buildSlugPlan({ candidates: [...CANDIDATES, third] });

    const slugs = [...plan.bySourceFile.values()];
    expect(new Set(slugs).size).toBe(3);
  });

  it("falls back to a filename-derived suffix when there is no Medium id", () => {
    const noId = [
      { baseSlug: "同名文章", sourceFile: "first.html" },
      { baseSlug: "同名文章", sourceFile: "second.html" },
    ];
    const plan = buildSlugPlan({ candidates: noId });
    const again = buildSlugPlan({ candidates: noId });

    expect(plan.bySourceFile.get("second.html")).toMatch(/^同名文章-[0-9a-f]{6}$/);
    expect(again.bySourceFile.get("second.html")).toBe(plan.bySourceFile.get("second.html"));
  });

  it("keeps a published URL on the source file that already owns it", () => {
    const plan = buildSlugPlan({
      candidates: CANDIDATES,
      pinned: new Map([[B, "同名文章"]]),
    });

    expect(plan.bySourceFile.get(B)).toBe("同名文章");
    expect(plan.bySourceFile.get(A)).not.toBe("同名文章");
  });

  it("reports a clash with hand-written MDX instead of silently renaming", () => {
    const plan = buildSlugPlan({
      candidates: [{ baseSlug: "hello-world", sourceFile: A }],
      reserved: new Set(["hello-world"]),
    });

    expect(plan.conflicts).toHaveLength(1);
    expect(plan.bySourceFile.get(A)).not.toBe("hello-world");
  });

  it("assigns every candidate exactly one unique slug", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      baseSlug: i % 3 === 0 ? "重複" : `文章-${i}`,
      sourceFile: `2020-01-01_post-${String(i).padStart(12, "0")}.html`,
    }));
    const plan = buildSlugPlan({ candidates: many });

    expect(plan.bySourceFile.size).toBe(20);
    expect(new Set(plan.bySourceFile.values()).size).toBe(20);
  });
});
