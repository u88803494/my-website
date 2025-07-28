import type { TimeStatistics } from "@/features/time-tracker/types";
import { ActivityType } from "@/features/time-tracker/types";

/**
 * 將分鐘轉換為小時和分鐘的顯示格式
 */
export const formatMinutesToHours = (minutes: number): string => {
  if (minutes < 0) return "0 分鐘";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} 分鐘`;
  } else if (remainingMinutes === 0) {
    return `${hours} 小時`;
  } else {
    return `${hours} 小時 ${remainingMinutes} 分鐘`;
  }
};

/**
 * 將分鐘轉換為小數點格式的小時數
 */
export const formatMinutesToDecimalHours = (minutes: number): string => {
  const hours = minutes / 60;
  return `${hours.toFixed(2)} hr`;
};

/**
 * 獲取活動類型的顯示色彩
 */
export const getActivityTypeColor = (activityType: ActivityType): string => {
  const colorMap = {
    [ActivityType.CHARACTER]: "bg-purple-100 text-purple-800 border-purple-200",
    [ActivityType.EXTRA_CHARACTER]: "bg-pink-100 text-pink-800 border-pink-200",
    [ActivityType.EXTRA_STUDY]: "bg-cyan-100 text-cyan-800 border-cyan-200",
    [ActivityType.STUDY]: "bg-blue-100 text-blue-800 border-blue-200",
    [ActivityType.WORK]: "bg-green-100 text-green-800 border-green-200",
  };

  return colorMap[activityType] || "bg-gray-100 text-gray-800 border-gray-200";
};

/**
 * 格式化後的記錄類型
 */
export type FormattedRecord = {
  activityColor: string;
  activityType: ActivityType;
  decimalDuration: string;
  description: string;
  duration: string;
  timeRange: string;
};

/**
 * 格式化時間記錄為顯示用的格式
 */
export const formatTimeRecord = (record: {
  activityType: ActivityType;
  description?: string;
  duration: number;
  endTime: string;
  startTime: string;
}): FormattedRecord => {
  return {
    activityColor: getActivityTypeColor(record.activityType),
    activityType: record.activityType, // 直接使用 activityType 值
    decimalDuration: formatMinutesToDecimalHours(record.duration),
    description: record.description || "",
    duration: formatMinutesToHours(record.duration),
    // 24 小時制顯示時間區間
    timeRange: `${record.startTime} - ${record.endTime}`,
  };
};

/**
 * 計算統計資料的百分比
 */
export const calculatePercentages = (statistics: TimeStatistics) => {
  const total = statistics.總計;
  if (total === 0) return {};

  const percentages: Record<string, number> = {};

  Object.entries(statistics).forEach(([key, value]) => {
    if (key !== "總計") {
      percentages[key] = Math.round((value / total) * 100);
    }
  });

  return percentages;
};

/**
 * 格式化統計資料為顯示用的格式
 */
export const formatStatistics = (statistics: TimeStatistics) => {
  return Object.entries(statistics).map(([key, value]) => ({
    decimalHours: formatMinutesToDecimalHours(value),
    formattedValue: formatMinutesToHours(value),
    label: key,
    value: value,
  }));
};
