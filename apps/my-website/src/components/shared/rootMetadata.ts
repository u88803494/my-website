import type { Metadata } from "next";

// A page that defines its own openGraph object completely overrides this default (Next.js
// metadata merging is object replacement, not a deep merge), so pages without a dedicated
// share image (e.g. blog posts, the blog list) must fall back to this image explicitly —
// it is not inherited automatically
export const DEFAULT_OG_IMAGE_URL = "https://henryleelab.com/images/my-photo.jpeg";

const sharedMetadata: Metadata = {
  authors: [{ name: "Henry Lee", url: "https://henryleelab.com" }],
  creator: "Henry Lee",
  publisher: "Henry Lee",
  robots: "index, follow",
};

export const englishRootMetadata: Metadata = {
  ...sharedMetadata,
  description:
    "Henry Lee's personal website — Senior Software Engineer specializing in Frontend, AI, and Full-Stack Web Development.",
  keywords: [
    "Henry Lee",
    "Senior Software Engineer",
    "Full-Stack Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "AI-native products",
    "portfolio",
  ],
  openGraph: {
    description:
      "Senior Software Engineer Henry Lee's personal website, featuring frontend architecture, AI-native products, and full-stack web development.",
    images: [
      {
        alt: "Portrait of Henry Lee",
        height: 512,
        url: DEFAULT_OG_IMAGE_URL,
        width: 512,
      },
    ],
    title: "Henry Lee - Senior Software Engineer",
    type: "website",
  },
  title: "Henry Lee - Senior Software Engineer",
  twitter: {
    card: "summary",
    description:
      "Senior Software Engineer Henry Lee's personal website, featuring frontend architecture, AI-native products, and full-stack web development.",
    images: [DEFAULT_OG_IMAGE_URL],
    title: "Henry Lee - Senior Software Engineer",
  },
};

export const traditionalChineseRootMetadata: Metadata = {
  ...sharedMetadata,
  description: "Henry Lee 的個人網站，資深軟體工程師，專精 Frontend、AI 與全端 Web 開發。",
  keywords: [
    "Henry Lee",
    "資深軟體工程師",
    "前端工程師",
    "全端工程師",
    "Next.js",
    "React",
    "TypeScript",
    "AI",
    "作品集",
    "技術部落格",
  ],
  openGraph: {
    description:
      "資深軟體工程師 Henry Lee 的個人網站，專精 Frontend、AI 與全端 Web 開發。Senior Software Engineer portfolio, specializing in frontend, AI, and full-stack web development.",
    images: [
      {
        alt: "Henry Lee 頭像 Henry Lee Portrait",
        height: 512,
        url: DEFAULT_OG_IMAGE_URL,
        width: 512,
      },
    ],
    title: "Henry Lee - 資深軟體工程師 | Henry Lee's Personal Website",
    type: "website",
  },
  title: "Henry Lee - 資深軟體工程師",
  twitter: {
    card: "summary",
    description:
      "資深軟體工程師 Henry Lee 的個人網站，專精 Frontend、AI 與全端 Web 開發。Senior Software Engineer portfolio, specializing in frontend, AI, and full-stack web development.",
    images: [DEFAULT_OG_IMAGE_URL],
    title: "Henry Lee - 資深軟體工程師 | Henry Lee's Personal Website",
  },
};
