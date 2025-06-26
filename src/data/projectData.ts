import { SOCIAL_LINKS } from "@/constants/socialLinks";
import { Project } from "@/types/project.types";

export const projects: Project[] = [
  {
    category: "字典網站 (個人獨立專案)",
    description: {
      features: [
        "串接「萌典」API 提供即時字義查詢，並實現字詞與 URL 同步的動態路由功能",
        "從無到有自主設計 UI，並採用 Tailwind CSS 實現跨裝置的響應式介面 (RWD)",
        "採用 Next.js 搭配 TypeScript 進行開發，確保專案的型別安全與優良開發體驗",
        "使用 Redux Toolkit 進行全域狀態管理，並透過 Thunk 處理非同步的 API 資料獲取",
      ],
      intro:
        "一個串接萌典資料來源的線上中文字典應用，旨在優化中文字詞的學習與查詢體驗。從零到一獨立完成專案的設計、開發與部署。",
    },
    imageUrl: "/images/projects/new-dictionary.png",
    links: [
      { label: "預覽網站", url: "https://dictionary-u88803494.vercel.app/" },
      {
        label: "實作文章 1",
        url: "https://hugh-program-learning-diary-js.medium.com/%E5%BE%9E%E9%9B%B6%E9%96%8B%E5%A7%8B%E5%BB%BA%E7%AB%8B%E4%B8%80%E5%80%8B%E5%AD%97%E5%85%B8%E7%B6%B2%E7%AB%99-%E5%A4%A7%E7%B6%B1-9ba7f20d5c68",
      },
      {
        label: "實作文章 2",
        url: "https://hugh-program-learning-diary-js.medium.com/%E5%BE%9E%E9%9B%B6%E9%96%8B%E5%A7%8B%E5%BB%BA%E7%AB%8B%E4%B8%80%E5%80%8B%E5%AD%97%E5%85%B8%E7%B6%B2%E7%AB%99-%E9%96%8B%E5%A7%8B%E5%89%8D%E6%A7%8B%E6%80%9D-f58b4b8c12b2",
      },
    ],
    techStack: ["Next.js", "TypeScript", "Redux Toolkit", "Thunk", "Tailwind CSS"],
    title: "新典",
  },
  {
    category: "靜態電商網站 (AI 協作專案)",
    description: {
      features: [
        "實際成果：在 3 個工作日內完成從設計到部署的完整流程，成功驗證了 AI 輔助開發的高效率",
        "技術棧：採用 Next.js、TypeScript 與 Tailwind CSS 打造，並透過 Vercel 進行全球部署與託管",
        "網站功能：實現了純靜態的商品類別切換、產品 Hover 互動效果，並具備完整的響應式設計 (RWD)",
        "(專案起始日期：2025/06/09)",
      ],
      intro:
        "一個探索 AI 協同開發流程的實踐專案。目標是在極短的時間內，利用 AI 工具輔助，從零到一建構出一個專業、現代且完全響應式的產品展示網站。",
    },
    imageUrl: "/images/projects/tzuchi-shop.png",
    links: [
      { label: "預覽網站", url: "https://buddhist-shop.vercel.app/" },
      { label: "GitHub", url: `${SOCIAL_LINKS.GITHUB}/buddhistShop` },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel", "AI 輔助開發"],
    title: "慈濟產品展示靜態網站",
  },
  {
    category: "React blog(學習專案)",
    description: {
      features: [
        "整合 Google Firebase Authentication，實現安全的第三方登入與使用者身份驗證功能",
        "實現了完整的文章管理流程，包括基於權限的文章發布、編輯、刪除 (CRUD) 等後台功能",
        "採用 React Router 打造單頁式應用 (SPA)，並透過 Redux Thunk 管理非同步操作與全域狀態",
        "專案後期以 React Hooks 進行重構，大幅簡化了組件邏輯，提升程式碼的可讀性與可維護性",
        "(專案起始日期：2019/11/29)",
      ],
      intro:
        "這是我早期最完整的獨立開發應用，旨在實踐一個具備完整後台管理功能的全端部落格系統。專案涵蓋了使用者身份驗證、完整的文章 CRUD（建立、讀取、更新、刪除）流程與前端錯誤處理機制，奠定了我處理複雜 Web 應用的堅實基礎。",
    },
    imageUrl: "/images/projects/react-blog.png",
    links: [
      { label: "預覽網站", url: "https://u88803494.github.io/react_blog/#/posts" },
      { label: "GitHub 介紹", url: `${SOCIAL_LINKS.GITHUB}/react_blog?tab=readme-ov-file#react-spa-blog` },
    ],
    techStack: ["React", "Redux", "Firebase Auth", "Bootstrap"],
    title: "React 部落格系統 (學習專案)",
  },
  {
    category: "公司官方網站 (主導開發)",
    description: {
      features: [
        "負責核心頁面開發：獨立完成「服務總覽 (Service)」、「產品介紹 (Clio, Faceta)」三大主要頁面的開發與全站表單功能",
        "精準實現 UI/UX：採用 BEM (Block, Element, Modifier) 方法論建構高可維護性的 SCSS 架構，並支援 4K 高解析度螢幕顯示",
        "優化使用者互動：利用 React Context API 實現全域彈出式表單，並開發指定區塊的平滑滾動跳轉功能",
        "導入自動化測試：整合 Jest 與 Puppeteer 進行端對端 (E2E) 測試，並串接至 GitLab CI/CD 流程，確保每次部署的品質",
      ],
      intro:
        "主導公司官方網站（www.arisan.io）的前端開發，獨立負責將設計稿轉化為高精度、高效能的互動式網頁。此專案所有 UI 組件均為純手工打造，以確保最佳的客製化程度與效能。",
    },
    imageUrl: "/images/projects/arisan-website.png",
    links: [
      { label: "官網連結", url: "https://www.arisan.io/#/clio" },
      {
        label: "實作心得",
        url: "https://hugh-program-learning-diary-js.medium.com/%E8%BD%89%E8%81%B7%E5%85%A8%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%89%E5%80%8B%E6%9C%88%E7%9A%84%E5%BF%83%E5%BE%97-%E6%8F%90%E6%97%A9%E8%84%AB%E9%9B%A2%E8%A8%93%E7%B7%B4%E6%9C%9F-1ce9213d0b26",
      },
    ],
    techStack: ["React", "SCSS (BEM)", "Jest", "Puppeteer"],
    title: "公司官方網站",
  },
];
