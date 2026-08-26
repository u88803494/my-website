---
title: 自建 Blog 內容系統（MDX in git + Velite）
type: adr
status: proposed
date: 2026-08-26
deciders: [Henry Lee]
consulted: []
informed: []
tags: [blog, cms, mdx, velite, seo, content-strategy, medium]
related:
  - ../explanation/blog-platform-research.md
  - ./001-react-query-ssg-pattern.md
ai_context: |
  為 henryleelab.com 建立自有 blog 內容系統，脫離對 Medium 未公開 API 的依賴。
  評估 Headless CMS（Sanity）、Git-based CMS（Outstatic、Keystatic）與純檔案三條路線後，
  選擇 MDX in git + Velite，並將 Medium 轉為以 canonical 指回自家站的導流渠道。
---

# ADR-007: 自建 Blog 內容系統（MDX in git + Velite）

## 狀態

**提議中**

- 提議日期：2026-08-26
- 接受日期：（待定）

## 背景

### 我們面臨的問題

現有 blog 完全依賴 Medium，且實作上存在使其對 SEO 毫無貢獻的缺陷：

| 現況                                                                                            | 問題                                        |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `apps/my-website/src/app/(zh-site)/blog/page.tsx` 設有 `export const dynamic = "force-dynamic"` | 完全沒有 SSG，**SEO 效益為零**              |
| 資料來自 Medium 未公開的 GraphQL endpoint（hardcode user id `cd53d8c994f6`）                    | Medium 隨時可能變更，無任何保障             |
| 沒有 `/blog/[slug]` 文章內頁                                                                    | 所有流量導向 Medium，**自家網域留不住權重** |
| 沒有 `sitemap.ts` / `robots.ts`                                                                 | 搜尋引擎無從得知文章存在                    |

### 影響決策的因素

**業務需求**

- 本網站的最高優先目標是協助求職（Senior Software Engineer，台灣與新加坡市場）
- Medium 帳號有 507 位追蹤者且持續成長，**不應放棄該渠道**，而應將自家站確立為內容主場、Medium 轉為導流
- 未來計畫擴展至其他社群平台，源頭格式必須易於分發

**技術限制**

- 專案為 Next.js 16.1.1 + TypeScript strict（禁用 `any`）+ Turborepo monorepo
- 已具備 `zod@^4.3.2`，schema 驗證的心智模型已存在於團隊實務中
- `apps/my-website/next.config.ts` 目前未設定 `images.remotePatterns`

**工作流程**

- 實際寫作流程為「撰寫純文字草稿 → 請 AI 潤飾 → 發稿」
- 重度使用 AI coding agent，內容若位於 repo 內可直接讀改，並能參考既有文章對齊語氣

**範圍限制**

- 首批僅遷移 3–5 篇試行，非一次全搬

完整的選項比較、市場實證與圖片實測數據見 [Blog 平台選型研究](../explanation/blog-platform-research.md)。

## 決策

**採用 MDX in git（`apps/my-website/content/blog/*.mdx`）搭配 Velite 作為 build-time content layer，建立自有 blog 內容系統；文章圖片下載至 `public/images/blog/` 由自家網域提供；Medium 保留為導流渠道，並以 canonical URL 指回 henryleelab.com。**

具體構成：

| 項目          | 選擇                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| 內容格式      | MDX，存放於 `apps/my-website/content/blog/`                             |
| Content layer | **Velite 0.4.0**（Zod schema 驗證 + TypeScript 型別推導）               |
| 圖片          | 下載至 `public/images/blog/[slug]/`，抓 Medium 的 `resize:fit:700` 版本 |
| 編輯後台      | **暫不採用**（保留日後加裝 Outstatic 或 Keystatic 的選項）              |
| Medium 定位   | 導流渠道，新文章採「先發自家站 → Medium Import a Story」                |

## 後果

### 正面影響

