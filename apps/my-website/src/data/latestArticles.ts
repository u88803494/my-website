/**
 * 最新 Medium 文章資料 (自動生成)
 *
 * ⚠️  重要提醒：請勿手動編輯此文件！
 *
 * 🔄 此文件由 scripts/sync-latest-articles.ts 自動生成
 * 📅 最後更新時間: 2025/8/6 上午9:04:50
 * 📰 包含最新 2 篇文章
 */

import { Article } from "@/types/article.types";

export const latestArticles: Article[] = [
  {
    description:
      "到目前為止，我們已經探討了如何拆分職責 (SRP)、如何擴展功能 (OCP)、以及如何確保擴展的可靠性 (LSP)。今天，我們要來解決一個在元件化開發中非常常見的問題：一個元件到底該知道多少事？ 這就是 I — 介面隔離原則 (Interface Segregation Principle, ISP) 要探討的核心。 介面隔離原則 (ISP) 同樣由羅伯特·C·馬丁 (Uncle Bob)…",
    publishedDate: "2025-08-01",
    readTime: "2 min read",
    subtitle:
      "到目前為止，我們已經探討了如何拆分職責 (SRP)、如何擴展功能 (OCP)、以及如何確保擴展的可靠性 (LSP)。今天，我們要來解決一個在元件化開發中非常常見的問題：一個元件到底該知道多少事？ 這就是 I — 介面隔離原則 (Interface Segregation Principle, ISP) 要探討的核心。 介面隔離原則 (ISP) 同樣由羅伯特·C·馬丁 (Uncle Bob)…",
    tags: ["AI", "Front End Development", "Life", "React", "TypeScript"],
    thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*Ca3lkjeaVYE4dV3lqqTg2w.png",
    title: "從前端視角理解 SOLID：I — 介面隔離原則，別再硬塞用不到的 Props 了！",
    url: "https://hugh-program-learning-diary-js.medium.com/%E5%BE%9E%E5%89%8D%E7%AB%AF%E8%A6%96%E8%A7%92%E7%90%86%E8%A7%A3-solid-i-%E4%BB%8B%E9%9D%A2%E9%9A%94%E9%9B%A2%E5%8E%9F%E5%89%87-%E5%88%A5%E5%86%8D%E7%A1%AC%E5%A1%9E%E7%94%A8%E4%B8%8D%E5%88%B0%E7%9A%84-props-%E4%BA%86-7f4deb6199e0",
  },
  {
    description:
      "但一個新問題浮現了：當我們基於一個「基本款」元件，去擴展出一個「延伸款」時，要如何確保這個延伸款不會失控，甚至破壞掉原有的系統？這就是我們今天要深入探討的，SOLID 中最具哲學思辨的原則：L — 里氏替換原則 (Liskov Substitution Principle, LSP)。 他認為這只是一個樣式上的替換，但現在，他的 submitForm…",
    publishedDate: "2025-08-01",
    readTime: "2 min read",
    subtitle:
      "但一個新問題浮現了：當我們基於一個「基本款」元件，去擴展出一個「延伸款」時，要如何確保這個延伸款不會失控，甚至破壞掉原有的系統？這就是我們今天要深入探討的，SOLID 中最具哲學思辨的原則：L — 里氏替換原則 (Liskov Substitution Principle, LSP)。 他認為這只是一個樣式上的替換，但現在，他的 submitForm…",
    tags: ["Backend", "Front End Development", "JavaScript", "Life", "React"],
    thumbnail: "https://miro.medium.com/v2/da:true/bc1f8416df0cad099e43cda2872716e5864f18a73bda2a7547ea082aca9b5632",
    title: "從前端視角理解 SOLID：L — 里氏替換原則，你的「延伸款」別背叛了「基本款」",
    url: "https://hugh-program-learning-diary-js.medium.com/%E5%BE%9E%E5%89%8D%E7%AB%AF%E8%A6%96%E8%A7%92%E7%90%86%E8%A7%A3-solid-l-%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8F%9B%E5%8E%9F%E5%89%87-%E4%BD%A0%E7%9A%84-%E5%BB%B6%E4%BC%B8%E6%AC%BE-%E5%88%A5%E8%83%8C%E5%8F%9B%E4%BA%86-%E5%9F%BA%E6%9C%AC%E6%AC%BE-b983acaa3bc7",
  },
];
