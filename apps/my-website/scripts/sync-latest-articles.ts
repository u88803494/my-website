import axios from "axios";
import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import { JSDOM } from "jsdom";
import * as path from "path";

import { Article } from "../src/types/article.types";

// ==================== 類型定義 ====================

interface MediumPost {
  collection?: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    name: string;
    username: string;
  };
  extendedPreviewContent?: {
    subtitle: string;
  };
  firstPublishedAt: string;
  id: string;
  mediumUrl: string;
  previewImage?: {
    id: string;
  };
  title: string;
}

interface MediumGraphQLResponse {
  data: {
    userResult: {
      homepagePostsConnection: {
        posts: MediumPost[];
        pagingInfo: {
          next?: {
            from: string;
            limit: number;
          };
        };
      };
    };
  };
}

interface ArticleData {
  articleBody?: string;
  datePublished?: string;
  description?: string;
  headline?: string;
  image?: string | string[];
}

interface JsonLdArticle {
  "@type": string;
  articleBody?: string;
  datePublished?: string;
  description?: string;
  headline?: string;
  image?: string | string[];
}

interface Config {
  readonly DEFAULT_LIMIT: number;
  readonly DEFAULT_READ_TIME: string;
  readonly DESCRIPTION_MAX_LENGTH: number;
  readonly MEDIUM_GRAPHQL_URL: string;
  readonly REQUEST_DELAY: number;
  readonly USER_ID: string;
  readonly WORDS_PER_MINUTE: number;
}

type TagRules = {
  readonly [key: string]: readonly string[];
};

// ==================== 配置常量 ====================

const CONFIG: Config = {
  DEFAULT_LIMIT: 2,
  DEFAULT_READ_TIME: "5 min read",
  DESCRIPTION_MAX_LENGTH: 200,
  MEDIUM_GRAPHQL_URL: "https://hugh-program-learning-diary-js.medium.com/_/graphql",
  REQUEST_DELAY: 1000,
  USER_ID: "cd53d8c994f6",
  WORDS_PER_MINUTE: 200,
} as const;

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

const TAG_RULES: TagRules = {
  AI: ["ai", "artificial intelligence", "chatgpt", "gemini"],
  Architecture: ["架構", "architecture", "design pattern"],
  Backend: ["後端", "backend", "back-end", "server", "api"],
  Database: ["database", "資料庫", "sql", "mysql", "mongodb"],
  "Front End Development": ["前端", "frontend", "front-end", "css", "html"],
  Ithome: ["鐵人賽", "ithome", "it邦"],
  JavaScript: ["javascript", "js", "node"],
  Learning: ["學習", "learning", "教學"],
  Life: ["人生", "life", "生活", "心得"],
  Nextjs: ["next.js", "nextjs", "next js"],
  Performance: ["performance", "效能", "優化", "optimization"],
  Productivity: ["productivity", "生產力", "效率"],
  React: ["react", "jsx", "component"],
  Tutorial: ["教學", "tutorial", "guide", "指南"],
  TypeScript: ["typescript", "ts", "type"],
  "Web Development": ["web", "網站", "website"],
} as const;

// ==================== 工具函數 ====================

/**
 * 延遲執行
 */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 安全的 JSON 解析
 */
const safeJsonParse = (text: string): Record<string, unknown> | unknown[] | null => {
  try {
    return JSON.parse(text) as Record<string, unknown> | unknown[];
  } catch {
    return null;
  }
};

/**
 * 計算閱讀時間
 */
const calculateReadTime = (content: string): string => {
  const wordCount = content.split(/\s+/).length;
  return wordCount > 0
    ? `${Math.max(1, Math.ceil(wordCount / CONFIG.WORDS_PER_MINUTE))} min read`
    : CONFIG.DEFAULT_READ_TIME;
};

/**
 * 智能標籤分析
 */
