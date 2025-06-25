export const SOCIAL_LINKS = {
  GITHUB: "https://github.com/u88803494",
  LINKEDIN: "https://www.linkedin.com/in/yu-hao-lee-a6a42179/",
  MEDIUM: "https://medium.com/@hugh-program-learning-diary-js",
  RESUME: "https://www.cake.me/yuhao-lee",
  EMAIL: "yhlscallop@gmail.com",
} as const;

export const CONTACT_LINKS = [
  {
    key: "github",
    href: SOCIAL_LINKS.GITHUB,
    label: "Github",
    tooltip: "Github: 看我的程式碼",
  },
  {
    key: "linkedin",
    href: SOCIAL_LINKS.LINKEDIN,
    label: "Linkedin",
    tooltip: "LinkedIn: 我的職業檔案",
  },
  {
    key: "medium",
    href: SOCIAL_LINKS.MEDIUM,
    label: "Medium",
    tooltip: "Medium: 看我的技術文章",
  },
  {
    key: "resume",
    href: SOCIAL_LINKS.RESUME,
    label: "Resume",
    tooltip: "Resume: 完整履歷與經歷",
  },
  {
    key: "email",
    href: `mailto:${SOCIAL_LINKS.EMAIL}?subject=%E9%97%9C%E6%96%BC%E6%82%A8%E7%9A%84%E4%BD%9C%E5%93%81%E9%9B%86%EF%BC%8C%E6%88%91%E6%83%B3%E8%88%87%E6%82%A8%E8%81%8A%E8%81%8A&body=%E6%82%A8%E5%A5%BD%EF%BC%8CHenry%EF%BC%8C%0A%0A%E6%88%91%E5%9C%A8%E6%82%A8%E7%9A%84%E5%80%8B%E4%BA%BA%E7%B6%B2%E7%AB%99%E4%B8%8A%E7%9C%8B%E5%88%B0%E4%BA%86%E6%82%A8%E7%9A%84%E7%B6%93%E6%AD%B7%EF%BC%8C%E6%83%B3%E8%88%87%E6%82%A8%E9%80%B2%E4%B8%80%E6%AD%A5%E8%A8%8E%E8%AB%96...%0A%0A%E6%9C%9F%E5%BE%85%E6%82%A8%E7%9A%84%E5%9B%9E%E8%A6%86%EF%BC%81`,
    label: "Email",
    tooltip: "Email: 直接聯絡我",
  },
] as const;