- ✅ **SEO 從零到有**：移除 `force-dynamic` 並新增 `/blog/[slug]` 內頁後，文章可被搜尋引擎索引，權重歸於自家網域
- ✅ **脫離 Medium 未公開 API 依賴**：內容不再受制於隨時可能失效的第三方 endpoint
- ✅ **契合實際寫作流程**：內容位於 repo，AI coding agent 可直接讀改，並能參考既有文章對齊語氣
- ✅ **型別安全**：Velite 以 Zod 定義 schema，frontmatter 缺漏或型別錯誤會使 build 失敗，符合專案 strict / no-`any` 標準
- ✅ **分發彈性最大化**：markdown 是各平台通用格式，Medium / DEV / Hashnode 皆可直接使用
- ✅ **保留 Medium 既有觸及**：507 位追蹤者不受影響，同時 SEO 權重歸自家站
- ✅ **零 vendor 成本與風險**：無訂閱費用，無服務終止或改價風險
- ✅ **與既有實務一致**：`scripts/batch-parse-articles.ts` 產生 `articleData.ts` 已是手寫的 build-time content layer，Velite 是其標準化版本

### 負面影響

- ❌ **無編輯後台**：無法在網頁介面上打字發文
- ❌ **行動裝置發文不便**：手機或平板上難以發布或修改文章
- ❌ **Velite 的維護風險**：相對小型的專案，同賽道的 Contentlayer 已停止維護、`next-mdx-remote` 已於 2026-04 archive
  - **退路**：內容資產是 `.mdx` 檔案本身，Velite 屬可拋棄層。若停止維護，更換 parser 即可，內容一字不需更動
- ❌ **圖片需手動處理**：無媒體管理介面，需自行下載與管理（實測顯示圖片量極少，影響有限）
- ❌ **首次設定成本**：需新增 Velite 設定、改寫 blog 頁面、建立遷移 script

### 中性影響

- ℹ️ **新增 build 步驟**：Velite 在 build 時執行，需納入 `next.config.ts` 與 Turborepo 快取考量
- ℹ️ **`packages/blog` 需調整**：`BlogFeature.tsx` 目前為 `"use client"` 且依賴 `useMediumArticles` infinite query，資料取得需回到 Server Component
- ℹ️ **過渡期為混合列表**：僅先遷移 3–5 篇，blog 列表需同時呈現本地文章（內頁）與未遷移的 Medium 文章（外連）
- ℹ️ **Medium canonical 需會員資格**：手動為既有文章設定 canonical 需 Medium 會員；若無，退路是將 Medium 原文縮為摘要並連回自家站全文
- ℹ️ **slug 命名轉換**：既有 Medium 網址為中文 URL，新站建議改用英文 kebab-case

## 考慮過的替代方案

### 替代方案 1：Sanity（Headless CMS）

**描述**：將文章存於 Sanity 的 Content Lake，透過 GROQ 查詢，使用可嵌入自家網域的 Sanity Studio 作為編輯後台。

**優點**：

- 成熟的編輯後台，支援即時協作與行動裝置發文
- 圖片 CDN 支援即時裁切與格式轉換，此項為所有方案中最佳
- 免費方案額度充足（50 萬次 API CDN 請求/月、10 GB 流量、10,000 筆文件）
- `next-sanity` v13（2026-05-21）已修復 Next.js 16 的請求量暴增問題，技術上無阻礙

**缺點**：

- 內文格式為 Portable Text（JSON 結構），非 markdown，需自行撰寫 serializer；技術文章的程式碼區塊需自訂型別與渲染元件
- 分發到其他平台時需**反向轉換**為 markdown
- 內容脫離 repo，AI coding agent 無法直接讀改，也無法參考既有文章對齊語氣
- 引入新的 vendor 依賴與服務終止／改價風險

**未選擇原因**：

