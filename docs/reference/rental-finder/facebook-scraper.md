# Facebook 租屋社團爬蟲邏輯

使用 Chrome DevTools MCP 自動化爬取 Facebook 租屋社團資訊。

---

## 技術架構

### 工具選擇

- **Chrome DevTools MCP**：完全自動化瀏覽器控制
- **優勢**：
  - ✅ 模擬真實用戶行為
  - ✅ 處理動態載入內容
  - ✅ 繞過基本反爬蟲機制
  - ✅ 支援 headless mode

---

## 爬蟲流程

### 1. 登入與驗證

```javascript
// 使用 Chrome DevTools MCP 登入
(await mcp__chrome) -
  devtools__navigate_page({
    type: "url",
    url: "https://www.facebook.com/login",
  });

// 填寫登入資訊（使用環境變數）
(await mcp__chrome) -
  devtools__fill_form({
    elements: [
      { uid: "email_input", value: process.env.FB_EMAIL },
      { uid: "password_input", value: process.env.FB_PASSWORD },
    ],
  });

// 點擊登入
(await mcp__chrome) - devtools__click({ uid: "login_button" });
```

### 2. 導航到社團

```javascript
// 前往特定社團頁面
(await mcp__chrome) -
  devtools__navigate_page({
    type: "url",
    url: "https://www.facebook.com/groups/{GROUP_ID}",
  });

// 等待頁面載入完成
(await mcp__chrome) - devtools__wait_for({ text: "討論" });
```

### 3. 資料擷取

#### 3.1 貼文清單

```javascript
// 使用 evaluate_script 執行 JavaScript 爬取
const posts =
  (await mcp__chrome) -
  devtools__evaluate_script({
    function: `() => {
    const postElements = document.querySelectorAll('div[role="article"]');
    const posts = [];

    postElements.forEach(post => {
      // 擷取貼文內容
      const contentEl = post.querySelector('div[data-ad-preview="message"]');
      const content = contentEl ? contentEl.innerText : '';

      // 擷取作者
      const authorEl = post.querySelector('a[role="link"] strong');
      const author = authorEl ? authorEl.innerText : '';

      // 擷取時間
      const timeEl = post.querySelector('a[role="link"] span');
      const time = timeEl ? timeEl.innerText : '';

      // 擷取圖片
      const images = [];
      post.querySelectorAll('img').forEach(img => {
        if (img.src && img.src.startsWith('http')) {
          images.push(img.src);
        }
      });

      // 擷取貼文連結
      const linkEl = post.querySelector('a[href*="/posts/"]');
      const postUrl = linkEl ? linkEl.href : '';

      posts.push({
        content,
        author,
        time,
        images,
        postUrl,
        scrapedAt: new Date().toISOString()
      });
    });

    return JSON.stringify(posts);
  }`,
  });
```

#### 3.2 滾動載入更多

```javascript
// 滾動頁面載入更多貼文
(await mcp__chrome) -
  devtools__evaluate_script({
    function: `() => {
    window.scrollTo(0, document.body.scrollHeight);
  }`,
  });

// 等待新內容載入
(await mcp__chrome) -
  devtools__wait_for({
    text: "載入更多",
    timeout: 5000,
  });
```

---

## 資料解析規則

### 貼文內容過濾

#### 租屋關鍵字偵測

```typescript
const RENTAL_KEYWORDS = [
  // 租屋類型
  "套房",
  "雅房",
  "整層",
  "分租",
  "合租",
  "獨立套房",

  // 地區
  "中山區",
  "松山區",
  "中正區",
  "文山區",
  "信義區",
  "永春",
  "後山埤",
  "台北",
  "捷運",

  // 設施
  "獨立電表",
  "對外窗",
  "水泥隔間",
  "硫化銅門",
  "電梯",
  "冷氣",
  "洗衣機",
  "冰箱",

  // 價格相關
  "租金",
  "押金",
  "月租",
  "包水",
  "包電",
  "包管理費",
];

function isRentalPost(content: string): boolean {
  return RENTAL_KEYWORDS.some((keyword) => content.includes(keyword));
}
```

#### 價格擷取

```typescript
function extractPrice(content: string): number | null {
  // 匹配常見價格格式
  const patterns = [
    /租金[：:]\s*(\d{4,5})/, // 租金：12000
    /月租\s*(\d{4,5})/, // 月租 12000
    /(\d{4,5})\s*[元塊]/, // 12000元
    /\$\s*(\d{4,5})/, // $ 12000
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }

  return null;
}
```

#### 地區擷取

```typescript
function extractLocation(content: string): string[] {
  const DISTRICTS = [
    "中山區",
    "松山區",
    "中正區",
    "文山區",
    "信義區",
    "大安區",
    "萬華區",
    "南港區",
    "內湖區",
    "士林區",
    "北投區",
    "大同區",
  ];

  return DISTRICTS.filter((district) => content.includes(district));
}
```

#### 捷運站擷取

```typescript
function extractMrtStations(content: string): string[] {
  // 匹配「捷運XXX站」格式
  const mrtPattern = /捷運([^站\s]{2,4})站/g;
  const matches = content.matchAll(mrtPattern);

  return Array.from(matches, (m) => m[1]);
}
```

---

## 資料儲存格式

### RentalListing Interface

