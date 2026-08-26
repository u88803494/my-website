---
title: Medium 文章同步指南（Medium Article Sync Guide）
type: guide
status: stable
audience: [developer, ai]
tags: [medium, articles, automation, scripts, content]
created: 2026-08-26
updated: 2026-08-26
difficulty: beginner
estimated_time: 5 分鐘
related:
  - reference/api/medium-articles-api.md
  - adr/007-self-hosted-blog.md
ai_context: |
  Medium 文章自動解析系統的使用方式：維護 article-urls.json、執行同步腳本、
  以及產生 articleData.ts 的流程。注意 ADR-007 將改變此流程。
---

# 📝 Medium 文章自動解析系統

## 🚀 使用方式

### 1. 編輯文章列表

編輯根目錄的 `article-urls.json` 文件：

```json
{
  "articles": ["你的第一篇文章URL", "你的第二篇文章URL", "你的第三篇文章URL"]
}
```

### 2. 構建流程

**部署時自動解析：**

```bash
npm run build
```

**快速構建（跳過解析）：**

```bash
npm run build:fast
```

**手動解析：**

```bash
npm run parse:articles
```

## ⚡ 工作流程

1. 把 Medium URL 添加到 `article-urls.json`
2. 運行 `npm run parse:articles` 測試
3. 推送到 Git，部署時自動解析所有文章
4. 完成！

## 📂 檔案結構

```
├── article-urls.json          # 文章 URL 列表
├── src/data/articleData.ts    # 自動生成的文章資料
└── scripts/
    └── batch-parse-articles.js # 解析腳本
```
