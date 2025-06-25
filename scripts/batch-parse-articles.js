const axios = require("axios");
const cheerio = require("cheerio");

/**
 * 從 Medium 文章 URL 解析文章資訊
 */
async function parseMediumArticle(url) {
  try {
    console.log("正在獲取文章內容...");

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 10000,
      maxRedirects: 10,
    });

    const $ = cheerio.load(response.data);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      $("h1").first().text();

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    const image = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content");

    // 提取發布日期
    let publishedDate = null;
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
          try {
            publishedDate = new Date(dateValue).toISOString().split("T")[0];
            break;
          } catch (e) {
            continue;
          }
        }
      }
    }

    // 提取閱讀時間
    const readTimeText = $.html();
    const readTimeMatch = readTimeText.match(/(\d+)\s*min(?:ute)?s?\s*read/i);
    const readTime = readTimeMatch ? `${readTimeMatch[1]} min read` : "5 min read";

    // 提取 Medium 實際標籤
    const tags = [];

    // 嘗試多種標籤選擇器
    const tagSelectors = [
      'a[href*="/tag/"] div', // 標籤連結內的 div
      'a[rel*="follow"][href*="/tag/"]', // 標籤連結
      ".lw.dn.dz.el.lx.ly.lz.bf.b.bg.ab.bk.je", // 你提供的 class 組合
      '[data-discover="true"] div', // data-discover 屬性的標籤
    ];

    for (const selector of tagSelectors) {
      const tagElements = $(selector);
      tagElements.each((i, element) => {
        const tagText = $(element).text().trim();
        const parentHref = $(element).closest("a").attr("href");

        // 確保是標籤連結且有有效文字
        if (
          tagText &&
          tagText.length > 0 &&
          tagText.length < 30 && // 避免抓到太長的文字
          parentHref &&
          parentHref.includes("/tag/") &&
          !tags.includes(tagText)
        ) {
          tags.push(tagText);
        }
      });

      // 如果已經找到標籤就停止
      if (tags.length > 0) break;
    }

    console.log(`🏷️  抓取到的 Medium 標籤: ${tags.join(", ") || "無標籤"}`);

    // 如果沒有找到標籤，不使用假的技術標籤
    // 保持為空陣列或只加一個通用標籤

    // 提取副標題
    let subtitle = "";
    const h2Elements = $("h2");
    if (h2Elements.length > 0) {
      subtitle = h2Elements.first().text().trim();
    }

    const article = {
      title: cleanText(title) || "未知標題",
      subtitle: cleanText(subtitle) || "",
      publishedDate: publishedDate || new Date().toISOString().split("T")[0],
      readTime: readTime,
      url: url,
      tags: tags.slice(0, 6),
      description: cleanText(description) || "來自 Medium 的技術文章",
      thumbnail: image || "",
    };

    return article;
  } catch (error) {
    console.error("解析失敗:", error.message);
    return {
      title: "解析失敗 - 請手動輸入",
      subtitle: "",
      publishedDate: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      url: url,
      tags: ["Medium"],
      description: "請手動更新文章描述",
    };
  }
}

/**
 * 清理文字內容
 */
function cleanText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim().replace(/"/g, '\\"');
}
const fs = require("fs").promises;
const path = require("path");

/**
 * 從配置文件讀取文章 URL 列表
 */
async function loadArticleUrls() {
  try {
    const configPath = path.join(__dirname, "../article-urls.json");
    const configData = await fs.readFile(configPath, "utf8");
    const config = JSON.parse(configData);
    return config.articles || [];
  } catch (error) {
    console.warn("⚠️  無法讀取 article-urls.json，使用預設列表");
    return [
      "https://medium.com/@hugh-program-learning-diary-js/next-js-ai-%E4%B8%80%E5%A4%A9%E6%90%9E%E5%AE%9A%E5%80%8B%E4%BA%BA%E7%B6%B2%E7%AB%99-0dddd23f4db3",
    ];
  }
}

/**
 * 批量解析文章並生成 articleData.ts 文件
 */
async function batchParseArticles() {
  console.log("🚀 開始批量解析 Medium 文章...\n");

  // 從配置文件讀取 URL 列表
  const ARTICLE_URLS = await loadArticleUrls();

  if (ARTICLE_URLS.length === 0) {
    console.log("📋 沒有找到文章 URL，請在 article-urls.json 中添加文章 URL");
    return;
  }

  console.log(`📚 找到 ${ARTICLE_URLS.length} 篇文章待解析\n`);

  const articles = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < ARTICLE_URLS.length; i++) {
    const url = ARTICLE_URLS[i];
    console.log(`📖 正在解析第 ${i + 1} 篇文章...`);
    console.log(`🔗 URL: ${url}\n`);

    try {
      const article = await parseMediumArticle(url);
      articles.push(article);
      successCount++;

      console.log(`✅ 解析成功: ${article.title}`);
      console.log(`📅 發布日期: ${article.publishedDate}`);
      console.log(`🏷️  標籤: ${article.tags.join(", ")}`);
      console.log(`⏱️  閱讀時間: ${article.readTime}\n`);

      // 添加延遲避免請求過於頻繁
      if (i < ARTICLE_URLS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ 解析失敗: ${error.message}\n`);
      failCount++;
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
  console.log(`✅ 成功解析: ${successCount} 篇文章`);
  console.log(`❌ 解析失敗: ${failCount} 篇文章`);
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
 * 生成 articleData.ts 文件內容
 */
function generateArticleDataFile(articles) {
  // 頂部註解說明
  const headerComments = `/**
 * Medium 文章資料文件
 * 
 * ⚠️  重要提醒：請勿手動編輯此文件中的文章資料！
 * 
 * 🚀 自動化更新方式：
 * 1. 將新的 Medium 文章 URL 添加到根目錄的 \`article-urls.json\` 文件中
 * 2. 執行腳本：\`node scripts/batch-parse-articles.js\`
 * 3. 腳本會自動解析文章資訊並更新此文件
 * 
 * 📝 腳本功能：
 * - 自動抓取文章標題、副標題、發布日期、閱讀時間
 * - 自動提取文章描述和縮圖
 * - 自動分析並標記技術標籤
 * - 保持資料格式一致性
 * 
 * 🔄 更新流程：
 * article-urls.json → batch-parse-articles.js → articleData.ts (此文件)
 * 
 * 💡 如需修改文章資料，請修改腳本邏輯，而非直接編輯此文件
 */`;

  const imports = `import { Article } from '@/types/article.types';`;

  const articlesArray = articles
    .map((article) => {
      const thumbnail = article.thumbnail ? `,\n    thumbnail: "${article.thumbnail}"` : "";

      return `  {
    title: "${article.title}",
    subtitle: "${article.subtitle}",
    publishedDate: "${article.publishedDate}",
    readTime: "${article.readTime}",
    url: "${article.url}",
    tags: [${article.tags.map((tag) => `"${tag}"`).join(", ")}],
    description: "${article.description}"${thumbnail}
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
 * 主函數
 */
async function main() {
  console.log("🔥 Medium 文章批量解析工具");
  console.log("=".repeat(40));

  try {
    await batchParseArticles();
  } catch (error) {
    console.error("💥 批量解析過程中發生錯誤:", error);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

module.exports = { batchParseArticles };
