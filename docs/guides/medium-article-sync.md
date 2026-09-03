---
title: Medium 文章遷移至 MDX（Medium to MDX Migration Guide）
type: guide
status: stable
audience: [developer, ai]
tags: [medium, mdx, velite, migration, scripts, content]
created: 2026-08-26
updated: 2026-09-03
difficulty: intermediate
estimated_time: 10 分鐘
related:
  - adr/007-self-hosted-blog.md
  - reference/api/medium-articles-api.md
ai_context: |
  Medium 官方匯出檔（microformats2 h-entry HTML）轉換成 Velite MDX 的流程與已知限制。
  這是一次性遷移；日後新文章直接寫 MDX，不再經過此腳本。
  轉換器位於 apps/my-website/scripts/medium-to-mdx/。
---

# Medium 文章遷移至 MDX

## 現況

Blog 內容已完全遷移至自架的 Velite + MDX，**Medium 不再是內容來源**。

| 項目     | 說明                                                        |
| -------- | ----------------------------------------------------------- |
| 文章位置 | `apps/my-website/content/blog/*.mdx`                        |
| 已遷移   | 248 篇（231 已發佈 + 17 草稿）                              |
| 排除     | 11 篇（9 篇回覆、2 篇測試文，見 `exclude.ts`）              |
| 舊路由   | `/medium-blog` 與 `/api/medium-articles` 保留相容，不再維護 |

決策背景見 [ADR-007：自架 Blog](../adr/007-self-hosted-blog.md)。

## 新增文章

直接在 `apps/my-website/content/blog/` 建立 `.mdx` 檔案即可，不需要任何腳本：

```mdx
---
title: "文章標題"
slug: "文章標題"
description: "摘要，會用於 meta description（轉換器自動生成時截斷在 120 字）"
date: 2026-09-03
tags: ["velite", "mdx"]
draft: false
---

正文從這裡開始。
```

**slug 可以使用中文**。`velite.config.ts` 的驗證規則以 `\p{Letter}` 取代內建的 ASCII-only regex，
`getPostBySlug()` 也會先解碼路由傳入的 percent-encoded slug（見「已知限制」）。

## 重新執行轉換

僅在需要重新處理匯出檔時使用。原始 HTML 位於 `medium-source/`（已 gitignore，不進版控）。

```bash
cd apps/my-website

pnpm convert:medium-to-mdx                 # 轉換全部未轉換的文章
pnpm convert:medium-to-mdx --limit 10      # 只轉前 10 篇（分批驗收用）
pnpm convert:medium-to-mdx --only "Git"    # 只轉檔名含 "Git" 的
pnpm convert:medium-to-mdx --force         # 覆蓋已存在的 MDX
pnpm convert:medium-to-mdx --dry-run       # 只解析不寫檔
```

預設會跳過已存在的 MDX，所以可以分批轉換、逐批驗收。每次執行會更新根目錄的
`CONVERSION_CHECKLIST.md`，保留先前批次的項目與勾選狀態。

### 轉換器結構

`apps/my-website/scripts/medium-to-mdx/`：

| 檔案                     | 職責                                              |
| ------------------------ | ------------------------------------------------- |
| `index.ts`               | CLI 參數、批次流程、slug 衝突處理                 |
| `parse.ts`               | h-entry HTML → `ParsedPost`                       |
| `markdown-blocks.ts`     | 區塊層級轉換（`pre`、`figure`、列表、引言、標題） |
| `markdown-inline.ts`     | 行內轉換（連結、粗體、行內 code）                 |
| `output.ts`              | MDX 輸出與驗收清單                                |
| `exclude.ts`             | 排除清單（回覆、測試文）                          |
| `text.ts`                | 字串處理（跳脫、slug 化、截斷）                   |
| `config.ts` / `types.ts` | 常數與型別                                        |

## 已知限制

### GitHub Gist 內嵌 → 純連結

30 篇文章原本用 `<script src="gist.github.com/....js">` 內嵌 Gist。這個機制依賴
`document.write()`，瀏覽器對非同步載入的外部腳本會攔截，在 React 下不會顯示任何東西。
轉換時一律降級為純連結。

### 圖片仍指向 Medium CDN

739 張圖片沿用 `cdn-images-1.medium.com` 原始網址，未下載本地化。
長期依賴 Medium 服務可用性，追蹤於 [issue #124](https://github.com/u88803494/my-website/issues/124)。

### 多數程式碼區塊沒有語言標記

3437 個程式碼區塊中只有 52 個帶 `data-code-block-lang`（都是 2023 年後的文章）。
其餘不猜語言——猜錯的語法高亮比沒有高亮更糟。這些區塊仍有深色背景與等寬字型，
只是沒有 token 著色。

### 草稿沒有日期

Medium 匯出檔不記錄草稿的日期，17 篇草稿都 fallback 成匯出當天。
`getAllPosts()` 因此讓草稿排在已發佈文章之後，避免它們佔滿開發模式的列表。

### 中文 slug 的兩個陷阱

1. **路由查詢**：Next.js 傳入的 `params.slug` 是 percent-encoded，Velite 存的是原始中文，
   直接比對會找不到文章。`getPostBySlug()` 與 `getAdjacentPosts()` 都會先解碼。
2. **URL 一致性**：canonical、JSON-LD 的 `@id`、sitemap 三處都必須用
   `encodeURIComponent(post.slug)`，否則 Google 會收到看似不同的 URL 指向同一頁。

## 驗證

```bash
cd apps/my-website
pnpm content:build     # Velite 編譯全部 MDX，語法錯誤會在這裡現形
pnpm check             # 型別 + lint
pnpm build             # 確認 /blog/[slug] 為 SSG 且全部 slug 生成
```

`pnpm content:build` 對空內容的草稿會出現 `info The content is empty`，屬正常。
