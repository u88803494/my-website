# Rental Finder Data Schema

資料庫 Schema 設計文檔。

---

## 技術選擇

### Development

- **SQLite**：本地開發與測試
- **位置**：`/tmp/rental-finder.db`

### Production

- **Supabase (PostgreSQL)**：生產環境
- **優勢**：
  - ✅ Vercel 原生整合
  - ✅ 即時訂閱（未來功能）
  - ✅ 自動備份
  - ✅ Row Level Security

---

## Database Tables

### 1. rental_listings

租屋清單主表

```sql
CREATE TABLE rental_listings (
  -- Primary Key
  id TEXT PRIMARY KEY,

  -- Source
  source TEXT NOT NULL CHECK (source IN ('facebook', '591')),

  -- Basic Info
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  location TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,

  -- Details (nullable)
  description TEXT,
  area REAL,
  layout TEXT,
  floor TEXT,
  address TEXT,

  -- Arrays (JSON in SQLite, ARRAY in Postgres)
  images TEXT NOT NULL DEFAULT '[]',  -- JSON array
  facilities TEXT DEFAULT '[]',        -- JSON array
  tags TEXT DEFAULT '[]',              -- JSON array

  -- Matching
  match_score INTEGER NOT NULL DEFAULT 0,
  match_reasons TEXT DEFAULT '[]',     -- JSON array

  -- Metadata
  scraped_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notified_at TIMESTAMP,
  viewed_at TIMESTAMP,
  feedback TEXT CHECK (feedback IN ('interested', 'not_interested', 'contacted', 'rented')),
  notes TEXT,

  -- Facebook specific (nullable)
  author TEXT,
  author_profile TEXT,
  group_id TEXT,
  group_name TEXT,
  post_url TEXT,
  publish_time TIMESTAMP,

  -- Indexes
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_rental_source ON rental_listings(source);
CREATE INDEX idx_rental_price ON rental_listings(price);
CREATE INDEX idx_rental_score ON rental_listings(match_score DESC);
CREATE INDEX idx_rental_scraped_at ON rental_listings(scraped_at DESC);
CREATE INDEX idx_rental_notified ON rental_listings(notified_at) WHERE notified_at IS NULL;
CREATE INDEX idx_rental_feedback ON rental_listings(feedback);
```

---

### 2. scrape_logs

爬蟲執行日誌

```sql
CREATE TABLE scrape_logs (
  -- Primary Key
  id TEXT PRIMARY KEY,

  -- Source
  source TEXT NOT NULL CHECK (source IN ('facebook', '591')),
  group_id TEXT,  -- Facebook group ID (optional)

  -- Status
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'rate_limited')),

  -- Metrics
  posts_count INTEGER NOT NULL DEFAULT 0,
  matched_count INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL,  -- seconds

  -- Error (nullable)
  error TEXT,
  stack_trace TEXT,

  -- Timestamp
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_scrape_source ON scrape_logs(source);
CREATE INDEX idx_scrape_status ON scrape_logs(status);
CREATE INDEX idx_scrape_timestamp ON scrape_logs(timestamp DESC);
```

---

### 3. facebook_groups

Facebook 社團管理

```sql
CREATE TABLE facebook_groups (
  -- Primary Key
  id TEXT PRIMARY KEY,  -- Facebook group ID

  -- Info
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  members_count INTEGER,
  activity_level TEXT,  -- e.g., "90+ posts/day"
  type TEXT CHECK (type IN ('public', 'private')),

  -- Status
  joined_status TEXT NOT NULL CHECK (joined_status IN ('joined', 'pending', 'not_joined')),
  joined_at TIMESTAMP,

  -- Priority
  priority INTEGER DEFAULT 0,  -- 0=low, 5=high

  -- Scraping
  last_scraped_at TIMESTAMP,
  scrape_enabled BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_group_joined_status ON facebook_groups(joined_status);
CREATE INDEX idx_group_priority ON facebook_groups(priority DESC);
CREATE INDEX idx_group_last_scraped ON facebook_groups(last_scraped_at);
```

---

### 4. user_preferences

用戶偏好設定

```sql
CREATE TABLE user_preferences (
  -- Primary Key (single row table for now)
  id INTEGER PRIMARY KEY DEFAULT 1,

  -- Search Criteria (JSON)
  search_criteria TEXT NOT NULL DEFAULT '{}',
  /* Example:
  {
    "districts": ["中山區", "松山區", "中正區", "文山區", "信義區"],
    "maxPrice": 12000,
    "mustHave": {
      "水泥隔間": true,
      "硫化銅門": true,
      "獨立電表或低電費": true,
      "對外窗": true
    },
    "niceToHave": {
      "浴室對外窗": true,
      "電梯": true,
      "非一樓": true,
      "變頻冷暖空調": true
    }
  }
  */

  -- Notification Settings (JSON)
  notification_settings TEXT NOT NULL DEFAULT '{}',
  /* Example:
  {
    "telegram": {
      "enabled": true,
      "chatId": "123456789",
      "minScore": 100
    },
    "email": {
      "enabled": false,
      "address": ""
    }
  }
  */

  -- Scraping Schedule
  scrape_frequency TEXT DEFAULT '1h',  -- cron format or shorthand

  -- Metadata
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Ensure single row
  CHECK (id = 1)
);

-- Insert default preferences
INSERT INTO user_preferences (id) VALUES (1);
```

