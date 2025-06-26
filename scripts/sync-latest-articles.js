const axios = require("axios");
const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

// ==================== 配置常量 ====================
const CONFIG = {
  MEDIUM_GRAPHQL_URL: "https://hugh-program-learning-diary-js.medium.com/_/graphql",
  USER_ID: "cd53d8c994f6",
  DEFAULT_LIMIT: 2,
  REQUEST_DELAY: 1000, // 請求間隔毫秒
  DESCRIPTION_MAX_LENGTH: 200,
  DEFAULT_READ_TIME: "5 min read",
  WORDS_PER_MINUTE: 200,
};

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ==================== GraphQL Query ====================
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

// ==================== 標籤分析配置 ====================
const TAG_RULES = {
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

// ==================== 工具函數 ====================

/**
 * 延遲執行
 * @param {number} ms 毫秒數
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 安全的 JSON 解析
 * @param {string} text JSON 字串
 * @returns {Object|null} 解析結果或 null
 */
const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * 計算閱讀時間
 * @param {string} content 文章內容
 * @returns {string} 閱讀時間
 */
const calculateReadTime = (content) => {
  const wordCount = content.split(/\s+/).length;
  return wordCount > 0
    ? `${Math.max(1, Math.ceil(wordCount / CONFIG.WORDS_PER_MINUTE))} min read`
    : CONFIG.DEFAULT_READ_TIME;
};

/**
 * 智能標籤分析
 * @param {string} title 標題
 * @param {string} content 內容
 * @param {string} description 描述
 * @returns {string[]} 標籤陣列
 */
const analyzeAndAssignTags = (title, content, description) => {
  const text = (title + " " + content + " " + description).toLowerCase();
  const tags = new Set();

  for (const [tag, keywords] of Object.entries(TAG_RULES)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      tags.add(tag);
    }
  }

  return Array.from(tags).slice(0, 5);
};

// ==================== 核心功能函數 ====================

/**
 * 從 Medium API 獲取最新文章 URL
 * @param {number} limit 文章數量限制
 * @returns {Promise<string[]>} 文章 URL 陣列
 */
async function fetchLatestMediumUrls(limit = CONFIG.DEFAULT_LIMIT) {
  try {
    console.log(`🔍 正在從 Medium API 獲取最新 ${limit} 篇文章...`);

    const payload = [
      {
        operationName: "UserProfileQuery",
        query: GRAPHQL_QUERY,
        variables: {
          homepagePostsFrom: null,
          homepagePostsLimit: limit,
          id: CONFIG.USER_ID,
        },
      },
    ];

    const response = await axios.post(CONFIG.MEDIUM_GRAPHQL_URL, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
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
 * 從 HTML 提取文章數據（多種方法 fallback）
 * @param {CheerioAPI} $ Cheerio 實例
 * @param {Document} document DOM 文件
 * @returns {Object} 文章數據
 */
function extractArticleData($, document) {
  let articleData = {};

  // 方法 1: 嘗試從 JSON-LD 取得結構化數據
  const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scriptTags) {
    const jsonData = safeJsonParse(script.textContent);
    if (
      jsonData?.["@type"] === "Article" ||
      (Array.isArray(jsonData) && jsonData.some((item) => item["@type"] === "Article"))
    ) {
      articleData = Array.isArray(jsonData) ? jsonData.find((item) => item["@type"] === "Article") : jsonData;
      break;
    }
  }

  // 方法 2: 從 meta tags 和 HTML 結構獲取數據（fallback）
  return {
    headline:
      articleData.headline ||
      $("h1").first().text() ||
      $('meta[property="og:title"]').attr("content") ||
      $("title").text(),

    description:
      articleData.description ||
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content"),

    datePublished:
      articleData.datePublished ||
      $("time").first().attr("datetime") ||
      $('meta[property="article:published_time"]').attr("content"),

    image: articleData.image?.[0] || $('meta[property="og:image"]').attr("content"),

    articleBody: articleData.articleBody || $("article").text() || $("main").text() || "",
  };
}

/**
 * 解析單篇文章
 * @param {string} url 文章 URL
 * @returns {Promise<Object|null>} 解析後的文章數據或 null
 */
async function parseArticle(url) {
  try {
    console.log(`📖 正在解析文章: ${url}`);

    const response = await axios.get(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    const $ = cheerio.load(response.data);
    const dom = new JSDOM(response.data);

    const articleData = extractArticleData($, dom.window.document);

    // 處理描述
    const description = (articleData.description || "").substring(0, CONFIG.DESCRIPTION_MAX_LENGTH);

    // 分析標籤
    const tags = analyzeAndAssignTags(articleData.headline || "", articleData.articleBody || "", description);

    // 構建文章物件
    const article = {
      claps: undefined,
      description: description || "來自 Medium 的技術文章",
      publishedDate: articleData.datePublished
        ? new Date(articleData.datePublished).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      readTime: calculateReadTime(articleData.articleBody || ""),
      subtitle: articleData.description || description || "",
      tags: tags.length > 0 ? tags : ["Medium", "Blog"],
      thumbnail: articleData.image,
      title: articleData.headline || "Medium 文章",
      url: url,
      views: undefined,
    };

    console.log(`✅ 成功解析文章: ${article.title}`);
    return article;
  } catch (error) {
    console.error(`❌ 解析文章失敗 ${url}:`, error.message);
    return null;
  }
}

/**
 * 生成 TypeScript 文件內容
 * @param {Object[]} articles 文章陣列
 * @returns {string} 文件內容
 */
function generateTsFileContent(articles) {
  return `/**
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
}

// ==================== 主要執行函數 ====================

/**
 * 主要同步函數
 */
async function syncLatestArticles() {
  try {
    console.log("🚀 開始同步最新 Medium 文章...");

    // 1. 獲取最新文章 URL
    const latestUrls = await fetchLatestMediumUrls();

    if (latestUrls.length === 0) {
      console.log("⚠️  未獲取到文章 URL，跳過同步");
      return;
    }

    // 2. 解析每篇文章
    console.log(`📚 開始解析 ${latestUrls.length} 篇文章...`);
    const articles = [];

    for (const [index, url] of latestUrls.entries()) {
      const article = await parseArticle(url);
      if (article) {
        articles.push(article);
      }

      // 避免過於頻繁的請求
      if (index < latestUrls.length - 1) {
        await delay(CONFIG.REQUEST_DELAY);
      }
    }

    if (articles.length === 0) {
      console.log("⚠️  未成功解析任何文章，跳過同步");
      return;
    }

    // 3. 生成並寫入 TypeScript 文件
    const outputPath = path.join(__dirname, "../src/data/latestArticles.ts");
    const fileContent = generateTsFileContent(articles);

    fs.writeFileSync(outputPath, fileContent, "utf8");

    // 4. 輸出結果
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

// ==================== 模組導出 ====================

// 如果直接執行此腳本
if (require.main === module) {
  syncLatestArticles();
}

module.exports = {
  syncLatestArticles,
  fetchLatestMediumUrls,
  parseArticle,
  analyzeAndAssignTags,
};
