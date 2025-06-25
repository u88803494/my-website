/**
 * Medium 文章資料文件
 *
 * ⚠️  重要提醒：請勿手動編輯此文件中的文章資料！
 *
 * 🚀 自動化更新方式：
 * 1. 將新的 Medium 文章 URL 添加到根目錄的 `article-urls.json` 文件中
 * 2. 執行腳本：`node scripts/batch-parse-articles.js`
 * 3. 腳本會自動解析文章資訊並更新此文件
 *
 * 📝 腳本功能：
 * - 自動抓取文章標題、副標題、發布日期、閱讀時間
 * - 自動提取文章描述和縮圖
 * - 自動分析並標記技術標籤
 * - 保持資料格式一致性
 *
 * 🔄 更新流程：
 * article-urls.json → batch-parse-articles.js → articleData.ts (此文件)
 *
 * 💡 如需修改文章資料，請修改腳本邏輯，而非直接編輯此文件
 */

import { Article } from "@/types/article.types";

export const articleList: Article[] = [
  {
    title: "Next.js + AI = 一天搞定個人網站",
    subtitle: "Gemini pro(擔任「架構顧問」與「領航員」)",
    publishedDate: "2025-06-24",
    readTime: "6 min read",
    url: "https://medium.com/@hugh-program-learning-diary-js/next-js-ai-%E4%B8%80%E5%A4%A9%E6%90%9E%E5%AE%9A%E5%80%8B%E4%BA%BA%E7%B6%B2%E7%AB%99-0dddd23f4db3",
    tags: ["Nextjs", "Front End Development", "AI", "Productivity", "Portfolio"],
    description: "紀錄自己完成個人網站 MVP 的一篇文～",
    thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*OnwgRD7rMTMsYT5P7LQZRQ.png",
  },
  {
    title: "Next.js 15 的效能魔法：深入理解 ISR 的最新實踐",
    subtitle: "模式一：時間基礎的再生成 (Time-based Revalidation)",
    publishedDate: "2025-06-19",
    readTime: "11 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/next-js-15-的效能魔法-深入理解-isr-的最新實踐-5685f8256474",
    tags: ["Nextjs", "React", "Web Development", "Performance", "Caching"],
    description: "想讓網站快得像火箭，內容又能隨時更新？Next.js 的 ISR 就是你的答案。本文帶你一次搞懂。",
    thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*hBg1NrYGb1ObZzylyOFqkg.png",
  },
  {
    title: "人生重構 Day39：掌握時間，挑戰自我 — 鐵人賽總結與心得",
    subtitle: "Written by Hugh's Programming life",
    publishedDate: "2023-10-24",
    readTime: "5 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day39-掌握時間-挑戰自我-鐵人賽總結與心得-8219856e2e7f",
    tags: ["Ithome", "Life Lessons", "Productivity", "ChatGPT", "Personal Development"],
    description: "想把事情做好，就要交給一個大忙人",
  },
  {
    title: "人生重構 Day28：再戰新產品 — 規劃 Web 架構",
    subtitle: "Web 架構主導者",
    publishedDate: "2023-11-02",
    readTime: "6 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day28-再戰新產品-規劃-web-架構-ab03a412c0fb",
    tags: ["Nextjs", "Web Development", "Architecture", "Life", "Ithome"],
    description: "簡單是複雜的極致表現 — Da Vinci",
    thumbnail: "https://miro.medium.com/v2/resize:fit:1024/0*pM2-iJLRCd55BUAg.png",
  },
  {
    title: "人生重構 Day25：深入前端 — 再戰產品優化升級",
    subtitle: "草創的歷史",
    publishedDate: "2023-10-10",
    readTime: "6 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day25-深入前端-再戰產品優化升級-52a3ce67d046",
    tags: ["Ithome", "Life", "Life Lessons", "Code Quality", "JavaScript"],
    description: "職場上的每個角色，不是組織的一枚小螺絲，他們是構成整個組織的靈魂",
    thumbnail: "https://miro.medium.com/v2/resize:fit:682/0*rSnvuaOtMcGc52u8.png",
  },
  {
    title: "人生重構 Day17：發揮前端能力 — 完成各種設計",
    subtitle: "我的狀態",
    publishedDate: "2023-10-02",
    readTime: "6 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day17-發揮前端能力-完成各種設計-64940ca42e7d",
    tags: ["Life", "Life Lessons", "Front End Development", "Ithome"],
    description: "透過已知的障礙、自由及目的，便可以在人生的各種遊戲玩得更好",
  },
  {
    title: "從 React 到 Nextjs(TypeScript)：在醫療視訊看診公司的開發之旅",
    subtitle: "第一份工作離職後到現在學了什麼？",
    publishedDate: "2023-05-29",
    readTime: "15 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/從-react-到-nextjs-typescript-在醫療視訊看診公司的開發之旅-2f087f9d8818",
    tags: ["Typescript", "Architecture", "Nextjs", "Twilio", "JavaScript"],
    description: "不知不覺，我已在軟體業打滾超過三年了並在其中學習和成長了許多。",
  },
  {
    title: "讓 Windows 也可以客製化 Terminal：基礎設定篇",
    subtitle: "WSL1:",
    publishedDate: "2021-05-22",
    readTime: "6 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/讓-windows-也可以客製化-terminal-基礎設定篇-a146febfdd10",
    tags: ["Ubuntu", "Linux", "Wsl", "Windows", "Terminal"],
    description: "試著利用 WSL 在 Windows 上安裝 Ubuntu",
    thumbnail: "https://miro.medium.com/v2/resize:fit:515/1*jTknVs5mPJ4YRUiyE85ErA.png",
  },
  {
    title: "前端中階：JS令人搞不懂的地方-物件導向",
    subtitle: "toString.call()",
    publishedDate: "2019-10-14",
    readTime: "23 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/前端中階-js令人搞不懂的地方-物件導向-cdea0e3266ee",
    tags: ["JavaScript", "Learning To Code", "Prototype", "Javascript Tips", "程式自學"],
    description: "什麼是物件導向？",
    thumbnail: "https://miro.medium.com/v2/da:true/resize:fit:1002/1*p9vHvBcniwiA8_jYWT2oEA.gif",
  },
  {
    title: "後端基礎：資料庫補充 View、Stored Procedure 與 Trigger",
    subtitle: "實際應用",
    publishedDate: "2019-08-25",
    readTime: "7 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎-資料庫補充-view-stored-procedure-與-trigger-8dbcbf5946a9",
    tags: ["Database", "PHP", "Sql", "Trigger", "Learning To Code"],
    description: "View",
    thumbnail: "https://miro.medium.com/v2/resize:fit:984/1*MCVWhpwxlKO-Ndh8TVKJug.png",
  },
  {
    title: "後端基礎：資安細節隨手筆記",
    subtitle: "Written by Hugh's Programming life",
    publishedDate: "2019-08-08",
    readTime: "2 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎-資安細節隨手筆記-deb1e6252944",
    tags: ["Sql", "PHP", "Hash"],
    description: "HASH function 加鹽（salting）",
    thumbnail: "https://miro.medium.com/v2/resize:fit:1000/1*kFKSB8wohhxYSW3mqcuVNw.png",
  },
  {
    title: "後端基礎：PHP 的內建 Session 機制",
    subtitle: "session 的設置",
    publishedDate: "2019-08-07",
    readTime: "2 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎-php-的內建-session-機制-f9a19209840f",
    tags: ["PHP", "Cookies", "Sessions"],
    description: "首先要在一開始的地方使用",
  },
  {
    title: "後端基礎概念",
    subtitle: "Apache",
    publishedDate: "2019-06-28",
    readTime: "22 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎概念-8643ca1f5315",
    tags: ["PHP", "Database", "HTML", "Backend", "Learning To Code"],
    description: "什麼是後端？",
    thumbnail: "https://miro.medium.com/v2/resize:fit:611/1*LXCNsoJCIy7n0wXBqcjX6w.png",
  },
  {
    title: "前端基礎：從假資料到真資料：Ajax 與 API 串接",
    subtitle: "透過兩種方式",
    publishedDate: "2019-06-23",
    readTime: "2 min read",
    url: "https://hugh-program-learning-diary-js.medium.com/前端基礎-從假資料到真資料-ajax-與-api-串接-ec4f0dfc4d7d",
    tags: ["Ajax", "API", "Jquery", "Xmlhttprequest"],
    description: "說明",
  },
];
