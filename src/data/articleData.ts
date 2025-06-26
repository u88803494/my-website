/**
 * Medium 文章資料文件
 *
 * ⚠️  重要提醒：請勿手動編輯此文件中的文章資料！
 *
 * 🚀 自動化更新方式：
 * 1. 將新的 Medium 文章 URL 添加到根目錄的 `article-urls.json` 文件中
 * 2. 執行腳本：`npm run parse:articles` 或 `node scripts/batch-parse-articles.ts`
 * 3. 腳本會自動解析文章資訊並更新此文件
 *
 * 📝 腳本功能：
 * - 自動抓取文章標題、副標題、發布日期、閱讀時間
 * - 自動提取文章描述和縮圖
 * - 自動分析並標記技術標籤
 * - 保持資料格式一致性
 *
 * 🔄 更新流程：
 * article-urls.json → batch-parse-articles.ts → articleData.ts (此文件)
 *
 * 💡 如需修改文章資料，請修改腳本邏輯，而非直接編輯此文件
 */

import { Article } from "@/types/article.types";

export const articleList: Article[] = [
  {
    description: "不到一小時，逆向工程 Medium 的 GraphQL API，成功搭建即時同步的個人部落格",
    publishedDate: "2025-06-26",
    readTime: "5 min read",
    subtitle: "前言：擱置數年的心願，短短數天的衝刺",
    tags: ["AI", "Programming", "Web Development", "Reverse Engineering", "GraphQL"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*c4q7hQMgSsQd2yaSMs_BlA.png",
    title: "我帶領 AI 的攻防戰：逆向 Medium API 實錄",
    url: "https://hugh-program-learning-diary-js.medium.com/我帶領-ai-的攻防戰-逆向-medium-api-實錄-a8fb39952f48",
  },
  {
    description: "從搜尋到深思：一個軟體工程師，在 AI 時代找回程式設計的純粹樂趣。",
    publishedDate: "2025-06-26",
    readTime: "4 min read",
    subtitle: "Written by Hugh's Programming life",
    tags: ["AI", "Software Development", "Productivity", "Thinking", "Startup"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*gxa0xIrbzEYT_ulO6pPncQ.png",
    title: "AI 不替你思考，它讓你思考得更純粹",
    url: "https://hugh-program-learning-diary-js.medium.com/ai-不替你思考-它讓你思考得更純粹-8ce58fa96961",
  },
  {
    description: "想把事情做好，就要交給一個大忙人",
    publishedDate: "2023-10-24",
    readTime: "5 min read",
    subtitle: "Written by Hugh's Programming life",
    tags: ["Ithome", "Life Lessons", "Productivity", "ChatGPT", "Personal Development"],
    title: "人生重構 Day39：掌握時間，挑戰自我 — 鐵人賽總結與心得",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day39-掌握時間-挑戰自我-鐵人賽總結與心得-8219856e2e7f",
  },
  {
    description: "簡單是複雜的極致表現 — Da Vinci",
    publishedDate: "2023-11-02",
    readTime: "6 min read",
    subtitle: "Web 架構主導者",
    tags: ["Nextjs", "Web Development", "Architecture", "Life", "Ithome"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:1024/0*pM2-iJLRCd55BUAg.png",
    title: "人生重構 Day28：再戰新產品 — 規劃 Web 架構",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day28-再戰新產品-規劃-web-架構-ab03a412c0fb",
  },
  {
    description: "職場上的每個角色，不是組織的一枚小螺絲，他們是構成整個組織的靈魂",
    publishedDate: "2023-10-10",
    readTime: "6 min read",
    subtitle: "草創的歷史",
    tags: ["Ithome", "Life", "Life Lessons", "Code Quality", "JavaScript"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:682/0*rSnvuaOtMcGc52u8.png",
    title: "人生重構 Day25：深入前端 — 再戰產品優化升級",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day25-深入前端-再戰產品優化升級-52a3ce67d046",
  },
  {
    description: "透過已知的障礙、自由及目的，便可以在人生的各種遊戲玩得更好",
    publishedDate: "2023-10-02",
    readTime: "6 min read",
    subtitle: "我的狀態",
    tags: ["Life", "Life Lessons", "Front End Development", "Ithome"],
    title: "人生重構 Day17：發揮前端能力 — 完成各種設計",
    url: "https://hugh-program-learning-diary-js.medium.com/人生重構-day17-發揮前端能力-完成各種設計-64940ca42e7d",
  },
  {
    description: "不知不覺，我已在軟體業打滾超過三年了並在其中學習和成長了許多。",
    publishedDate: "2023-05-29",
    readTime: "15 min read",
    subtitle: "第一份工作離職後到現在學了什麼？",
    tags: ["Typescript", "Architecture", "Nextjs", "Twilio", "JavaScript"],
    title: "從 React 到 Nextjs(TypeScript)：在醫療視訊看診公司的開發之旅",
    url: "https://hugh-program-learning-diary-js.medium.com/從-react-到-nextjs-typescript-在醫療視訊看診公司的開發之旅-2f087f9d8818",
  },
  {
    description: "試著利用 WSL 在 Windows 上安裝 Ubuntu",
    publishedDate: "2021-05-22",
    readTime: "6 min read",
    subtitle: "WSL1:",
    tags: ["Ubuntu", "Linux", "Wsl", "Windows", "Terminal"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:515/1*jTknVs5mPJ4YRUiyE85ErA.png",
    title: "讓 Windows 也可以客製化 Terminal：基礎設定篇",
    url: "https://hugh-program-learning-diary-js.medium.com/讓-windows-也可以客製化-terminal-基礎設定篇-a146febfdd10",
  },
  {
    description: "什麼是物件導向？",
    publishedDate: "2019-10-14",
    readTime: "23 min read",
    subtitle: "toString.call()",
    tags: ["JavaScript", "Learning To Code", "Prototype", "Javascript Tips", "程式自學"],
    thumbnail: "https://miro.medium.com/v2/da:true/resize:fit:1002/1*p9vHvBcniwiA8_jYWT2oEA.gif",
    title: "前端中階：JS令人搞不懂的地方-物件導向",
    url: "https://hugh-program-learning-diary-js.medium.com/前端中階-js令人搞不懂的地方-物件導向-cdea0e3266ee",
  },
  {
    description: "View",
    publishedDate: "2019-08-25",
    readTime: "7 min read",
    subtitle: "實際應用",
    tags: ["Database", "PHP", "Sql", "Trigger", "Learning To Code"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:984/1*MCVWhpwxlKO-Ndh8TVKJug.png",
    title: "後端基礎：資料庫補充 View、Stored Procedure 與 Trigger",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎-資料庫補充-view-stored-procedure-與-trigger-8dbcbf5946a9",
  },
  {
    description: "HASH function 加鹽（salting）",
    publishedDate: "2019-08-08",
    readTime: "2 min read",
    subtitle: "Written by Hugh's Programming life",
    tags: ["Sql", "PHP", "Hash"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:1000/1*kFKSB8wohhxYSW3mqcuVNw.png",
    title: "後端基礎：資安細節隨手筆記",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎-資安細節隨手筆記-deb1e6252944",
  },
  {
    description: "首先要在一開始的地方使用",
    publishedDate: "2019-08-07",
    readTime: "2 min read",
    subtitle: "session 的設置",
    tags: ["PHP", "Cookies", "Sessions"],
    title: "後端基礎：PHP 的內建 Session 機制",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎-php-的內建-session-機制-f9a19209840f",
  },
  {
    description: "什麼是後端？",
    publishedDate: "2019-06-28",
    readTime: "22 min read",
    subtitle: "Apache",
    tags: ["PHP", "Database", "HTML", "Backend", "Learning To Code"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:611/1*LXCNsoJCIy7n0wXBqcjX6w.png",
    title: "後端基礎概念",
    url: "https://hugh-program-learning-diary-js.medium.com/後端基礎概念-8643ca1f5315",
  },
  {
    description: "說明",
    publishedDate: "2019-06-23",
    readTime: "2 min read",
    subtitle: "透過兩種方式",
    tags: ["Ajax", "API", "Jquery", "Xmlhttprequest"],
    title: "前端基礎：從假資料到真資料：Ajax 與 API 串接",
    url: "https://hugh-program-learning-diary-js.medium.com/前端基礎-從假資料到真資料-ajax-與-api-串接-ec4f0dfc4d7d",
  },
];
