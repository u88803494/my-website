import { setRequestLocale } from "next-intl/server";

import TimeTrackerFeature from "@/features/time-tracker";

interface TimeTrackerPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * 時間追蹤頁面
 * 提供完整的時間記錄和分析功能
 */
const TimeTrackerPage = async ({ params }: TimeTrackerPageProps) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <TimeTrackerFeature />;
};

export default TimeTrackerPage;
