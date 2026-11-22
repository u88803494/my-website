import type { Options } from "rehype-pretty-code";

// A dark code block deliberately standing out against the light corporate theme is a
// common pattern (Stripe/Tailwind/Vercel docs all do this). The site only has a single
// corporate theme, so a light/dark dual-theme config isn't needed here.
export const rehypePrettyCodeOptions: Options = {
  theme: "github-dark-default",
  keepBackground: true,
  defaultLang: "plaintext",
};