const analyzeAndAssignTags = (title: string, content: string, description: string): string[] => {
  const text = (title + " " + content + " " + description).toLowerCase();
  const tags = new Set<string>();

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
 */
async function fetchLatestMediumUrls(limit: number = CONFIG.DEFAULT_LIMIT): Promise<string[]> {
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

    const response = await axios.post<MediumGraphQLResponse[]>(CONFIG.MEDIUM_GRAPHQL_URL, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
    });

    const posts = response.data[0]?.data?.userResult?.homepagePostsConnection?.posts || [];
    const urls = posts.map((post: MediumPost) => post.mediumUrl).filter(Boolean);

    console.log(`✅ 成功獲取 ${urls.length} 個文章 URL`);
    return urls;
  } catch (error) {
    console.error("❌ 獲取 Medium 文章 URL 失敗:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * 從 HTML 提取文章數據（多種方法 fallback）
 */
function extractArticleData(
  $: cheerio.CheerioAPI,
  document: Document,
): Omit<ArticleData, "image"> & { image?: string } {
  let articleData: Partial<ArticleData> = {};

  // 方法 1: 嘗試從 JSON-LD 取得結構化數據
  const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scriptTags) {
    const jsonData = safeJsonParse(script.textContent || "");
    if (!jsonData) continue;

    // 檢查是否為單一文章物件
    if (typeof jsonData === "object" && !Array.isArray(jsonData) && jsonData["@type"] === "Article") {
      articleData = jsonData as unknown as JsonLdArticle;
      break;
    }

    // 檢查是否為文章陣列
    if (Array.isArray(jsonData)) {
      const foundArticle = jsonData.find(
        (item): item is JsonLdArticle =>
          typeof item === "object" && item !== null && (item as JsonLdArticle)["@type"] === "Article",
      );
      if (foundArticle) {
        articleData = foundArticle;
        break;
      }
    }
  }

  // 方法 2: 從 meta tags 和 HTML 結構獲取數據（fallback）
  return {
    articleBody: articleData.articleBody || $("article").text() || $("main").text() || "",

    datePublished:
      articleData.datePublished ||
      $("time").first().attr("datetime") ||
      $('meta[property="article:published_time"]').attr("content") ||
      "",

    description:
      articleData.description ||
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "",

    headline:
      articleData.headline ||
      $("h1").first().text() ||
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "",

    image: Array.isArray(articleData.image)
      ? articleData.image[0]
      : articleData.image || $('meta[property="og:image"]').attr("content") || "",
  };
}

/**
 * 解析單篇文章
 */
async function parseArticle(url: string): Promise<Article | null> {
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
    const article: Article = {
      claps: undefined,
      description: description || "來自 Medium 的技術文章",
      publishedDate: articleData.datePublished
        ? new Date(articleData.datePublished).toISOString().split("T")[0] || ""
        : new Date().toISOString().split("T")[0] || "",
      readTime: calculateReadTime(articleData.articleBody || ""),
      subtitle: articleData.description || description || "",
      tags: tags.length > 0 ? tags : ["Medium", "Blog"],
      thumbnail: articleData.image || undefined,
      title: articleData.headline || "Medium 文章",
      url: url,
      views: undefined,
    };

    console.log(`✅ 成功解析文章: ${article.title}`);
    return article;
  } catch (error) {
    console.error(`❌ 解析文章失敗 ${url}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * 生成 TypeScript 文件內容
 */
function generateTsFileContent(articles: Article[]): string {
  return `/**
 * 最新 Medium 文章資料 (自動生成)
 * 
 * ⚠️  重要提醒：請勿手動編輯此文件！
 * 
 * 🔄 此文件由 scripts/sync-latest-articles.ts 自動生成
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
async function syncLatestArticles(): Promise<void> {
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
    const articles: Article[] = [];

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

    await fs.writeFile(outputPath, fileContent, "utf8");

    // 4. 輸出結果
    console.log("✅ 最新文章同步完成！");
    console.log(`📁 文件位置: ${outputPath}`);
    console.log(`📊 成功同步 ${articles.length} 篇文章:`);
    articles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
    });
  } catch (error) {
    console.error("❌ 同步最新文章失敗:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// ==================== 模組導出 ====================

// 如果直接執行此腳本
if (require.main === module) {
  syncLatestArticles();
}

export { syncLatestArticles, fetchLatestMediumUrls, parseArticle, analyzeAndAssignTags };
