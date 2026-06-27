import { SOCIAL_LINKS } from "@/constants/socialLinks";
import { type Project } from "@/types/project.types";

export const projects: Project[] = [
  {
    categoryKey: "aiChat.category",
    descriptionKeys: {
      featureKeys: [
        "aiChat.features.0",
        "aiChat.features.1",
        "aiChat.features.2",
        "aiChat.features.3",
        "aiChat.features.4",
      ],
      introKey: "aiChat.intro",
    },
    imageUrl: "/images/projects/ai-chat.png",
    links: [{ isInternal: true, labelKey: "viewProject", url: "/ai-chat" }],
    techStack: ["Next.js 15", "TypeScript", "Vercel AI SDK", "Tailwind CSS", "Streaming UI"],
    titleKey: "aiChat.title",
  },
  {
    categoryKey: "personalSite.category",
    descriptionKeys: {
      featureKeys: [
        "personalSite.features.0",
        "personalSite.features.1",
        "personalSite.features.2",
        "personalSite.features.3",
        "personalSite.features.4",
        "personalSite.features.5",
      ],
      introKey: "personalSite.intro",
    },
    imageUrl: "/images/screenshots/henry-lee-hero-section.png",
    links: [
      { isInternal: true, labelKey: "viewProject", url: "/" },
      {
        labelKey: "readArticle",
        url: "https://medium.com/@hugh-program-learning-diary-js/next-js-ai-一天搞定個人網站-0dddd23f4db3",
      },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "React Query", "DaisyUI", "Shadcn UI", "Google Gemini API"],
    titleKey: "personalSite.title",
  },
  {
    categoryKey: "aiDictionary.category",
    descriptionKeys: {
      featureKeys: [
        "aiDictionary.features.0",
        "aiDictionary.features.1",
        "aiDictionary.features.2",
        "aiDictionary.features.3",
        "aiDictionary.features.4",
      ],
      introKey: "aiDictionary.intro",
    },
    imageUrl: "/images/projects/ai-dictionary.png",
    links: [{ isInternal: true, labelKey: "viewProject", url: "/ai-dictionary" }],
    techStack: ["Next.js", "TypeScript", "Google Gemini API", "React Query", "Tailwind CSS"],
    titleKey: "aiDictionary.title",
  },
  {
    categoryKey: "aiAnalyzer.category",
    descriptionKeys: {
      featureKeys: [
        "aiAnalyzer.features.0",
        "aiAnalyzer.features.1",
        "aiAnalyzer.features.2",
        "aiAnalyzer.features.3",
        "aiAnalyzer.features.4",
      ],
      introKey: "aiAnalyzer.intro",
    },
    imageUrl: "/images/projects/ai-analyzer.png",
    links: [
      { isInternal: true, labelKey: "viewProject", url: "/ai-analyzer" },
      {
        labelKey: "readArticle",
        url: "https://hugh-program-learning-diary-js.medium.com/ai-溝通老是失敗-我花不到三小時-做了一個-ai-的-ai-當解方-880cecf604c4",
      },
    ],
    techStack: ["Next.js", "TypeScript", "Google Gemini API", "Tailwind CSS"],
    titleKey: "aiAnalyzer.title",
  },
  {
    categoryKey: "newDictionary.category",
    descriptionKeys: {
      featureKeys: [
        "newDictionary.features.0",
        "newDictionary.features.1",
        "newDictionary.features.2",
        "newDictionary.features.3",
      ],
      introKey: "newDictionary.intro",
    },
    imageUrl: "/images/projects/new-dictionary.png",
    links: [
      { labelKey: "viewProject", url: "https://dictionary-u88803494.vercel.app/" },
      {
        labelKey: "readArticle",
        url: "https://hugh-program-learning-diary-js.medium.com/%E5%BE%9E%E9%9B%B6%E9%96%8B%E5%A7%8B%E5%BB%BA%E7%AB%8B%E4%B8%80%E5%80%8B%E5%AD%97%E5%85%B8%E7%B6%B2%E7%AB%99-%E5%A4%A7%E7%B6%B1-9ba7f20d5c68",
      },
      {
        labelKey: "readArticle2",
        url: "https://hugh-program-learning-diary-js.medium.com/%E5%BE%9E%E9%9B%B6%E9%96%8B%E5%A7%8B%E5%BB%BA%E7%AB%8B%E4%B8%80%E5%80%8B%E5%AD%97%E5%85%B8%E7%B6%B2%E7%AB%99-%E9%96%8B%E5%A7%8B%E5%89%8D%E6%A7%8B%E6%80%9D-f58b4b8c12b2",
      },
    ],
    techStack: ["Next.js", "TypeScript", "Redux Toolkit", "Thunk", "Tailwind CSS"],
    titleKey: "newDictionary.title",
  },
  {
    categoryKey: "tzuchiShop.category",
    descriptionKeys: {
      featureKeys: ["tzuchiShop.features.0", "tzuchiShop.features.1", "tzuchiShop.features.2", "tzuchiShop.features.3"],
      introKey: "tzuchiShop.intro",
    },
    imageUrl: "/images/projects/tzuchi-shop.png",
    links: [
      { labelKey: "viewProject", url: "https://buddhist-shop.vercel.app/" },
      { labelKey: "viewCode", url: `${SOCIAL_LINKS.GITHUB}/buddhistShop` },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel", "AI Assisted Dev"],
    titleKey: "tzuchiShop.title",
  },
  {
    categoryKey: "reactBlog.category",
    descriptionKeys: {
      featureKeys: [
        "reactBlog.features.0",
        "reactBlog.features.1",
        "reactBlog.features.2",
        "reactBlog.features.3",
        "reactBlog.features.4",
      ],
      introKey: "reactBlog.intro",
    },
    imageUrl: "/images/projects/react-blog.png",
    links: [
      { labelKey: "viewProject", url: "https://u88803494.github.io/react_blog/#/posts" },
      { labelKey: "viewCode", url: `${SOCIAL_LINKS.GITHUB}/react_blog?tab=readme-ov-file#react-spa-blog` },
    ],
    techStack: ["React", "Redux", "Firebase Auth", "Bootstrap"],
    titleKey: "reactBlog.title",
  },
  {
    categoryKey: "arisanWebsite.category",
    descriptionKeys: {
      featureKeys: [
        "arisanWebsite.features.0",
        "arisanWebsite.features.1",
        "arisanWebsite.features.2",
        "arisanWebsite.features.3",
      ],
      introKey: "arisanWebsite.intro",
    },
    imageUrl: "/images/projects/arisan-website.png",
    links: [
      { labelKey: "viewWebsite", url: "https://www.arisan.io/#/clio" },
      {
        labelKey: "readArticle",
        url: "https://hugh-program-learning-diary-js.medium.com/%E8%BD%89%E8%81%B7%E5%85%A8%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%89%E5%80%8B%E6%9C%88%E7%9A%84%E5%BF%83%E5%BE%97-%E6%8F%90%E6%97%A9%E8%84%AB%E9%9B%A2%E8%A8%93%E7%B7%B4%E6%9C%9F-1ce9213d0b26",
      },
    ],
    techStack: ["React", "SCSS (BEM)", "Jest", "Puppeteer"],
    titleKey: "arisanWebsite.title",
  },
];
