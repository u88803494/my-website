---
title: Blog 平台選型研究（Blog Platform Selection Research）
type: explanation
status: stable
audience: [developer, ai, architect]
tags: [blog, cms, mdx, velite, sanity, seo, content-strategy, medium]
created: 2026-08-26
updated: 2026-08-26
related:
  - adr/007-self-hosted-blog.md
  - adr/001-react-query-ssg-pattern.md
  - reference/api/medium-articles-api.md
ai_context: |
  記錄 henryleelab.com 自建 blog 的平台選型調研全程，涵蓋 Headless CMS、
  Git-based CMS、純檔案三大路線的比較，以及求職市場與圖片量的實證數據。
  最終選擇 MDX in git + Velite，決策記錄見 ADR-007。
---

# Blog 平台選型研究（Blog Platform Selection Research）

## 概述

**解釋內容**：為 henryleelab.com 建立自有 blog 內容系統時，如何在 Headless CMS、Git-based CMS 與純檔案三條路線之間做出選擇。

**重要性**：現有的 blog 頁面完全依賴 Medium 的未公開 API，且因設定問題導致 SEO 效益為零。此決策同時影響內容主權、SEO 成效與日常寫作流程。

**核心洞察**：對個人技術部落格而言，**選型的決定性因素不是 CMS 的功能多寡，而是內容格式與寫作流程的契合度**。工具可以替換，內容格式很難替換。

---

## 背景

### 問題空間

現有 blog 實作存在五項缺陷（2026-08 盤點）：

| 現況                                                                                            | 問題                                        |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `apps/my-website/src/app/(zh-site)/blog/page.tsx` 設有 `export const dynamic = "force-dynamic"` | 完全沒有 SSG，**SEO 效益為零**              |
| 資料來自 Medium 未公開的 GraphQL endpoint（hardcode user id `cd53d8c994f6`）                    | Medium 隨時可能變更，無任何保障             |
| 沒有 `/blog/[slug]` 文章內頁                                                                    | 所有流量導向 Medium，**自家網域留不住權重** |
| 沒有 `sitemap.ts` / `robots.ts`                                                                 | 搜尋引擎無從得知文章存在                    |
| `packages/shared/src/data/articleData.ts` 僅有 16 筆 metadata（無內文）                         | 只供 resume 的 MediumArticles 區塊使用      |

綜合來看，目前的 blog 頁面對「讓 recruiter 找到並閱讀技術文章」這個目標沒有實質貢獻。

### 為何重要

- **內容主權**：文章正文目前只存在於 Medium，自家網站沒有任何備份或呈現
- **SEO**：`force-dynamic` 加上缺乏內頁，等於放棄了所有搜尋引擎流量
- **分發彈性**：未來要擴展到其他社群平台時，需要一個可靠的內容來源

### 歷史背景

Medium 帳號累積了 507 位追蹤者且持續成長，因此策略不是「離開 Medium」，而是**將自家網站確立為內容主場（source of truth），Medium 轉為導流渠道**。

---

## 選項全景

市面上的方案可分為五類。

### 第一類：Headless CMS（內容存於外部資料庫）

代表：**Sanity**、Contentful、Storyblok、Payload、Strapi、Directus。

**運作模型**：定義 schema → 在雲端後台編輯 → 網站透過 API 取得內容。

以 Sanity 為例：

- **Content Lake**：文章實際存放處，位於 Sanity 伺服器
- **Sanity Studio**：React 打造的編輯後台，可部署在自有網域下（如 `/studio`）
- **GROQ**：專屬查詢語言（亦支援 GraphQL）
- **Portable Text**：內文格式是 **JSON 結構，不是 markdown 也不是 HTML**。渲染時需自行撰寫 serializer，將 JSON 轉為 React 元件——標題、程式碼區塊、圖片等每種型別都要各自定義
- **圖片 CDN**：支援即時裁切與格式轉換，此項確實出色