```typescript
interface FacebookRentalPost {
  id: string; // 唯一識別碼
  groupId: string; // 社團 ID
  groupName: string; // 社團名稱

  // 貼文資訊
  postUrl: string; // 貼文連結
  author: string; // 作者名稱
  authorProfile: string; // 作者個人頁面
  publishTime: string; // 發布時間

  // 租屋資訊
  content: string; // 完整內容
  price: number | null; // 租金（元/月）
  locations: string[]; // 地區
  mrtStations: string[]; // 捷運站
  images: string[]; // 圖片 URLs

  // 詳細資訊（需進一步解析）
  roomType?: string; // 套房/雅房/整層
  facilities?: string[]; // 設施清單

  // 元資料
  scrapedAt: Date; // 爬取時間
  isProcessed: boolean; // 是否已處理
  matchScore?: number; // 符合度評分（0-100）
}
```

---

## 反爬蟲對策

### 1. 模擬人類行為

```typescript
// 隨機延遲
async function randomDelay(min: number = 2000, max: number = 5000) {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

// 隨機滾動
async function randomScroll() {
  const scrollAmount = Math.floor(Math.random() * 500) + 300;
  (await mcp__chrome) -
    devtools__evaluate_script({
      function: `() => {
      window.scrollBy(0, ${scrollAmount});
    }`,
    });
}
```

### 2. 時間限制

```typescript
const SCRAPING_LIMITS = {
  maxPostsPerSession: 50, // 每次最多爬取 50 則
  maxSessionsPerDay: 5, // 每天最多 5 次
  delayBetweenSessions: 3600, // 每次間隔 1 小時（秒）
  delayBetweenPosts: 3, // 每則貼文間隔 3 秒
};
```

### 3. 錯誤處理

```typescript
async function scrapeFacebookGroup(groupId: string) {
  try {
    // 爬取邏輯
    const posts = await extractPosts(groupId);

    // 儲存成功記錄
    await saveScrapeLog({
      groupId,
      status: "success",
      postsCount: posts.length,
      timestamp: new Date(),
    });

    return posts;
  } catch (error) {
    // 偵測是否被限制
    if (error.message.includes("rate limit")) {
      console.error("爬蟲被限制，暫停 24 小時");
      await pauseScraping(24 * 3600);
    }

    // 儲存錯誤記錄
    await saveScrapeLog({
      groupId,
      status: "error",
      error: error.message,
      timestamp: new Date(),
    });

    throw error;
  }
}
```

---

## 爬蟲排程

### Cron Job 設定（Vercel）

```typescript
// vercel.json
{
  "crons": [
    {
      "path": "/api/rental-finder/scrape",
      "schedule": "0 * * * *"  // 每小時執行一次
    }
  ]
}
```

### API Route 實作

```typescript
// app/api/rental-finder/scrape/route.ts
export async function GET() {
  try {
    // 檢查是否超過每日限制
    const todayScrapings = await getTodayScrapingCount();
    if (todayScrapings >= SCRAPING_LIMITS.maxSessionsPerDay) {
      return Response.json(
        {
          message: "Daily limit reached",
        },
        { status: 429 },
      );
    }

    // 隨機選擇一個社團
    const groups = await getActiveGroups();
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];

    // 執行爬蟲
    const posts = await scrapeFacebookGroup(randomGroup.id);

    // 過濾符合條件的貼文
    const matchedPosts = posts
      .filter((post) => isRentalPost(post.content))
      .filter((post) => matchesUserCriteria(post));

    // 如有符合，發送 Telegram 通知
    if (matchedPosts.length > 0) {
      await sendTelegramNotification(matchedPosts);
    }

    return Response.json({
      groupId: randomGroup.id,
      totalPosts: posts.length,
      matchedPosts: matchedPosts.length,
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

### 1. 增量爬取

```typescript
// 只爬取上次檢查後的新貼文
async function incrementalScrape(groupId: string) {
  const lastScrapeTime = await getLastScrapeTime(groupId);

  // 停止條件：遇到已爬取過的貼文
  const posts = [];
  let hasMore = true;

  while (hasMore) {
    const newPosts = await extractPosts(groupId);

    for (const post of newPosts) {
      if (post.publishTime <= lastScrapeTime) {
        hasMore = false;
        break;
      }
      posts.push(post);
    }

    if (hasMore) {
      await randomScroll();
      await randomDelay();
    }
  }

  return posts;
}
```

### 2. 並行處理

```typescript
// 同時爬取多個社團（限制並發數）
async function scrapeMultipleGroups(groupIds: string[]) {
  const CONCURRENCY = 3; // 最多同時 3 個

  const results = [];
  for (let i = 0; i < groupIds.length; i += CONCURRENCY) {
    const batch = groupIds.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((id) => scrapeFacebookGroup(id)),
    );
    results.push(...batchResults);

    // 批次間延遲
    if (i + CONCURRENCY < groupIds.length) {
      await randomDelay(30000, 60000); // 30-60 秒
    }
  }

  return results;
}
```

---

## 監控與日誌

### 爬蟲狀態追蹤

```typescript
interface ScrapeLog {
  id: string;
  groupId: string;
  timestamp: Date;
  status: "success" | "error" | "rate_limited";
  postsCount: number;
  matchedCount: number;
  error?: string;
  duration: number; // 執行時間（秒）
}

// 儲存日誌
async function saveScrapeLog(log: ScrapeLog) {
  await db.scrapeLogs.insert(log);
}

// 查詢統計
async function getScrapeStats() {
  return {
    totalScrapes: await db.scrapeLogs.count(),
    successRate: await db.scrapeLogs.successRate(),
    avgPostsPerScrape: await db.scrapeLogs.avgPosts(),
    lastError: await db.scrapeLogs.lastError(),
  };
}
```

---

最後更新：2025-11-14
