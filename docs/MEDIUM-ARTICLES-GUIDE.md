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
