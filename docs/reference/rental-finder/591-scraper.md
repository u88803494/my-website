# 591 租屋網爬蟲邏輯

使用 Playwright 爬取 591 租屋網資料，作為 Facebook 社團的輔助資料來源。

---

## 技術架構

### 工具選擇

- **Playwright**：現代化瀏覽器自動化工具
- **優勢**：
  - ✅ 處理 JavaScript 動態渲染
  - ✅ 自動等待元素載入
  - ✅ 支援多種瀏覽器
  - ✅ 強大的選擇器引擎

---

## 591 網站結構分析

### URL Pattern

```
基礎搜尋 URL：
https://rent.591.com.tw/home/search/rsList

參數說明：
- kind: 租屋類型（0=不限, 1=整層, 2=獨立套房, 3=分租套房, 4=雅房）
- region: 地區（1=台北市）
- section: 行政區（multiple）
- price: 價格範圍
- area: 坪數範圍
- hasimg: 只顯示有圖（1）
```

### 目標 URL（符合需求）

```
https://rent.591.com.tw/home/search/rsList?
  kind=0&                    // 不限類型
  region=1&                  // 台北市
  section=7,9,10,11,16&      // 中山,松山,中正,文山,信義
  price=0_12000&             // 租金 ≤12000
  hasimg=1                   // 有圖片
```

### 行政區代碼對照

```typescript
const TAIPEI_DISTRICTS = {
  中山區: 7,
  松山區: 9,
  中正區: 10,
  文山區: 11,
  信義區: 16,
  大安區: 8,
  萬華區: 5,
  南港區: 3,
  內湖區: 2,
  士林區: 1,
  北投區: 4,
  大同區: 6,
};
```

---

## 爬蟲流程

### 1. 初始化 Playwright

```typescript
import { chromium, Browser, Page } from "playwright";

async function initBrowser(): Promise<{ browser: Browser; page: Page }> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "zh-TW",
  });

  const page = await context.newPage();

  return { browser, page };
}
```

### 2. 搜尋租屋列表

```typescript
async function searchRentals(criteria: SearchCriteria) {
  const { browser, page } = await initBrowser();

  try {
    // 建構搜尋 URL
    const searchUrl = buildSearchUrl(criteria);

    // 前往搜尋頁面
    await page.goto(searchUrl, { waitUntil: "networkidle" });

    // 等待列表載入
    await page.waitForSelector(".vue-list-rent-item", { timeout: 10000 });

    // 擷取租屋列表
    const listings = await extractListings(page);

    return listings;
  } finally {
    await browser.close();
  }
}

function buildSearchUrl(criteria: SearchCriteria): string {
  const baseUrl = "https://rent.591.com.tw/home/search/rsList";
  const params = new URLSearchParams({
    kind: "0", // 不限類型
    region: "1", // 台北市
    section: criteria.districts.map((d) => TAIPEI_DISTRICTS[d]).join(","),
    price: `0_${criteria.maxPrice}`,
    hasimg: "1",
  });

  return `${baseUrl}?${params.toString()}`;
}
```

### 3. 擷取列表資料

```typescript
async function extractListings(page: Page) {
  return await page.$$eval(".vue-list-rent-item", (items) => {
    return items.map((item) => {
      // 標題
      const titleEl = item.querySelector(".rent-item-title");
      const title = titleEl?.textContent?.trim() || "";

      // 價格
      const priceEl = item.querySelector(".rent-item-price");
      const priceText = priceEl?.textContent?.trim() || "";
      const price = parseInt(priceText.replace(/[^\d]/g, ""));

      // 地區
      const locationEl = item.querySelector(".rent-item-region");
      const location = locationEl?.textContent?.trim() || "";

      // 圖片
      const imgEl = item.querySelector("img");
      const image = imgEl?.src || "";

      // 連結
      const linkEl = item.querySelector("a");
      const url = linkEl?.href || "";

      // 標籤（例如：電梯、獨立電表）
      const tags = Array.from(item.querySelectorAll(".rent-item-tag")).map(
        (tag) => tag.textContent?.trim() || "",
      );

      return {
        title,
        price,
        location,
        image,
        url,
        tags,
        scrapedAt: new Date().toISOString(),
      };
    });
  });
}
```

### 4. 擷取詳細資訊

