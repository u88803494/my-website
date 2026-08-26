import { defineConfig, s } from "velite";

export default defineConfig({
  collections: {
    posts: {
      name: "Post",
      pattern: "blog/**/*.mdx",
      schema: s
        .object({
          title: s.string(),
          slug: s.slug("posts"),
          description: s.string(),
          subtitle: s.string().optional(),
          date: s.isodate(),
          updatedDate: s.isodate().optional(),
          tags: s.array(s.string()).default([]),
          thumbnail: s.string().optional(),
          draft: s.boolean().default(false),
          mediumUrl: s.string().url().optional(),
          code: s.mdx(),
        })
        .transform((data) => ({
          ...data,
          readTime: computeReadTime(data.code),
        })),
    },
  },
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
  },
});

// 計算閱讀時間（約 200 字/分鐘）
function computeReadTime(mdxCode: string): string {
  const text = mdxCode.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}
