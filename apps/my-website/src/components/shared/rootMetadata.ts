import type { Metadata } from "next";

const sharedMetadata: Metadata = {
  authors: [{ name: "Henry Lee", url: "https://henryleelab.com" }],
  creator: "Henry Lee",
  publisher: "Henry Lee",
  robots: "index, follow",
};

export const englishRootMetadata: Metadata = {
  ...sharedMetadata,
  description:
    "Henry Lee's personal website featuring AI-native frontend products, professional experience, and technical writing.",
  keywords: [
    "Henry Lee",
    "Senior Frontend Engineer",
    "AI Frontend Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "AI-native products",
    "portfolio",
  ],
  openGraph: {
    description:
      "Senior AI Frontend Engineer Henry Lee's personal website, featuring AI-native products, frontend architecture, and technical writing.",
    images: [
      {
        alt: "Portrait of Henry Lee",
        height: 512,
        url: "https://henryleelab.com/images/my-photo.jpeg",
        width: 512,
      },
    ],
    title: "Henry Lee - Senior AI Frontend Engineer",
    type: "website",
  },
  title: "Henry Lee - Senior AI Frontend Engineer",
  twitter: {
    card: "summary",
    description:
      "Senior AI Frontend Engineer Henry Lee's personal website, featuring AI-native products, frontend architecture, and technical writing.",
    images: ["https://henryleelab.com/images/my-photo.jpeg"],
    title: "Henry Lee - Senior AI Frontend Engineer",
  },
};

export const traditionalChineseRootMetadata: Metadata = {
  ...sharedMetadata,
  description: "Henry Lee 的個人網站，展示前端開發專案與技術經驗。專精於 Next.js、React、TypeScript 開發。",
  keywords: ["Henry Lee", "前端工程師", "全端工程師", "Next.js", "React", "TypeScript", "AI", "作品集", "技術部落格"],
  openGraph: {
    description:
      "全端工程師 Henry Lee 的個人網站，專注於 AI、Web、技術分享與作品集。Front-end engineer portfolio, AI, web, and tech sharing.",
    images: [
      {
        alt: "Henry Lee 頭像 Henry Lee Portrait",
        height: 512,
        url: "https://henryleelab.com/images/my-photo.jpeg",
        width: 512,
      },
    ],
    title: "Henry Lee - 前端工程師 | Henry Lee's Personal Website",
    type: "website",
  },
  title: "Henry Lee - 前端工程師",
  twitter: {
    card: "summary",
    description:
      "全端工程師 Henry Lee 的個人網站，專注於 AI、Web、技術分享與作品集。Front-end engineer portfolio, AI, web, and tech sharing.",
    images: ["https://henryleelab.com/images/my-photo.jpeg"],
    title: "Henry Lee - 前端工程師 | Henry Lee's Personal Website",
  },
};
