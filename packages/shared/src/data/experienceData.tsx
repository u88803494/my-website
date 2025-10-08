import type { Experience } from '../types';

const experiences: Experience[] = [
  {
    achievements: [
      {
        description: (
          <>
            主導視訊看診系統 Web 介面的開發與規劃，包括醫生端、病人端(LINE Mini)、與行政端，採用 Mono Repo
            架構整合多專案。
          </>
        ),
        title: "協同設計與開發遠距看診系統",
      },
      {
        description: (
          <>成功部署 Twilio SDK，克服技術整合難題，簡化串接流程，實現視訊看診與螢幕分享功能，滿足醫患遠距看診需求。</>
        ),
        title: "視訊功能實現與流程簡化",
      },
      {
        description: (
          <>
            提出創新開發方式，將開發成本降低 <strong>50%</strong>，並改進 UI/UX/DX 設計，顯著提升開發便利性{" "}
            <strong>60%</strong>。
          </>
        ),
        title: "成本與效能優化",
      },
      {
        description: (
          <>改進前後端數據流邏輯，透過 TypeScript 增強同步性與程式碼可讀性，顯著提升開發效率與程式碼維護性。</>
        ),
        title: "技術升級與數據流優化",
      },
      {
        description: (
          <>
            完成公司 React 產品線升級至最新版本，重構程式碼 <strong>99%</strong>，全面提升產品穩定性與開發體驗(DX)。
          </>
        ),
        title: "全面升級與專案重構",
      },
    ],
    company: "健康益友股份有限公司",
    logoUrl: "/images/logos/eucare.png",
    period: "Mar 2022 ~ Apr 2024",
    role: "前端工程師",
    techStackGroups: [
      {
        items: ["Nextjs", "TypeScript", "styled-components", "MUI", "Nxjs(mono)", "React-Query", "Line LIFF"],
        label: "前端相關",
      },
      {
        items: ["GitHub", "Clickup", "Figma", "Twilio"],
        label: "其他",
      },
    ],
  },
  {
    achievements: [
      {
        description: (
          <>
            帶領並指導 <strong>2 名</strong>團隊成員(含 app team 主管)，協助快速上手 React 並能夠獨立開發。
          </>
        ),
        title: "前端技術指導與團隊協作",
      },
      {
        description: (
          <>與 app 團隊合作，主導模組化架構設計與實現，開發多個可重用的 package 和 library，支持快速組合新專案。</>
        ),
        title: "設計並實現模組化架構",
      },
      {
        description: (
          <>訂定 coding style，導入 eslint、prettier、husky，優化 code review 流程，提高程式碼品質與一致性。</>
        ),
        title: "技術標準化與工具引入",
      },
      {
        description: <>撰寫專案相關文件(如初始化 repo、資料夾結構等)，大幅降低溝通成本並統一開發規範。</>,
        title: "文件撰寫與跨團隊協作",
      },
    ],
    company: "威許移動股份有限公司",
    logoUrl: "/images/logos/wishmobile.png",
    period: "Sep 2021 ~ Mar 2022",
    role: "前端工程師",
    techStackGroups: [
      {
        items: ["React", "React Hook", "Redux toolkit", "Redux saga", "styled-components", "Tailwind"],
        label: "前端相關",
      },
      {
        items: ["GitHub", "Jira", "Clickup", "Figma", "Zeplin"],
        label: "其他",
      },
    ],
  },
  {
    achievements: [
      {
        description: (
          <>
            與其他同事協同改善多頻道錄影畫面讀取效率，讀取秒數從 <strong>5 秒以上</strong>變成 <strong>1 秒內</strong>
            讀取完成。
          </>
        ),
        title: "實現關鍵效能突破",
      },
      {
        description: (
          <>獨立負責公司官方網站(www.arisan.io)從舊有的 JQuery 架構遷移至 React，成功提升網站的互動性與長期可維護性。</>
        ),
        title: "主導官網技術棧遷移",
      },
      {
        description: (
          <>
            開發出更有效率撰寫 SCSS 的方法及建立共用組件庫，將特定版型的開發效率提升超過 <strong>50%</strong>。
          </>
        ),
        title: "提升前端開發流程效率",
      },
      {
        description: <>開發出數個共用組件，以節省開發時間，並優化整頁式表單組件樣式以及架構。</>,
        title: "開發共用組件與優化",
      },
    ],
    company: "安銳智慧股份有限公司",
    logoUrl: "/images/logos/arisan.png",
    period: "Jun 2020 ~ May 2021",
    role: "全端工程師",
    techStackGroups: [
      {
        items: ["React", "React Router", "React Hook", "Redux", "SCSS", "Jest"],
        label: "前端",
      },
      {
        items: ["Express.js", "TypeScript", "MongoDB", "DDD 架構", "Mocha"],
        label: "後端",
      },
      {
        items: ["GitLab", "GitLab CI/CD", "Adobe XD", "Zeplin"],
        label: "工具",
      },
    ],
  },
];

export { experiences };