```typescript
async function getListingDetails(url: string) {
  const { browser, page } = await initBrowser();

  try {
    await page.goto(url, { waitUntil: "networkidle" });

    // 等待詳細資料載入
    await page.waitForSelector(".house-detail", { timeout: 10000 });

    // 擷取詳細資訊
    const details = await page.evaluate(() => {
      // 地址
      const addressEl = document.querySelector(".house-address");
      const address = addressEl?.textContent?.trim() || "";

      // 坪數
      const areaEl = document.querySelector(
        '.house-info-item:has-text("坪數")',
      );
      const area = areaEl?.textContent?.match(/[\d.]+/)?.[0] || "";

      // 格局
      const layoutEl = document.querySelector(
        '.house-info-item:has-text("格局")',
      );
      const layout = layoutEl?.textContent?.trim() || "";

      // 樓層
      const floorEl = document.querySelector(
        '.house-info-item:has-text("樓層")',
      );
      const floor = floorEl?.textContent?.trim() || "";

      // 設備
      const facilities = Array.from(
        document.querySelectorAll(".house-facility-item"),
      ).map((item) => item.textContent?.trim() || "");

      // 說明
      const descEl = document.querySelector(".house-description");
      const description = descEl?.textContent?.trim() || "";

      // 圖片
      const images = Array.from(
        document.querySelectorAll(".house-photo img"),
      ).map((img) => img.src);

      return {
        address,
        area: parseFloat(area),
        layout,
        floor,
        facilities,
        description,
        images,
      };
    });

    return details;
  } finally {
    await browser.close();
  }
}
```

---

## 深度條件過濾

### 自動檢查詳細需求

```typescript
interface UserCriteria {
  // 必要條件
  mustHave: {
    水泥隔間: boolean;
    硫化銅門: boolean;
    獨立電表或低電費: boolean; // ≤6元
    對外窗: boolean;
  };

  // 加分條件
  niceToHave: {
    浴室對外窗: boolean;
    電梯: boolean;
    非一樓: boolean;
    變頻冷暖空調: boolean;
  };
}

async function checkDetailedCriteria(
  listing: RentalListing,
  criteria: UserCriteria,
): Promise<{ matches: boolean; score: number; reasons: string[] }> {
  // 擷取詳細資訊
  const details = await getListingDetails(listing.url);
  const fullText = `${listing.title} ${details.description} ${details.facilities.join(" ")}`;

  const reasons: string[] = [];
  let score = 0;

  // 檢查必要條件（每項 25 分）
  const mustHaveChecks = {
    水泥隔間: /水泥隔間|實體隔間|RC隔間/.test(fullText),
    硫化銅門: /硫化銅門|防火門|金屬門/.test(fullText),
    獨立電表或低電費:
      /獨立電表/.test(fullText) || fullText.match(/電費[^\d]*([1-6])元/),
    對外窗: /對外窗|採光佳|自然光/.test(fullText),
  };

  for (const [key, matches] of Object.entries(mustHaveChecks)) {
    if (matches) {
      score += 25;
      reasons.push(`✅ ${key}`);
    } else {
      reasons.push(`❌ ${key}`);
    }
  }

  // 必要條件不滿足，直接退出
  if (score < 100) {
    return { matches: false, score, reasons };
  }

  // 檢查加分條件（每項 10 分）
  const niceToHaveChecks = {
    浴室對外窗: /浴室.*對外窗|通風良好/.test(fullText),
    電梯: /電梯|有電梯/.test(fullText),
    非一樓: details.floor && !details.floor.includes("1樓"),
    變頻冷暖空調: /變頻.*冷暖|冷暖空調/.test(fullText),
  };

  for (const [key, matches] of Object.entries(niceToHaveChecks)) {
    if (matches) {
      score += 10;
      reasons.push(`🌟 ${key}`);
    }
  }

  return {
    matches: score >= 100,
    score,
    reasons,
  };
}
```

---

## 反爬蟲對策

### 1. User-Agent 輪換

```typescript
const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}
```

### 2. 請求延遲

```typescript
async function delayedRequest(page: Page, url: string) {
  // 隨機延遲 2-5 秒
  const delay = Math.random() * 3000 + 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  await page.goto(url, { waitUntil: "networkidle" });
}
```

### 3. Cookie 管理

```typescript
// 儲存 Cookie
async function saveCookies(page: Page) {
  const cookies = await page.context().cookies();
  await fs.writeFile("cookies.json", JSON.stringify(cookies));
}

// 載入 Cookie
async function loadCookies(page: Page) {
  try {
    const cookies = JSON.parse(await fs.readFile("cookies.json", "utf-8"));
    await page.context().addCookies(cookies);
  } catch (error) {
    // First time, no cookies saved
  }
}
```