1. **求職加分經實證接近零**——LinkedIn 新加坡搜尋 `Sanity CMS frontend engineer`（近一個月）回傳 TikTok、Sea、GIC、OKX 等一般 frontend 職缺，無一以 Sanity 為需求；104 台北搜尋 `Headless CMS 前端工程師` 的 1,323 筆結果同樣無。既然無履歷效益，就不符合「不為 buzzword 硬加技術」的既有原則
2. **與實際寫作流程衝突**——每次發文需在 AI 與後台之間多次複製貼上，且 AI 無法讀取既有文章
3. **與 syndication 策略衝突**——Portable Text 是分發路徑上的額外轉換成本
4. **未解決根本訴求**——目前的痛點是「blog 依賴外部服務」，改用 Sanity 只是更換依賴對象

---

### 替代方案 2：Outstatic（Git-based CMS）

**描述**：安裝於既有 Next.js app 內的 git-based CMS，提供網頁後台，儲存時將 `.md` / `.mdx` commit 至 GitHub repo，並自帶 `getDocuments()` / `getDocumentBySlug()` 讀取層。

**優點**：

- **內容仍在 repo**，保有 git 方案的所有好處
- 提供後台 UI，支援行動裝置發文
- 涵蓋 Velite 的職責範圍（自帶讀取層），無需額外 content layer
- 內建媒體管理，上傳圖片自動 commit 至 GitHub
- 開源可自架，MIT 授權

**缺點**：

- 需在 app 中新增三條 route（`/app/(cms)/layout.tsx`、`/app/(cms)/outstatic/[[...ost]]/page.tsx`、`/app/api/outstatic/[[...ost]]/route.ts`），對有 ESLint 架構邊界規範的 monorepo 是實質侵入
- 免費自架需自建 GitHub OAuth App
- 讀取 API 以字串陣列指定欄位，欄位名稱錯誤不產生型別錯誤，型別安全弱於 Zod schema
- 內容路徑由套件決定（`outstatic/content/posts/`）
- 官方文件的 `[slug]` 頁範例仍使用已 archive 的 `next-mdx-remote/rsc`

**未選擇原因**：

1. **後台在實際寫作流程中沒有位置**——草稿撰寫與 AI 潤飾均在編輯器內完成，後台僅用於最後的貼上與發布，而該步驟 `git push` 即可取代
2. **媒體管理的優勢不成立**——原本這是最有力的採用理由，但圖片實測顯示 15 分鐘長文有 0 張內文圖、6 分鐘文章僅 2 張，一次性下載 script 即可解決
3. **型別安全與專案標準不符**——專案採 TypeScript strict 且禁用 `any`
4. **可後續加裝**——此方案與 Velite 皆使用 markdown，日後若確有行動裝置發文需求再加裝，內容檔案不需搬移，僅需調整目錄結構與讀取層

---

### 替代方案 3：Keystatic（Git-based CMS）

**描述**：Thinkmill 出品的 git-based CMS，後台位於 `/keystatic`，支援 MDX 與 Markdoc，提供 TypeScript schema API，無需資料庫。本機模式直接修改檔案，GitHub 模式自動建立 PR。

**優點**：

- 內容仍在 repo，TypeScript schema API 型別支援優於 Outstatic
- 後台 UI 精緻，文件清楚
- 無資料庫需求，不推銷付費方案

**缺點**：

- 同樣引入後台的設定與維護複雜度
- 相較 Outstatic，社群規模較小（約 2k stars vs 3.2k stars）

**未選擇原因**：與替代方案 2 相同——後台在當前寫作流程中缺乏實質價值。若日後決定加裝後台，Keystatic 與 Outstatic 應重新比較，屆時型別安全可能使 Keystatic 勝出。

---

### 替代方案 4：維持現狀（繼續依賴 Medium API）

**描述**：不做任何變更，blog 頁面繼續透過 `/api/medium-articles` 抓取 Medium GraphQL 資料。

**優點**：

- 零工作量
- 文章維護單一來源，無重複內容疑慮

**缺點**：

- 未解決任何既有問題

**未選擇原因**：現況的四項缺陷（`force-dynamic` 導致 SEO 為零、依賴未公開 API、無內頁、無 sitemap）使 blog 對求職目標毫無貢獻，維持現狀等同於放棄此渠道。

---

### 替代方案 5：Notion as CMS / 現成平台（Ghost、Hashnode）