**免費方案額度**：2 個 dataset、每月 50 萬次 API CDN 請求、10 GB 流量、20 GB 檔案儲存、10,000 筆文件、20 個帳號。

### 第二類：Git-based CMS（有後台，但存的是 repo 裡的檔案）

代表：**Outstatic**、**Keystatic**、**Decap CMS**、**TinaCMS**、**Front Matter CMS**。

**運作模型**：提供網頁（或編輯器內）後台 UI，但按下儲存時是**將 `.md` / `.mdx` 檔案 commit 到 GitHub repo**，而非寫入雲端資料庫。

| 工具                 | 特色                                                                            | 注意事項                                           |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Outstatic**        | 直接裝在 Next.js app 內、無需資料庫、Tiptap 編輯器、內建 AI Completion          | 需自建 GitHub OAuth App；讀取 API 以字串陣列選欄位 |
| **Keystatic**        | Thinkmill 出品，支援 MDX 與 Markdoc，TypeScript schema API，後台在 `/keystatic` | 本機模式直接改檔案，GitHub 模式自動開 PR           |
| **Decap CMS**        | 最老牌的免費 git-backed 選項，生態成熟                                          | UI 較舊                                            |
| **TinaCMS**          | 可在網站頁面上點文字就地編輯                                                    | 設定複雜；Tina Cloud 是額外的 SaaS 依賴            |
| **Front Matter CMS** | VS Code 擴充套件，把 CMS 開在編輯器內，含 SEO 檢查與即時預覽                    | 見下方維護風險說明                                 |

### 第三類：純檔案（無後台）

`.md` / `.mdx` 檔案存於 repo，搭配 **content layer** 在 build 時做型別驗證與編譯。

代表：**Velite**、Content Collections。

**運作模型**：在編輯器（或 AI coding agent）中寫檔 → `git push` → CI 自動 build 部署。

### 第四類：Notion as CMS

在 Notion 撰寫，網站透過 Notion API 取得內容。寫作體驗佳，但 API 速度慢、block 轉 HTML 有諸多邊界情況、圖片連結會過期、非官方套件維護不穩定。

### 第五類：現成部落格平台

**Ghost**（可自架或付費 SaaS，內建電子報訂閱）、**Hashnode**（免費、可綁自訂網域、技術圈流量佳）。

這類方案是「整套交付」，但內容不會成為自家網站的一部分，本質上等同於「換一個 Medium」。

---

## 關鍵技術事實

調研過程中查證到數項會直接影響選型的事實，記錄如下。

### MDX 生態的陣亡史（重要）

| 套件                  | 狀態                            | 影響                                                                              |
| --------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| **Contentlayer**      | 已停止維護                      | 曾是 Next.js content layer 的主流選擇                                             |
| **`next-mdx-remote`** | **2026-04 已 archive**          | 大量既有教學文仍在推薦，**包含 Outstatic 官方文件的 `[slug]` 頁範例**，不可跟著抄 |
| **Velite**            | 0.4.0（2026-06 發布），活躍維護 | Contentlayer 的實質接替者                                                         |

此賽道確實有陣亡風險，但關鍵在於：**內容資產是 `.mdx` 檔案本身，content layer 是可拋棄的**。若 Velite 停止維護，更換 parser 即可，內容一字不需更動。這與 Headless CMS 的鎖定程度是不同量級。

### Sanity + Next.js 16 相容性

`next-sanity` v12 搭配 Next.js 16 時，因 Next.js 16 的 prefetch 行為變更加上 `<SanityLive>` 的快取失效機制，會造成**請求量平均暴增 4 倍，內容密集網站可達 7–10 倍以上**。

此問題已於 **`next-sanity` v13（2026-05-21）修復**。本專案使用 Next.js 16.1.1，若採用 Sanity 需確保使用 v13 以上。

**結論**：技術上可行，非阻礙因素。

