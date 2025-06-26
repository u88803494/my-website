const axios = require("axios");
const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

// Medium GraphQL API 設定
const MEDIUM_GRAPHQL_URL = "https://hugh-program-learning-diary-js.medium.com/_/graphql";
const USER_ID = "cd53d8c994f6";

// GraphQL Query
const GRAPHQL_QUERY = `query UserProfileQuery($id: ID, $username: ID, $homepagePostsLimit: PaginationLimit, $homepagePostsFrom: String = null) { 
  userResult(id: $id, username: $username) { 
    __typename 
    ... on User { 
      id 
      ...UserProfileScreen_user 
    } 
  } 
} 

fragment UserProfileScreen_user on User { 
  __typename 
  id 
  ...PublisherHomepagePosts_publisher 
} 

fragment PublisherHomepagePosts_publisher on Publisher { 
  homepagePostsConnection(paging: {limit: $homepagePostsLimit, from: $homepagePostsFrom}) { 
    posts { 
      ...StreamPostPreview_post 
    } 
    pagingInfo { 
      next { 
        from 
        limit 
        __typename 
      } 
      __typename 
    } 
    __typename 
  } 
} 

fragment StreamPostPreview_post on Post { 
  id 
  title 
  mediumUrl 
  firstPublishedAt 
  previewImage { 
    id 
    __typename 
  } 
  extendedPreviewContent { 
    subtitle 
    __typename 
  } 
  creator { 
    id 
    name 
    username 
    __typename 
  } 
  collection { 
    id 
    name 
    __typename 
  } 
}`;

/**
 * 從 Medium API 獲取最新文章 URL
 */
