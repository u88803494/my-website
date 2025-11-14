# Telegram Bot Configuration

Telegram 通知設定與訊息模板。

---

## Bot Setup

### 1. Create Bot via BotFather

```
1. Open Telegram and search for @BotFather
2. Send /newbot command
3. Choose a name: "Taipei Rental Finder"
4. Choose a username: "taipei_rental_finder_bot"
5. Receive Bot Token: 1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
```

### 2. Get Your Chat ID

```
1. Send any message to your bot
2. Visit: https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates
3. Find "chat":{"id":123456789}
4. Save this Chat ID
```

---

## Environment Variables

### `.env.local`

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_CHAT_ID=123456789

# Optional: Multiple recipients (comma-separated)
TELEGRAM_CHAT_IDS=123456789,987654321
```

---

## Integration

### Install Dependencies

```bash
pnpm add node-telegram-bot-api
pnpm add -D @types/node-telegram-bot-api
```

### Basic Implementation

```typescript
// lib/telegram.ts
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false, // We only send messages, not receive
});

export async function sendMessage(chatId: string, message: string) {
  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: false,
    });
    return { success: true };
  } catch (error) {
    console.error("Telegram send error:", error);
    return { success: false, error };
  }
}

export async function sendPhoto(
  chatId: string,
  photo: string,
  caption?: string,
) {
  try {
    await bot.sendPhoto(chatId, photo, {
      caption,
      parse_mode: "Markdown",
    });
    return { success: true };
  } catch (error) {
    console.error("Telegram photo send error:", error);
    return { success: false, error };
  }
}
```

---

## Message Templates

### 1. New Listing Notification

```typescript
export function formatRentalNotification(listing: RentalListing): string {
  const { source, title, price, location, url, matchScore, matchReasons } =
    listing;

  const emoji = source === "facebook" ? "📘" : "🏢";
  const scoreEmoji =
    matchScore >= 120 ? "⭐⭐⭐" : matchScore >= 110 ? "⭐⭐" : "⭐";

  const message = `
${emoji} *新租屋資訊* ${scoreEmoji}

📍 ${location}
💰 ${price.toLocaleString()} 元/月
📊 符合度：${matchScore}/140

*符合條件：*
${matchReasons.map((r) => `  ${r}`).join("\n")}

${title}

🔗 [查看詳情](${url})

---
來源：${source === "facebook" ? "Facebook 社團" : "591租屋網"}
  `.trim();

  return message;
}
```

**Example Output:**

```
📘 *新租屋資訊* ⭐⭐⭐

📍 中山區
💰 11,500 元/月
📊 符合度：130/140

*符合條件：*
  ✅ 水泥隔間
  ✅ 硫化銅門
  ✅ 獨立電表或低電費
  ✅ 對外窗
  🌟 電梯
  🌟 非一樓

近捷運中山站 獨立套房出租

🔗 [查看詳情](https://facebook.com/...)

---
來源：Facebook 社團
```

---

### 2. Daily Summary

```typescript
export function formatDailySummary(stats: {
  total: number;
  matched: number;
  avgScore: number;
  topDistricts: { district: string; count: number }[];
}): string {
  const { total, matched, avgScore, topDistricts } = stats;

  const message = `
📊 *每日租屋摘要*

🔍 今日爬取：${total} 筆
✅ 符合條件：${matched} 筆
📈 平均符合度：${avgScore.toFixed(1)}/140

*熱門地區：*
${topDistricts.map((d, i) => `  ${i + 1}. ${d.district} (${d.count} 筆)`).join("\n")}

---
${new Date().toLocaleDateString("zh-TW")}
  `.trim();

  return message;
}
```

---

### 3. Error Notification

```typescript
export function formatErrorNotification(error: {
  source: string;
  message: string;
  timestamp: Date;
}): string {
  const { source, message, timestamp } = error;

  const errorMessage = `
⚠️ *爬蟲錯誤警告*

來源：${source}
錯誤：${message}
時間：${timestamp.toLocaleString("zh-TW")}

請檢查系統狀態。
  `.trim();

  return errorMessage;
}
```

---

## Notification Service

### Complete Implementation

```typescript
// features/rental-finder/utils/notificationService.ts
import type { RentalListing } from "../types";

export class TelegramNotificationService {
  private bot: TelegramBot;
  private chatId: string;

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
      polling: false,
    });
    this.chatId = process.env.TELEGRAM_CHAT_ID!;
  }

  async sendNewListing(listing: RentalListing) {
    const message = formatRentalNotification(listing);

    // Send text message
    await this.bot.sendMessage(this.chatId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: false,
    });

    // Send first image if available
    if (listing.images.length > 0) {
      await this.bot.sendPhoto(this.chatId, listing.images[0], {
        caption: listing.title,
      });
    }

    // Log notification
    await db.notificationLogs.insert({
      listingId: listing.id,
      type: "telegram",
      status: "sent",
      sentAt: new Date(),
    });
  }

  async sendBatch(listings: RentalListing[]) {
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const listing of listings) {
      try {
        await this.sendNewListing(listing);
        results.sent++;

        // Delay between messages (avoid rate limit)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        results.failed++;
        results.errors.push(`${listing.id}: ${error.message}`);
      }
    }

    return results;
  }

  async sendDailySummary(stats: DailySummaryStats) {
    const message = formatDailySummary(stats);
    await this.bot.sendMessage(this.chatId, message, {
      parse_mode: "Markdown",
    });
  }

  async sendError(error: ErrorInfo) {
    const message = formatErrorNotification(error);
    await this.bot.sendMessage(this.chatId, message, {
      parse_mode: "Markdown",
    });
  }
}