**描述**：以 Notion 作為後台透過 API 取得內容；或使用 Ghost、Hashnode 等現成部落格平台。

**未選擇原因**：

- **Notion**：API 速度慢、block 轉 HTML 邊界情況多、圖片連結會過期、非官方套件維護不穩定
- **Ghost / Hashnode**：內容不會成為自家網站的一部分，本質上等同於「換一個 Medium」，未解決內容主權問題

## 實作

實作細節與分階段範圍記錄於 [#110](https://github.com/u88803494/my-website/issues/110)，不在本 ADR 內展開。

**分階段概要**

- **Phase 1（基礎建設）**：Velite 設定、移除 `force-dynamic`、新增 `/blog/[slug]` 內頁、`sitemap.ts`、`robots.ts`、`ArticleJsonLd.tsx`（照既有 `PersonJsonLd.tsx` 模式）、`ArticleCard` 的內外連結分支
- **Phase 2（內容遷移）**：遷移 script（沿用既有 `cheerio` / `jsdom` / `axios`，模式參考 `scripts/sync-latest-articles.ts`）、下載圖片、遷移 3–5 篇、Medium 端設定 canonical
- **Phase 3（收斂，暫不執行）**：清理 `/api/medium-articles` 與 `useMediumArticles`；評估是否加裝編輯後台

**相依性**

- 本 ADR 需先轉為「已接受」狀態
- Phase 1 需留意與 [ADR-001: React Query SSG Pattern](./001-react-query-ssg-pattern.md) 的互動：移除 `force-dynamic` 可能觸及 React Query 的 SSG 議題，但本方案將 blog 列表改為不依賴 React Query 的 Server Component，應可繞開

## 驗證

**成功標準**

1. **SSG 生效**：build log 中 `/blog` 與 `/blog/[slug]` 標記為靜態（`○` / `●`），**而非 `ƒ (Dynamic)`**——此為最關鍵的驗收點
2. `/sitemap.xml` 與 `/robots.txt` 可訪問，且 sitemap 包含所有文章 URL
3. 文章內頁 HTML 原始碼包含 Article JSON-LD、`og:*` 與 `twitter:*` meta
4. 文章內文、程式碼區塊與本地圖片正常渲染
5. Medium 對應文章的 `rel="canonical"` 指向 `https://henryleelab.com/blog/[slug]`
6. Google Search Console 可成功索引文章頁面
7. `pnpm check` 通過

**審查日期**：2027-02-26（6 個月後檢視 SEO 成效、Velite 維護狀態，以及是否確實需要編輯後台）

## 相關文件

### 說明文件 (Explanation)

- [Blog 平台選型研究](../explanation/blog-platform-research.md) - 完整的選項比較、求職市場實證與圖片實測數據

### 相關 ADR

- [ADR-001: React Query SSG Pattern](./001-react-query-ssg-pattern.md) - 移除 `force-dynamic` 時需一併考量

### 參考文件 (Reference)

- [Medium Articles API](../reference/api/medium-articles-api.md) - 現行 Medium 整合的 API 規格（Phase 3 將評估移除）

### 待遷移文件

- [Medium 文章同步指南](../guides/medium-article-sync.md) - 現行的文章同步流程。本決策會改變此流程，Phase 3 需一併更新

---

## 備註

### 研究與參考資料

完整的參考資料清單見 [Blog 平台選型研究](../explanation/blog-platform-research.md#研究與參考資料)。核心來源：

- [Next.js 16 and SanityLive: avoiding request overages](https://www.sanity.io/docs/help/nextjs-16-sanitylive-status)
- [Velite](https://velite.js.org/)
- [Outstatic — Fetching data](https://outstatic.com/docs/access-integration/fetching-data)
- [Importing a post to Medium](https://help.medium.com/hc/en-us/articles/214550207-Importing-a-post-to-Medium)

### 討論歷程

- 2026-08-26：初步提議。原始構想為採用 Sanity，經調研後改為 MDX in git + Velite

---

**最後更新**：2026-08-26