---

### 5. notification_logs

通知發送記錄

```sql
CREATE TABLE notification_logs (
  -- Primary Key
  id TEXT PRIMARY KEY,

  -- Listing
  listing_id TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES rental_listings(id) ON DELETE CASCADE,

  -- Notification
  type TEXT NOT NULL CHECK (type IN ('telegram', 'email', 'webhook')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  error TEXT,

  -- Metadata
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_notification_listing ON notification_logs(listing_id);
CREATE INDEX idx_notification_status ON notification_logs(status);
CREATE INDEX idx_notification_sent_at ON notification_logs(sent_at DESC);
```

---

## TypeScript Types

### Generated from Schema

```typescript
// rental_listings
export interface RentalListing {
  id: string;
  source: "facebook" | "591";

  // Basic Info
  title: string;
  price: number;
  location: string;
  url: string;

  // Details
  description: string | null;
  area: number | null;
  layout: string | null;
  floor: string | null;
  address: string | null;

  // Arrays
  images: string[];
  facilities: string[];
  tags: string[];

  // Matching
  matchScore: number;
  matchReasons: string[];

  // Metadata
  scrapedAt: Date;
  notifiedAt: Date | null;
  viewedAt: Date | null;
  feedback: "interested" | "not_interested" | "contacted" | "rented" | null;
  notes: string | null;

  // Facebook specific
  author: string | null;
  authorProfile: string | null;
  groupId: string | null;
  groupName: string | null;
  postUrl: string | null;
  publishTime: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// scrape_logs
export interface ScrapeLog {
  id: string;
  source: "facebook" | "591";
  groupId: string | null;
  status: "success" | "error" | "rate_limited";
  postsCount: number;
  matchedCount: number;
  duration: number;
  error: string | null;
  stackTrace: string | null;
  timestamp: Date;
}

// facebook_groups
export interface FacebookGroup {
  id: string;
  name: string;
  url: string;
  membersCount: number | null;
  activityLevel: string | null;
  type: "public" | "private" | null;
  joinedStatus: "joined" | "pending" | "not_joined";
  joinedAt: Date | null;
  priority: number;
  lastScrapedAt: Date | null;
  scrapeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// user_preferences
export interface UserPreferences {
  id: number;
  searchCriteria: SearchCriteria;
  notificationSettings: NotificationSettings;
  scrapeFrequency: string;
  updatedAt: Date;
}

export interface SearchCriteria {
  districts: string[];
  maxPrice: number;
  mustHave: {
    水泥隔間: boolean;
    硫化銅門: boolean;
    獨立電表或低電費: boolean;
    對外窗: boolean;
  };
  niceToHave: {
    浴室對外窗: boolean;
    電梯: boolean;
    非一樓: boolean;
    變頻冷暖空調: boolean;
  };
}

export interface NotificationSettings {
  telegram: {
    enabled: boolean;
    chatId: string;
    minScore: number;
  };
  email: {
    enabled: boolean;
    address: string;
  };
}

// notification_logs
export interface NotificationLog {
  id: string;
  listingId: string;
  type: "telegram" | "email" | "webhook";
  status: "sent" | "failed" | "pending";
  error: string | null;
  sentAt: Date;
}
```

---

## Database Utilities

### Connection (Supabase)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export { supabase };
```

### Query Helpers

```typescript
// Get unnotified listings
export async function getUnnotifiedListings(minScore = 100) {
  const { data, error } = await supabase
    .from("rental_listings")
    .select("*")
    .is("notified_at", null)
    .gte("match_score", minScore)
    .order("match_score", { ascending: false });

  if (error) throw error;
  return data;
}

// Mark listing as notified
export async function markAsNotified(listingId: string) {
  const { error } = await supabase
    .from("rental_listings")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", listingId);

  if (error) throw error;
}

// Save scrape log
export async function saveScrapeLog(log: Omit<ScrapeLog, "id" | "timestamp">) {
  const { error } = await supabase.from("scrape_logs").insert({
    id: crypto.randomUUID(),
    ...log,
    timestamp: new Date().toISOString(),
  });

  if (error) throw error;
}
```

---

## Migration Strategy

### Phase 1: SQLite (Development)

- Use `better-sqlite3` for local development
- Schema migrations via SQL files in `/migrations`

### Phase 2: Supabase (Production)

- Create Supabase project
- Run migration scripts
- Update environment variables
- Switch connection in production

### Migration Script

```bash
# migrations/001_init.sql
-- Run on Supabase SQL editor
-- Copy all CREATE TABLE statements from above
```

---

最後更新：2025-11-14
