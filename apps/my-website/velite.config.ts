import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineConfig, s } from "velite";

import { rehypeCopyButton } from "./src/lib/mdx/rehype-copy-button";
import { rehypePrettyCodeOptions } from "./src/lib/mdx/rehype-pretty-code.config";

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
          code: s.mdx({
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, rehypePrettyCodeOptions], rehypeCopyButton, validateMdxCode],
          }),
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

// Validate MDX compiled code: ensure no suspicious patterns that would indicate
// external content source injection or build-time corruption
function validateMdxCode(tree: any) {
  const codeString = JSON.stringify(tree);
  // Reject patterns that shouldn't appear in legitimate MDX output from local files
  const suspiciousPatterns = [
    /import\s+(?!React|jsx-runtime|Fragment)/,
    /export\s+[^;]*(?<!default)/,
    /new\s+Function/,
    /eval\s*\(/,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(codeString)) {
      throw new Error(`MDX code contains prohibited pattern: ${pattern}`);
    }
  }
}

// Compute reading time: estimate from raw MDX text (not compiled code)
// Chinese: ~300 chars/min, English: ~200 words/min
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
