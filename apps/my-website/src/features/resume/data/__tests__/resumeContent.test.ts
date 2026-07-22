import { describe, expect, it } from "vitest";

import { englishResumeContent, traditionalChineseResumeContent } from "../resumeContent";

describe("resume content contracts", () => {
  it("keeps experience facts aligned between languages", () => {
    const english = englishResumeContent.workExperience.experiences;
    const traditionalChinese = traditionalChineseResumeContent.workExperience.experiences;

    expect(english).toHaveLength(traditionalChinese.length);
    expect(english.map(({ logoUrl, period }) => ({ logoUrl, period }))).toEqual(
      traditionalChinese.map(({ logoUrl, period }) => ({ logoUrl, period })),
    );
  });

  it("keeps project facts aligned between languages", () => {
    const english = englishResumeContent.featuredProjects.projects;
    const traditionalChinese = traditionalChineseResumeContent.featuredProjects.projects;

    expect(english).toHaveLength(traditionalChinese.length);
    expect(english.map(({ imageUrl }) => imageUrl)).toEqual(traditionalChinese.map(({ imageUrl }) => imageUrl));
    expect(english.map(({ techStack }) => techStack.length)).toEqual(
      traditionalChinese.map(({ techStack }) => techStack.length),
    );
    expect(english.map((project) => project.links.map(({ type, url }) => ({ type, url })))).toEqual(
      traditionalChinese.map((project) => project.links.map(({ type, url }) => ({ type, url }))),
    );
  });

  it("provides semantic types and localized labels for every project link", () => {
    for (const content of [englishResumeContent, traditionalChineseResumeContent]) {
      for (const project of content.featuredProjects.projects) {
        for (const link of project.links) {
          expect(["article", "live", "source"]).toContain(link.type);
          expect(link.label.trim()).not.toBe("");
          expect(link.url.trim()).not.toBe("");
        }
      }
    }
  });

  it("keeps skill category identities aligned", () => {
    expect(englishResumeContent.skills.categories.map(({ id }) => id)).toEqual(
      traditionalChineseResumeContent.skills.categories.map(({ id }) => id),
    );
  });

  it("uses route-appropriate locales and downloadable resume facts", () => {
    expect(englishResumeContent.locale).toBe("en");
    expect(englishResumeContent.mediumArticles.dateLocale).toBe("en-US");
    expect(traditionalChineseResumeContent.locale).toBe("zh-Hant");
    expect(traditionalChineseResumeContent.mediumArticles.dateLocale).toBe("zh-TW");

    for (const content of [englishResumeContent, traditionalChineseResumeContent]) {
      expect(content.hero.resumeDownload.href).toMatch(/^\/documents\/.*\.pdf$/);
      expect(content.hero.resumeDownload.fileName).toMatch(/\.pdf$/);
    }
  });
});
