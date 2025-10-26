import axios from "axios";
import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import * as path from "path";

import type { Article, ArticleConfig, ParseStats } from "./types";

// ==================== 配置常量 ====================

const CONFIG = {
  DEFAULT_READ_TIME: "5 min read",
  MAX_REDIRECTS: 10,
  MAX_TAG_COUNT: 6,
  REQUEST_DELAY: 2000,
  REQUEST_TIMEOUT: 10000,
} as const;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

// ==================== 工具函數 ====================

/**
 * 延遲執行
 */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 清理文字內容
 */
function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim().replace(/"/g, '\\"');
}

/**
 * 安全的日期解析
 */
function parseDate(dateValue: string | undefined): string {
  if (!dateValue) return new Date().toISOString().split("T")[0] ?? "";

  try {
    return new Date(dateValue).toISOString().split("T")[0] ?? "";
  } catch {
    return new Date().toISOString().split("T")[0] ?? "";
  }
}

/**
 * 提取閱讀時間
 */
function extractReadTime(html: string): string {
  const readTimeMatch = html.match(/(\d+)\s*min(?:ute)?s?\s*read/i);
  return readTimeMatch ? `${readTimeMatch[1]} min read` : CONFIG.DEFAULT_READ_TIME;
}

// ==================== 核心功能函數 ====================

/**
 * 從 Medium 文章 URL 解析文章資訊
 */
async function parseMediumArticle(url: string): Promise<Article> {
  try {
    console.log("正在獲取文章內容...");

    const response = await axios.get(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "User-Agent": USER_AGENT,
      },
      maxRedirects: CONFIG.MAX_REDIRECTS,
      timeout: CONFIG.REQUEST_TIMEOUT,
    });

    const $ = cheerio.load(response.data);

    // 提取標題
    const title =
      cleanText(
        $('meta[property="og:title"]').attr("content") ||
          $('meta[name="twitter:title"]').attr("content") ||
          $("title").text() ||
          $("h1").first().text(),
      ) || "未知標題";

    // 提取描述
    const description =
      cleanText(
        $('meta[property="og:description"]').attr("content") ||
          $('meta[name="twitter:description"]').attr("content") ||
          $('meta[name="description"]').attr("content"),
      ) || "來自 Medium 的技術文章";

    // 提取圖片
    const thumbnail =
      $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content") || undefined;

    // 提取發布日期
    let publishedDate: string | undefined;
    const dateSelectors = [
      'meta[property="article:published_time"]',
      "time[datetime]",
      '[data-testid="storyPublishDate"]',
    ];

    for (const selector of dateSelectors) {
      const dateElement = $(selector).first();
      if (dateElement.length > 0) {
        const dateValue = dateElement.attr("datetime") || dateElement.attr("content") || dateElement.text();
        if (dateValue) {
          publishedDate = parseDate(dateValue);
          break;
        }
      }
    }

    // 提取閱讀時間
    const readTime = extractReadTime($.html());

    // 提取 Medium 實際標籤
    const tags: string[] = [];
    const tagSelectors = [
      'a[href*="/tag/"] div',
      'a[rel*="follow"][href*="/tag/"]',
      ".lw.dn.dz.el.lx.ly.lz.bf.b.bg.ab.bk.je",
      '[data-discover="true"] div',
    ];

    for (const selector of tagSelectors) {
      const tagElements = $(selector);
      tagElements.each((_i, element) => {
        const tagText = $(element).text().trim();
        const parentHref = $(element).closest("a").attr("href");

        if (
          tagText &&
          tagText.length > 0 &&
          tagText.length < 30 &&
          parentHref &&
          parentHref.includes("/tag/") &&
          !tags.includes(tagText)
        ) {
          tags.push(tagText);
        }
      });

      if (tags.length > 0) break;
    }

    console.log(`🏷️  抓取到的 Medium 標籤: ${tags.join(", ") || "無標籤"}`);

    // 提取副標題
    const subtitle = cleanText($("h2").first().text()) || "";

    const article: Article = {
      claps: undefined,
      description,
      publishedDate: publishedDate || new Date().toISOString().split("T")[0] || "",
      readTime,
      subtitle,
      tags: tags.slice(0, CONFIG.MAX_TAG_COUNT),
      thumbnail,
      title,
      url,
      views: undefined,
    };

    return article;
  } catch (error) {
    console.error("解析失敗:", error instanceof Error ? error.message : String(error));

    // 返回錯誤時的預設文章
    return {
      claps: undefined,
      description: "請手動更新文章描述",
      publishedDate: new Date().toISOString().split("T")[0] || "",
      readTime: CONFIG.DEFAULT_READ_TIME,
      subtitle: "",
      tags: ["Medium"],
      title: "解析失敗 - 請手動輸入",
      url,
      views: undefined,
    };
  }
}

/**
 * 從配置文件讀取文章 URL 列表
 */