async function fetchLatestMediumUrls(limit = 2) {
  try {
    console.log(`🔍 正在從 Medium API 獲取最新 ${limit} 篇文章...`);

    const payload = [
      {
        operationName: "UserProfileQuery",
        query: GRAPHQL_QUERY,
        variables: {
          homepagePostsFrom: null,
          homepagePostsLimit: limit,
          id: USER_ID,
        },
      },
    ];

    const response = await axios.post(MEDIUM_GRAPHQL_URL, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const posts = response.data[0]?.data?.userResult?.homepagePostsConnection?.posts || [];
    const urls = posts.map((post) => post.mediumUrl).filter(Boolean);

    console.log(`✅ 成功獲取 ${urls.length} 個文章 URL`);
    return urls;
  } catch (error) {
    console.error("❌ 獲取 Medium 文章 URL 失敗:", error.message);
    return [];
  }
}

/**
 * 解析單篇文章（從現有腳本複製邏輯）
 */
async function parseArticle(url) {
  try {
    console.log(`📖 正在解析文章: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(response.data);

    // 多種方式嘗試獲取文章數據
    let articleData = {};

    // 方法 1: 嘗試從 JSON-LD 取得結構化數據
    const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scriptTags) {
      try {
        const jsonData = JSON.parse(script.textContent);
        if (
          jsonData["@type"] === "Article" ||
          (Array.isArray(jsonData) && jsonData.some((item) => item["@type"] === "Article"))
        ) {
          articleData = Array.isArray(jsonData) ? jsonData.find((item) => item["@type"] === "Article") : jsonData;
          break;
        }
      } catch {
        continue;
      }
    }

    // 方法 2: 從 meta tags 和 HTML 結構獲取數據（fallback）
    if (!articleData.headline) {
      articleData.headline =
        $("h1").first().text() || $('meta[property="og:title"]').attr("content") || $("title").text();
    }

    if (!articleData.description) {
      articleData.description =
        $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content");
    }

    if (!articleData.datePublished) {
      // 嘗試從各種可能的地方獲取日期
      const timeElement =
        $("time").first().attr("datetime") || $('meta[property="article:published_time"]').attr("content");
      if (timeElement) {
        articleData.datePublished = timeElement;
      }
    }

    if (!articleData.image) {
      const ogImage = $('meta[property="og:image"]').attr("content");
      if (ogImage) {
        articleData.image = [ogImage];
      }
    }

    // 嘗試取得文章描述
    let description = "";
    const metaDescription =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      articleData.description ||
      "";

    if (metaDescription) {
      description = metaDescription.substring(0, 200);
    }

    // 智能標籤分析
    const content = articleData.articleBody || $("article").text() || $("main").text() || "";
    const title = articleData.headline || $("h1").first().text() || $("title").text() || "";
    const tags = analyzeAndAssignTags(title, content, description);

    // 估算閱讀時間（如果沒有內容，使用預設值）
    const wordCount = content.split(/\s+/).length;
    const readTime = wordCount > 0 ? `${Math.max(1, Math.ceil(wordCount / 200))} min read` : "5 min read";

    const article = {
      title: title || "Medium 文章",
      subtitle: articleData.description || description || "",
      description: description || "來自 Medium 的技術文章",
      url: url,
      publishedDate: articleData.datePublished
        ? new Date(articleData.datePublished).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      readTime: readTime,
      thumbnail: articleData.image?.[0] || $('meta[property="og:image"]').attr("content"),
      tags: tags.length > 0 ? tags : ["Medium", "Blog"],
      views: undefined,
      claps: undefined,
    };

    console.log(`✅ 成功解析文章: ${article.title}`);
    return article;
  } catch (error) {
    console.error(`❌ 解析文章失敗 ${url}:`, error.message);
    return null;
  }
}

/**
 * 智能標籤分析（從現有腳本複製）
 */
function analyzeAndAssignTags(title, content, description) {
  const text = (title + " " + content + " " + description).toLowerCase();
  const tags = new Set();

  const tagRules = {
    Nextjs: ["next.js", "nextjs", "next js"],
    React: ["react", "jsx", "component"],
    TypeScript: ["typescript", "ts", "type"],
    JavaScript: ["javascript", "js", "node"],
    "Front End Development": ["前端", "frontend", "front-end", "css", "html"],
    Backend: ["後端", "backend", "back-end", "server", "api"],
    Database: ["database", "資料庫", "sql", "mysql", "mongodb"],
    Architecture: ["架構", "architecture", "design pattern"],
    Performance: ["performance", "效能", "優化", "optimization"],
    AI: ["ai", "artificial intelligence", "chatgpt", "gemini"],
    Life: ["人生", "life", "生活", "心得"],
    Learning: ["學習", "learning", "教學"],
    Productivity: ["productivity", "生產力", "效率"],
    "Web Development": ["web", "網站", "website"],
    Ithome: ["鐵人賽", "ithome", "it邦"],
    Tutorial: ["教學", "tutorial", "guide", "指南"],
  };

  for (const [tag, keywords] of Object.entries(tagRules)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      tags.add(tag);
    }
  }

  return Array.from(tags).slice(0, 5);
}

/**
 * 主要同步函數
 */
async function syncLatestArticles() {
  try {
    console.log("🚀 開始同步最新 Medium 文章...");

    // 1. 獲取最新 2 篇文章 URL
    const latestUrls = await fetchLatestMediumUrls(2);

    if (latestUrls.length === 0) {
      console.log("⚠️  未獲取到文章 URL，跳過同步");
      return;
    }

    // 2. 解析每篇文章
    const articles = [];
    for (const url of latestUrls) {
      const article = await parseArticle(url);
      if (article) {
        articles.push(article);
      }
      // 添加延遲避免過於頻繁的請求
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (articles.length === 0) {
      console.log("⚠️  未成功解析任何文章，跳過同步");
      return;
    }

    // 3. 生成 TypeScript 文件
    const outputPath = path.join(__dirname, "../src/data/latestArticles.ts");
    const fileContent = `/**
 * 最新 Medium 文章資料 (自動生成)
 * 
 * ⚠️  重要提醒：請勿手動編輯此文件！
 * 
 * 🔄 此文件由 scripts/sync-latest-articles.js 自動生成
 * 📅 最後更新時間: ${new Date().toLocaleString("zh-TW")}
 * 📰 包含最新 ${articles.length} 篇文章
 */

import { Article } from "@/types/article.types";

export const latestArticles: Article[] = ${JSON.stringify(articles, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent, "utf8");

    console.log("✅ 最新文章同步完成！");
    console.log(`📁 文件位置: ${outputPath}`);
    console.log(`📊 成功同步 ${articles.length} 篇文章:`);
    articles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
    });
  } catch (error) {
    console.error("❌ 同步最新文章失敗:", error);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  syncLatestArticles();
}

module.exports = { syncLatestArticles };