// Export singleton
export const telegramService = new TelegramNotificationService();
```

---

## Rate Limits

### Telegram API Limits

- **Messages**: 30 messages/second
- **Photos**: 20 photos/minute
- **Group messages**: 20 messages/minute

### Our Limits (Conservative)

```typescript
const NOTIFICATION_LIMITS = {
  maxPerMinute: 10,
  maxPerHour: 100,
  delayBetweenMessages: 1000, // 1 second
  batchSize: 5,
};
```

---

## Testing

### Send Test Message

```typescript
// app/api/rental-finder/test-telegram/route.ts
import { telegramService } from "@/features/rental-finder/utils/notificationService";

export async function GET() {
  try {
    const testListing: RentalListing = {
      id: "test-001",
      source: "facebook",
      title: "測試租屋資訊",
      price: 12000,
      location: "中山區",
      url: "https://example.com",
      images: [],
      matchScore: 120,
      matchReasons: ["✅ 水泥隔間", "✅ 硫化銅門", "✅ 獨立電表", "✅ 對外窗"],
      scrapedAt: new Date(),
    };

    await telegramService.sendNewListing(testListing);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

**Usage:**

```bash
curl https://henryleelab.com/api/rental-finder/test-telegram
```

---

## Advanced Features

### 1. Interactive Buttons

```typescript
await bot.sendMessage(chatId, message, {
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "✅ 有興趣", callback_data: `interest_${listing.id}` },
        { text: "❌ 不感興趣", callback_data: `dismiss_${listing.id}` },
      ],
      [{ text: "🔗 開啟連結", url: listing.url }],
    ],
  },
});
```

### 2. Location Sharing

```typescript
// If listing has coordinates
if (listing.latitude && listing.longitude) {
  await bot.sendLocation(chatId, listing.latitude, listing.longitude);
}
```

### 3. Media Group (Multiple Photos)

```typescript
if (listing.images.length > 1) {
  const media = listing.images.slice(0, 10).map((url, index) => ({
    type: "photo" as const,
    media: url,
    caption: index === 0 ? listing.title : undefined,
  }));

  await bot.sendMediaGroup(chatId, media);
}
```

---

## Monitoring

### Notification Stats

```typescript
interface NotificationStats {
  totalSent: number;
  successRate: number;
  avgResponseTime: number;
  failedMessages: number;
  lastError: string | null;
}

async function getNotificationStats(): Promise<NotificationStats> {
  const logs = await db.notificationLogs
    .where("type", "telegram")
    .where("sentAt", ">=", subDays(new Date(), 7))
    .all();

  return {
    totalSent: logs.length,
    successRate: logs.filter((l) => l.status === "sent").length / logs.length,
    avgResponseTime: 0, // TODO: implement
    failedMessages: logs.filter((l) => l.status === "failed").length,
    lastError: logs.find((l) => l.error)?.error || null,
  };
}
```

---

## Troubleshooting

### Common Issues

**1. Bot Not Sending Messages**

```
Error: 401 Unauthorized
Solution: Check TELEGRAM_BOT_TOKEN is correct
```

**2. Chat ID Not Working**

```
Error: 400 Bad Request: chat not found
Solution:
1. Send message to bot first
2. Use /getUpdates to get correct chat ID
```

**3. Rate Limit Exceeded**

```
Error: 429 Too Many Requests
Solution: Implement delay between messages (1 second)
```

**4. Message Too Long**

```
Error: 400 Bad Request: message is too long
Solution: Split message or truncate to 4096 characters
```

---

最後更新：2025-11-14
