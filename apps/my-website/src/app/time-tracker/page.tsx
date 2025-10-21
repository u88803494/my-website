import type { Metadata } from "next";

import TimeTrackerFeature from "@/features/time-tracker";

export const metadata: Metadata = {
  description:
    "使用時間追蹤器記錄讀書、工作、品格等活動時間，自動計算統計資料，提升時間管理效率。支援 24 小時制輸入、週統計和本地儲存。",
  keywords: ["時間追蹤", "時間管理", "效率工具", "讀書記錄", "工作時間", "統計分析"],
  openGraph: {
    description: "記錄和分析你的時間分配，提升效率管理",
    title: "時間追蹤器 - 智能時間管理工具",
    type: "website",
  },
  title: "時間追蹤器 | 記錄和分析你的時間分配",
  twitter: {
    card: "summary_large_image",
    description: "記錄和分析你的時間分配，提升效率管理",
    title: "時間追蹤器 - 智能時間管理工具",
  },
};

/**
 * 時間追蹤頁面
 * 提供完整的時間記錄和分析功能
 */
const TimeTrackerPage: React.FC = () => {
  return <TimeTrackerFeature />;
};

export default TimeTrackerPage;
