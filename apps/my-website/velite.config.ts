import { defineConfig, s } from "velite";

export default defineConfig({
  collections: {
    posts: {
      name: "Post",
      pattern: "blog/**/*.mdx",
      schema: s
        .object({
          title: s.string(),
          // 自訂 slug 驗證取代 s.slug()：內建版本的 regex 是 /^[a-z0-9]+(?:-[a-z0-9]+)*$/i，
          // 只接受 ASCII，會讓中文標題的文章全部噴 "Invalid slug"。
          // \p{Letter} 涵蓋 CJK，同時仍排除標點與空白；s.unique 保留跨檔案唯一性檢查。
          slug: s
            .string()
            .min(1)
            .max(200)
            .regex(/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u, "Invalid slug")
            .and(s.unique("posts")),
          description: s.string(),
          subtitle: s.string().optional(),
          date: s.isodate(),
          updatedDate: s.isodate().optional(),
          tags: s.array(s.string()).default([]),
          thumbnail: s.string().optional(),
          draft: s.boolean().default(false),
          mediumUrl: s.string().url().optional(),
          code: s.mdx(),
          raw: s.raw(),
        })
        .transform(({ raw, ...data }) => ({
          ...data,
          readTime: computeReadTime(raw),
        })),
    },
  },
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
  },
});

// 計算閱讀時間：從原始 MDX 文字（非編譯後的 code）估算，中英文分開計算
// 中文約 300 字/分鐘、英文約 200 詞/分鐘（中文字之間沒有空白，不能用切詞方式計算）
function computeReadTime(raw: string): string {
  const plainText = raw
    .replace(/```[\s\S]*?```/g, "") // code fence
    .replace(/`[^`]*`/g, "") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // image
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // link -> keep text
    .replace(/^#{1,6}\s+/gm, "") // heading markers
    .replace(/[*_]{1,3}/g, ""); // emphasis markers

  const cjkMatches = plainText.match(/[一-鿿㐀-䶿]/g);
  const cjkCount = cjkMatches?.length ?? 0;

  const nonCjkText = plainText.replace(/[一-鿿㐀-䶿]/g, " ");
  const latinWordCount = nonCjkText.split(/\s+/).filter(Boolean).length;

  const minutes = Math.ceil(cjkCount / 300 + latinWordCount / 200);
  return `${Math.max(minutes, 1)} min read`;
}
