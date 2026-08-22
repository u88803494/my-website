import { experiences as traditionalChineseExperiences } from "@/data/experienceData";
import { projects as traditionalChineseProjects } from "@/data/projectData";
import { skillData } from "@/data/skillData";

import type { ResumeContent } from "../types/resumeContent.types";

export const traditionalChineseResumeContent: ResumeContent = {
  contact: {
    availability: {
      responseLabel: "回覆時間：",
      responseValue: "通常在24小時內回覆郵件",
      rolesLabel: "尋找職位：",
      rolesValue: "前端工程師、全端工程師（遠端或現場皆可）",
      skillsLabel: "技能專長：",
      skillsValue: "React、Next.js、TypeScript、前端開發",
    },
    copiedLabel: "已複製",
    copyLabel: "複製",
    description: "如果您對我的經歷感興趣，或者有任何工作機會，歡迎與我聊聊！我正在尋找遠端工作或全職職位。",
    emailDescription: "最佳的聯絡方式，我通常會在24小時內回覆",
    emailHeading: "Email",
    heading: "讓我們一起工作",
    platformDescriptions: ["GitHub - 程式碼", "LinkedIn - 履歷", "Medium - 文章", "Email - 直接聯絡"],
    platformsDescription: "也可以透過以下平台了解更多關於我的資訊",
    platformsHeading: "其他平台",
  },
  contactLinkLocale: "zh-Hant",
  education: {
    description: "我的學習歷程與背景",
    heading: "學歷與進修",
    items: [
      { description: "學員", highlight: true, period: "Apr 2019 ~ Dec 2019", title: "程式導師實驗計畫第三期" },
      { description: "學士學位，化學與材料工程學系", highlight: false, period: "2009 ~ 2011", title: "明新科技大學" },
      { description: "副學士學位，化學工程", highlight: false, period: "2007 ~ 2009", title: "義守大學" },
    ],
  },
  featuredProjects: {
    collapseLabel: "收合",
    description: "探索我的技術旅程，從學習階段到專業開發的完整作品集",
    developmentOnlyLabel: "[僅開發模式]",
    heading: "精選專案 Featured Projects",
    projects: traditionalChineseProjects,
    showMoreLabel: "看更多專案",
    techStackLabel: "技術棧",
  },
  hero: {
    greeting: "Hi, I'm ",
    imageAlt: "Henry Lee's photo",
    name: "Henry Lee",
    paragraphs: [
      "Senior Software Engineer，專注於 Next.js 16 與生成式 AI 應用整合開發，具備獨立打造完整產品的全端開發能力。",
      "建立基於 Claude Code 的文件驅動開發流程，達成每日交付 1-2 個生產就緒功能的目標。",
      "獨立開發多個 AI 應用，包括 AI Chat、AI Dictionary、AI Analyzer 等，展現完整的產品開發能力。",
      "持續探索 AI-Native 開發模式與最佳實踐，並提供技術顧問服務，協助團隊導入現代化開發工具。",
    ],
    resumeDownload: {
      fileName: "Henry-Lee-Resume-2025.pdf",
      href: "/documents/henry-lee-resume-20250618.pdf",
      label: "Download Resume",
      tooltip: "下載我的履歷 PDF 檔案",
    },
    subtitle: "Frontend · AI · Full-Stack Web Development",
    title: "Senior Software Engineer",
    workCta: { label: "View My Work", tooltip: "瀏覽我的精選專案作品" },
  },
  locale: "zh-Hant",
  mediumArticles: {
    articleTypeLabel: "Medium Article",
    dateLocale: "zh-TW",
    description: "分享我在軟體開發路上的學習心得與技術見解，記錄成長的每一步",
    featuredHeading: "⭐ 精選文章",
    heading: "技術文章 Medium Articles",
    latestHeading: "📰 最新文章",
    mediumCta: "前往我的 Medium 文章頁面",
    mobileHeadingLines: ["技術文章", "Medium Articles"],
    nextLabel: "下一頁",
    pauseLabel: "暫停",
    playLabel: "播放",
    previousLabel: "上一頁",
    readArticleLabel: "閱讀文章",
    slideLabelTemplate: "前往第 {number} 張",
  },
  skills: {
    categories: skillData,
    description: "我在軟體開發領域的技能分佈，從核心專長到各種涉獵的技術棧",
    heading: "Skills",
  },
  workExperience: {
    achievementHeading: "主要成就",
    achievementSeparator: "：",
    description: "我的職涯發展歷程",
    experiences: traditionalChineseExperiences,
    heading: "Work Experience",
  },
};