async function loadArticleUrls(): Promise<string[]> {
  try {
    const configPath = path.join(__dirname, "../article-urls.json");
    const configData = await fs.readFile(configPath, "utf8");
    const config: ArticleConfig = JSON.parse(configData);
    return config.articles || [];
  } catch {
    console.warn("⚠️  無法讀取 article-urls.json，使用預設列表");
    return [
      "https://medium.com/@hugh-program-learning-diary-js/next-js-ai-%E4%B8%80%E5%A4%A9%E6%90%9E%E5%AE%9A%E5%80%8B%E4%BA%BA%E7%B6%B2%E7%AB%99-0dddd23f4db3",
    ];
  }
}

/**
 * 生成 articleData.ts 文件內容
 */
function generateArticleDataFile(articles: Article[]): string {
  const headerComments = `/**
 * Medium 文章資料文件
 * 
 * ⚠️  重要提醒：請勿手動編輯此文件中的文章資料！
 * 
 * 🚀 自動化更新方式：
 * 1. 將新的 Medium 文章 URL 添加到根目錄的 \`article-urls.json\` 文件中
 * 2. 執行腳本：\`npm run parse:articles\` 或 \`node scripts/batch-parse-articles.ts\`
 * 3. 腳本會自動解析文章資訊並更新此文件
 * 
 * 📝 腳本功能：
 * - 自動抓取文章標題、副標題、發布日期、閱讀時間
 * - 自動提取文章描述和縮圖
 * - 自動分析並標記技術標籤
 * - 保持資料格式一致性
 * 
 * 🔄 更新流程：
 * article-urls.json → batch-parse-articles.ts → articleData.ts (此文件)
 * 
 * 💡 如需修改文章資料，請修改腳本邏輯，而非直接編輯此文件
 */`;

  const imports = `import type { Article } from '@/types/article.types';`;

  const articlesArray = articles
    .map((article) => {
      const thumbnail = article.thumbnail ? `,\n    thumbnail: "${article.thumbnail}"` : "";

      return `  {
    description: "${article.description}",
    publishedDate: "${article.publishedDate}",
    readTime: "${article.readTime}",
    subtitle: "${article.subtitle}",
    tags: [${article.tags.map((tag) => `"${tag}"`).join(", ")}]${thumbnail},
    title: "${article.title}",
    url: "${article.url}"
  }`;
    })
    .join(",\n");

  return `${headerComments}

${imports}

export const articleList: Article[] = [
${articlesArray}
];`;
}

/**
 * 批量解析文章並生成 articleData.ts 文件
 */
async function batchParseArticles(): Promise<void> {
  console.log("🚀 開始批量解析 Medium 文章...\n");

  // 從配置文件讀取 URL 列表
  const articleUrls = await loadArticleUrls();

  if (articleUrls.length === 0) {
    console.log("📋 沒有找到文章 URL，請在 article-urls.json 中添加文章 URL");
    return;
  }

  console.log(`📚 找到 ${articleUrls.length} 篇文章待解析\n`);

  const articles: Article[] = [];
  const stats: ParseStats = {
    failed: 0,
    success: 0,
    total: articleUrls.length,
  };

  for (let i = 0; i < articleUrls.length; i++) {
    const url = articleUrls[i];
    if (!url) continue;

    console.log(`📖 正在解析第 ${i + 1} 篇文章...`);
    console.log(`🔗 URL: ${url}\n`);

    try {
      const article = await parseMediumArticle(url);
      if (article.url) {
        articles.push(article);
        stats.success++;

        console.log(`✅ 解析成功: ${article.title}`);
        console.log(`📅 發布日期: ${article.publishedDate}`);
        console.log(`🏷️  標籤: ${article.tags.join(", ")}`);
        console.log(`⏱️  閱讀時間: ${article.readTime}\n`);

        // 添加延遲避免請求過於頻繁
        if (i < articleUrls.length - 1) {
          await delay(CONFIG.REQUEST_DELAY);
        }
      }
    } catch (error) {
      console.error(`❌ 解析失敗: ${error instanceof Error ? error.message : String(error)}\n`);
      stats.failed++;
    }
  }

  if (articles.length === 0) {
    console.log("😔 沒有成功解析任何文章");
    return;
  }

  // 生成 TypeScript 代碼
  const articleDataContent = generateArticleDataFile(articles);

  // 寫入文件
  const outputPath = path.join(__dirname, "../src/data/articleData.ts");
  await fs.writeFile(outputPath, articleDataContent, "utf8");

  console.log("🎉 批量解析完成！");
  console.log(`✅ 成功解析: ${stats.success} 篇文章`);
  console.log(`❌ 解析失敗: ${stats.failed} 篇文章`);
  console.log(`💾 文件已更新: ${outputPath}`);

  // 顯示生成的文章摘要
  console.log("\n📚 解析的文章列表:");
  console.log("=".repeat(50));
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   📅 ${article.publishedDate} | ⏱️ ${article.readTime}`);
    console.log(`   🏷️ ${article.tags.join(", ")}`);
    console.log("");
  });
}

/**
 * 主函數
 */
async function main(): Promise<void> {
  console.log("🔥 Medium 文章批量解析工具");
  console.log("=".repeat(40));

  try {
    await batchParseArticles();
  } catch (error) {
    console.error("💥 批量解析過程中發生錯誤:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// ==================== 模組導出 ====================

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

export { batchParseArticles, loadArticleUrls, parseMediumArticle };