### Front Matter CMS 的維護訊號

作者於 2026 年在 GitHub README 與 VS Code Marketplace 公開聲明，將重心轉向可持續的營收來源，並明確表示「功能請求可能需要更長時間處理」。作者本人仍每日使用故會持續維護，但這是選型時應納入考量的訊號。

### Outstatic 的實際設定成本

- 需在 app 中新增三條 route：`/app/(cms)/layout.tsx`、`/app/(cms)/outstatic/[[...ost]]/page.tsx`、`/app/api/outstatic/[[...ost]]/route.ts`
- 免費自架需自建 GitHub OAuth App，設定 callback URL 與 client id/secret
- 讀取 API 以字串陣列指定欄位：`getDocumentBySlug('posts', slug, ['title', 'publishedAt', 'content'])`，欄位名稱打錯不會產生型別錯誤
- 內容路徑由套件決定（`outstatic/content/posts/`）

**AI Completion 的實際範圍**：三種觸發方式（slash 選單的 Continue writing、輸入 `++`、選取文字後的 Ask AI），本質是**段落級的續寫與改寫**，非整篇潤飾。設定方式有三種：`OUTSTATIC_API_KEY`（Pro 付費）、`AI_GATEWAY_API_KEY`（Vercel AI Gateway，每月 $5 免費額度）、`OPENAI_API_KEY`（自付 OpenAI）。自架可用 `OST_AI_MODEL=provider/model-id` 指定模型，model ID 取自 Vercel AI Gateway 的清單。

須注意：Outstatic 有自己的 AI route handler，**不會共用專案既有的 `ai` / `@ai-sdk/google` 相依與 `GEMINI_API_KEY`**。此外 Vercel AI Gateway 的 BYOK（使用自有 provider key）為付費層限定。

---

## 求職市場實證

本網站的最高優先目標是協助求職（Senior Software Engineer，台灣與新加坡市場）。因此「學會某項技術對履歷的加分」是選型的合理考量之一，需要實證而非臆測。

### 查詢方法與結果

| 來源               | 查詢條件                                 | 結果                                                                                            |
| ------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| LinkedIn（新加坡） | `Sanity CMS frontend engineer`，近一個月 | 回傳 TikTok、ByteDance、Sea、GIC、OKX、Accenture 等一般 frontend 職缺，**無一以 Sanity 為需求** |
| 104（台北）        | `Headless CMS 前端工程師`                | 1,323 筆結果，皆為一般前端職缺，**同樣無一以 Headless CMS 為核心需求**                          |

### 結論

台灣與新加坡的 Senior SWE 職缺，考核重點在 React / TypeScript / 系統設計，而非特定 CMS。**「學 Sanity 以增加履歷亮點」在這兩個市場的實證支持薄弱。**

此結論同時呼應專案既有原則：不為 buzzword 硬加技術。

---

## 圖片實測數據

遷移 Medium 文章時，圖片處理原被視為主要疑慮。實際抽樣後發現疑慮被高估。

### 逐篇圖片數

| 文章                                                              | 長度        | 內文圖片數 |
| ----------------------------------------------------------------- | ----------- | ---------- |
| 〈從 React 到 Nextjs(TypeScript)：在醫療視訊看診公司的開發之旅〉  | 15 min read | **0 張**   |
| 〈AI 不是取代你，而是強化你：一位工程師的四大 AI 生產力實戰報告〉 | 6 min read  | **2 張**   |

Medium 頁面原始碼中大量的 `miro.medium.com` 連結，**絕大多數是作者頭像與 UI icon**（同一張圖的 32×32、40×40、48×48、64×64 變體），並非內容圖片。這是「圖片很多」印象的來源。

**辨識方式**：內容圖為 `resize:fit:*`，頭像與 icon 為 `resize:fill:*` 的小尺寸。

### 檔案大小（實測 `content-length`）

