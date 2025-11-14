# Rental Finder API Endpoints

台北租屋自動化系統的 API 規格文檔。

---

## Base URL

```
Production: https://henryleelab.com/api/rental-finder
Development: http://localhost:3000/api/rental-finder
```

---

## Endpoints

### 1. POST `/api/rental-finder/scrape`

手動觸發爬蟲任務

**Request**

```typescript
POST /api/rental-finder/scrape
Content-Type: application/json

{
  "source": "facebook" | "591" | "all",
  "limit"?: number  // Optional, default: 50
}
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "data": {
    "source": "facebook" | "591" | "all",
    "totalScraped": number,
    "matchedListings": number,
    "duration": number,  // seconds
    "timestamp": string  // ISO 8601
  }
}
```

**Response (429 Too Many Requests)**

```typescript
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": number  // seconds
}
```

---

### 2. GET `/api/rental-finder/listings`

獲取租屋清單

**Query Parameters**

```typescript
{
  source?: "facebook" | "591" | "all",  // Default: "all"
  minScore?: number,                    // Default: 100
  limit?: number,                       // Default: 20
  offset?: number,                      // Default: 0
  sortBy?: "score" | "price" | "time",  // Default: "score"
  order?: "asc" | "desc"                // Default: "desc"
}
```

**Request Example**

```http
GET /api/rental-finder/listings?source=facebook&minScore=120&limit=10
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "data": {
    "listings": RentalListing[],
    "pagination": {
      "total": number,
      "limit": number,
      "offset": number,
      "hasMore": boolean
    }
  }
}
```

---

### 3. GET `/api/rental-finder/listings/:id`

獲取單一租屋詳細資訊

**Request**

```http
GET /api/rental-finder/listings/{listingId}
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "data": RentalListing
}
```

**Response (404 Not Found)**

```typescript
{
  "success": false,
  "error": "Listing not found"
}
```

---

### 4. POST `/api/rental-finder/notify`

手動發送 Telegram 通知

**Request**

```typescript
POST /api/rental-finder/notify
Content-Type: application/json

{
  "listingIds": string[],  // Optional, if not provided, send all unnotified
  "force"?: boolean        // Optional, resend even if already notified
}
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "data": {
    "sent": number,
    "failed": number,
    "timestamp": string
  }
}
```

---

### 5. GET `/api/rental-finder/stats`

獲取爬蟲統計資訊

**Request**

```http
GET /api/rental-finder/stats?days=7
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "data": {
    "totalScrapes": number,
    "successRate": number,  // 0-1
    "avgPostsPerScrape": number,
    "totalListings": number,
    "matchedListings": number,
    "avgMatchScore": number,
    "sourceBreakdown": {
      "facebook": number,
      "591": number
    },
    "recentErrors": string[],
    "lastScrapeTime": string
  }
}
```

---

### 6. DELETE `/api/rental-finder/listings/:id`

刪除租屋紀錄（已查看或不感興趣）

**Request**

```http
DELETE /api/rental-finder/listings/{listingId}
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

---

### 7. POST `/api/rental-finder/feedback`

提供租屋回饋（用於優化推薦）

**Request**

```typescript
POST /api/rental-finder/feedback
Content-Type: application/json

{
  "listingId": string,
  "feedback": "interested" | "not_interested" | "contacted" | "rented",
  "notes"?: string
}
```

**Response (200 OK)**

```typescript
{
  "success": true,
  "message": "Feedback recorded"
}
```

---

## Data Models

### RentalListing

```typescript
interface RentalListing {
  id: string;
  source: "facebook" | "591";

  // Basic Info
  title: string;
  price: number;
  location: string;
  url: string;

  // Details (may vary by source)
  description?: string;
  images: string[];
  facilities?: string[];
  area?: number;
  layout?: string;
  floor?: string;

  // Matching
  matchScore: number; // 0-140
  matchReasons: string[];

  // Metadata
  scrapedAt: Date;
  notifiedAt?: Date;
  viewedAt?: Date;
  feedback?: "interested" | "not_interested" | "contacted" | "rented";
  notes?: string;

  // Facebook specific
  author?: string;
  groupName?: string;

  // 591 specific
  address?: string;
  tags?: string[];
}
```

### ScrapeLog

```typescript
interface ScrapeLog {
  id: string;
  source: "facebook" | "591";
  timestamp: Date;
  status: "success" | "error" | "rate_limited";
  postsCount: number;
  matchedCount: number;
  error?: string;
  duration: number;
}
```

---

## Error Codes

| Code | Message               | Description                     |
| ---- | --------------------- | ------------------------------- |
| 400  | Bad Request           | Invalid request parameters      |
| 401  | Unauthorized          | Missing or invalid API key      |
| 404  | Not Found             | Resource not found              |
| 429  | Too Many Requests     | Rate limit exceeded             |
| 500  | Internal Server Error | Server-side error               |
| 503  | Service Unavailable   | Scraper temporarily unavailable |

---

## Rate Limits

| Endpoint      | Limit        | Window   |
| ------------- | ------------ | -------- |
| POST /scrape  | 10 requests  | per hour |
| GET /listings | 100 requests | per hour |
| POST /notify  | 20 requests  | per hour |
| Other GET     | 200 requests | per hour |

---

## Authentication

目前為內部使用，暫不需要認證。未來如需開放 API，將使用 API Key：

```http
Authorization: Bearer {API_KEY}
```

---

## Webhooks (未來功能)

### 租屋通知 Webhook

```typescript
POST {your-webhook-url}
Content-Type: application/json

{
  "event": "new_listing_matched",
  "data": {
    "listing": RentalListing,
    "timestamp": string
  }
}
```

---

最後更新：2025-11-14