### 4. 錯誤處理

```typescript
async function safeExtractListings(page: Page, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await extractListings(page);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);

      // 檢查是否被封鎖
      const isBlocked = await page.evaluate(() => {
        return (
          document.body.textContent?.includes("驗證") ||
          document.body.textContent?.includes("請稍後再試")
        );
      });

      if (isBlocked) {
        console.error("被 591 反爬蟲機制封鎖");
        throw new Error("Blocked by anti-scraping");
      }

      // 等待後重試
      await new Promise((resolve) => setTimeout(resolve, 5000 * (i + 1)));
    }
  }

  throw new Error("Max retries reached");
}
```

---

## 資料儲存格式

### RentalListing Interface

```typescript
interface RentalListing591 {
  id: string; // 591 物件 ID

  // 基本資訊
  title: string; // 標題
  price: number; // 租金（元/月）
  location: string; // 地區
  url: string; // 591 連結

  // 詳細資訊
  address: string; // 地址
  area: number; // 坪數
  layout: string; // 格局（例如：1房1廳1衛）
  floor: string; // 樓層
  facilities: string[]; // 設備清單
  description: string; // 說明
  images: string[]; // 圖片 URLs
  tags: string[]; // 標籤

  // 符合度評估
  matchScore: number; // 0-140（100 必要 + 40 加分）
  matchReasons: string[]; // 符合/不符合原因

  // 元資料
  scrapedAt: Date; // 爬取時間
  source: "591"; // 來源
}
```

---

## 爬蟲排程

### Cron Job 設定

```typescript
// vercel.json
{
  "crons": [
    {
      "path": "/api/rental-finder/591-scrape",
      "schedule": "0 */6 * * *"  // 每 6 小時執行一次
    }
  ]
}
```

### API Route 實作

```typescript
// app/api/rental-finder/591-scrape/route.ts
export async function GET() {
  try {
    const criteria = {
      districts: ["中山區", "松山區", "中正區", "文山區", "信義區"],
      maxPrice: 12000,
    };

    // 搜尋列表
    const listings = await searchRentals(criteria);

    // 過濾與評分
    const evaluatedListings = await Promise.all(
      listings.map(async (listing) => {
        const evaluation = await checkDetailedCriteria(listing, USER_CRITERIA);
        return {
          ...listing,
          matchScore: evaluation.score,
          matchReasons: evaluation.reasons,
        };
      }),
    );

    // 只保留符合條件的（score >= 100）
    const matchedListings = evaluatedListings
      .filter((l) => l.matchScore >= 100)
      .sort((a, b) => b.matchScore - a.matchScore);

    // 儲存到資料庫
    await saveListings(matchedListings);

    // 發送 Telegram 通知
    if (matchedListings.length > 0) {
      await sendTelegramNotification(matchedListings);
    }

    return Response.json({
      total: listings.length,
      matched: matchedListings.length,
      listings: matchedListings,
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}
```

---

## 效能優化

### 1. 分頁處理

```typescript
async function scrapeAllPages(criteria: SearchCriteria, maxPages = 5) {
  const allListings = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = `${buildSearchUrl(criteria)}&page=${page}`;
    const listings = await searchRentals({ ...criteria, page });

    if (listings.length === 0) break;

    allListings.push(...listings);

    // 分頁間延遲
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return allListings;
}
```

### 2. 增量更新

```typescript
// 只檢查新的或更新的物件
async function incrementalScrape() {
  const lastScrapeTime = await getLastScrapeTime("591");
  const allListings = await scrapeAllPages(CRITERIA);

  // 過濾新物件
  const newListings = allListings.filter((listing) => {
    // 591 通常在 URL 或 title 會有更新時間
    return !existsInDatabase(listing.id);
  });

  return newListings;
}
```

---

## 監控與日誌

### 爬蟲統計

```typescript
interface ScrapeStats591 {
  timestamp: Date;
  totalListings: number;
  matchedListings: number;
  avgMatchScore: number;
  topDistricts: { district: string; count: number }[];
  avgPrice: number;
  errors: string[];
}

async function logScrapeStats(stats: ScrapeStats591) {
  await db.scrapeStats591.insert(stats);
}
```

---

最後更新：2025-11-14