| 圖片                            | 尺寸參數          | 大小     |
| ------------------------------- | ----------------- | -------- |
| `1*3eveGvftMYwR4RLRn7zGVQ.png`  | `resize:fit:700`  | 50 KB    |
| `1*myF_V71LnkFdCJ4vLBt3uw.png`  | `resize:fit:700`  | 420 KB   |
| `1*myF_V71LnkFdCJ4vLBt3uw.png`  | `resize:fit:1200` | 1,139 KB |
| `1*OgPBqhUMpDEo-jVM3ICjwg.jpeg` | `resize:fit:800`  | 49 KB    |

**同一張圖的 700 版與 1200 版差距近 3 倍，遷移時應抓 700 版。**

### 儲存策略結論

首批遷移 3–5 篇預估增加 1–2 MB。對照現況：`apps/my-website/public/images/` 已有 6.2 MB，`.git` 總計 18 MB，此增量可忽略。

**應下載至 `public/images/blog/` 而非沿用 Medium URL**，理由有二：

1. `apps/my-website/next.config.ts` **目前未設定 `images.remotePatterns`**。沿用 `miro.medium.com` URL 需額外設定，且仍然依賴 Medium CDN
2. 本地圖片可直接使用 `next/image` 的完整優化（自動 WebP/AVIF 轉換、responsive srcset），無需任何設定

另需注意：圖片密集的早期文章（「人生重構」鐵人賽日誌、前後端基礎筆記）不在遷移範圍內，因其與 Senior SWE 的定位敘事不符。

---

## Syndication 策略

既定策略為「自家站為主、Medium 為輔導流」，未來擴展其他社群平台。這屬於典型的 content syndication 模式，重點在避免重複內容問題並確保 SEO 權重歸屬正確。

### Canonical URL 的作用

`rel="canonical"` 告訴搜尋引擎哪一份是正本。設定正確時，指向副本的流量與排名訊號會計入正本。

### 各平台做法

| 平台               | 做法                                                                 | 注意事項                                                                |
| ------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Medium**         | 使用「**Import a Story**」功能貼上自家站 URL，**canonical 自動設定** | 手動編輯既有文章設 canonical 需 Medium 會員資格                         |
| **DEV / Hashnode** | 直接接受 markdown，可設 canonical                                    | —                                                                       |
| **LinkedIn**       | 須使用**長貼文**格式                                                 | **不可使用 Article 格式**——它會把全文吃進 LinkedIn 且無法設定 canonical |

### 對選型的影響

Syndication 模式要求源頭格式必須易於分發。**Markdown 是各平台的通用格式**；Sanity 的 Portable Text 則需先反向轉換為 markdown 才能分發，在此情境下是負面因素。

已遷移文章的 Medium 原文網址應保留於 frontmatter（如 `mediumUrl` 欄位），供雙向互連與後續追蹤。

---

## 決策準則：為何寫作流程是關鍵因素

多數 CMS 比較文章聚焦於功能矩陣，但對單人技術部落格而言，**日常寫作流程的契合度影響遠大於功能差異**。

### 本專案的實際寫作流程

**撰寫純文字草稿 → 請 AI 潤飾 → 發稿**

將此流程對照兩種內容儲存位置：

| 步驟                            | 內容在 Headless CMS                  | 內容在 git                      |
| ------------------------------- | ------------------------------------ | ------------------------------- |
| 撰寫草稿                        | 需在其他工具撰寫                     | 直接在 repo 新增 `.mdx`         |
| AI 潤飾                         | 複製 → 貼給 AI → 複製回來 → 貼進後台 | AI coding agent 直接讀檔改檔    |
| 發稿                            | 貼進後台後 Publish                   | `git push`                      |
| **AI 能否參考既有文章對齊語氣** | **否**——每篇是獨立的資料庫記錄       | **是**——所有文章都在同一個 repo |

最後一列是最容易被低估的差異。當文章全部位於 repo 中，可直接要求 AI「參照前三篇的語氣潤飾這篇」，而 Headless CMS 除非每次手動貼上，否則無法做到。

### 後台 UI 的實際價值評估

後台的核心價值是「不需開啟編輯器即可發文」，主要體現在手機或平板發文。但在上述流程中：

- 草稿撰寫與 AI 潤飾都在編輯器內進行
- 後台只會用於最後的貼上與發布，而該步驟 `git push` 即可完成

因此**後台在此流程中缺乏實質位置**，除非確實有行動裝置發文需求。

### 可逆性分析

選型時應考慮「日後改變主意的成本」：

| 起點                   | 終點                                   | 成本                                           |
| ---------------------- | -------------------------------------- | ---------------------------------------------- |
| 純檔案（Velite）       | Git-based CMS（Outstatic / Keystatic） | 低——內容檔案不需搬移，僅需調整目錄結構與讀取層 |
| 純檔案                 | Headless CMS                           | 中——需將 markdown 轉為該 CMS 的內容格式        |
| Headless CMS（Sanity） | 任何其他方案                           | 高——Portable Text 需整批轉檔                   |

**選擇 markdown in git 保留了最多的未來選項。** 這也是「一次弄好，才能長久使用」這項需求的實質答案：讓系統長久的是內容格式的選擇，而非工具的數量。

---

## 相關文件

### 架構決策記錄 (ADR)

- [ADR-007: 自建 Blog 內容系統](../adr/007-self-hosted-blog.md) - 本研究導出的決策
- [ADR-001: React Query SSG Pattern](../adr/001-react-query-ssg-pattern.md) - 移除 `force-dynamic` 時需一併考量

### 參考文件 (Reference)

- [Medium Articles API](../reference/api/medium-articles-api.md) - 現行 Medium 整合的 API 規格

---

## 研究與參考資料

### 平台官方文件

- [Sanity Pricing](https://www.sanity.io/pricing)
- [Next.js 16 and SanityLive: avoiding request overages](https://www.sanity.io/docs/help/nextjs-16-sanitylive-status)
- [Velite](https://velite.js.org/)
- [Keystatic](https://keystatic.com)
- [Outstatic — The content editor](https://outstatic.com/docs/editing-modeling/the-content-editor)
- [Outstatic — Fetching data](https://outstatic.com/docs/access-integration/fetching-data)
- [Front Matter CMS](https://frontmatter.codes)
- [Decap CMS — Next.js 整合](https://decapcms.org/docs/nextjs)
- [Vercel AI Gateway Pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Next.js — How to use markdown and MDX](https://nextjs.org/docs/app/guides/mdx)

### 比較與分析

- [Markdown CMS vs Visual CMS in 2026](https://unfoldcms.com/blog/markdown-cms-vs-visual-cms)
- [Payload CMS v3 vs Keystatic vs Outstatic 2026](https://www.pkgpulse.com/guides/payload-cms-v3-vs-keystatic-vs-outstatic-headless-cms-2026)
- [Why I Ditched Sanity CMS for MDX](https://medium.com/@akshaygupta.live/why-i-ditched-sanity-cms-for-mdx-and-never-looked-back-78b3174f6e56)
- [next-mdx-remote/rsc vs @next/mdx](https://blixamo.com/blog/next-mdx-remote-rsc-vs-next-mdx-nextjs-15)

### Syndication

- [Importing a post to Medium — Medium Help Center](https://help.medium.com/hc/en-us/articles/214550207-Importing-a-post-to-Medium)
- [Canonical Cross-Posting Guide (2026)](https://www.startuphub.ai/ai-news/ai-tools/1970/canonical-cross-posting-guide)
- [Blog Syndication: Cross-Publishing to Dev.to, Hashnode, and Medium](https://www.nvarma.com/blog/2026-02-10-cross-publishing-blog-posts-devto-hashnode-medium)

---

**最後更新**：2026-08-26
