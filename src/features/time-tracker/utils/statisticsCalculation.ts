import type { TimeRecord, TimeStatistics } from "@/types/time-tracker.types";
import { ActivityType } from "@/types/time-tracker.types";

/**
 * 初始化空的統計資料
 */
export const createEmptyStatistics = (): TimeStatistics => ({
  [ActivityType.CHARACTER]: 0,
  [ActivityType.EXTRA_CHARACTER]: 0,
  [ActivityType.EXTRA_STUDY]: 0,
  [ActivityType.STUDY]: 0,
  [ActivityType.WORK]: 0,
  總計: 0,
});

/**
 * 計算時間記錄的統計資料
 */
export const calculateStatistics = (records: TimeRecord[]): TimeStatistics => {
  const statistics = createEmptyStatistics();

  records.forEach((record) => {
    if (record.activityType in statistics) {
      statistics[record.activityType] += record.duration;
      statistics.總計 += record.duration;
    }
  });

  return statistics;
};


/**
 * 計算活動類型的百分比
 */
export const calculateActivityPercentages = (statistics: TimeStatistics): Record<ActivityType, number> => {
  const total = statistics.總計;

  if (total === 0) {
    return {
      [ActivityType.CHARACTER]: 0,
      [ActivityType.EXTRA_CHARACTER]: 0,
      [ActivityType.EXTRA_STUDY]: 0,
      [ActivityType.STUDY]: 0,
      [ActivityType.WORK]: 0,
    };
  }

  return {
    [ActivityType.CHARACTER]: Math.round((statistics[ActivityType.CHARACTER] / total) * 100),
    [ActivityType.EXTRA_CHARACTER]: Math.round((statistics[ActivityType.EXTRA_CHARACTER] / total) * 100),
    [ActivityType.EXTRA_STUDY]: Math.round((statistics[ActivityType.EXTRA_STUDY] / total) * 100),
    [ActivityType.STUDY]: Math.round((statistics[ActivityType.STUDY] / total) * 100),
    [ActivityType.WORK]: Math.round((statistics[ActivityType.WORK] / total) * 100),
  };
};

/**
 * 獲取最多時間的活動類型
 */
export const getMostActiveType = (statistics: TimeStatistics): ActivityType | null => {
  let maxDuration = 0;
  let mostActiveType: ActivityType | null = null;

  Object.entries(statistics).forEach(([key, value]) => {
    if (key !== "總計" && value > maxDuration) {
      maxDuration = value;
      mostActiveType = key as ActivityType;
    }
  });

  return mostActiveType;
};

/**
 * 計算平均每日時間
 */
export const calculateDailyAverage = (records: TimeRecord[], days: number = 7): TimeStatistics => {
  const totalStats = calculateStatistics(records);
  const averageStats = createEmptyStatistics();

  Object.keys(averageStats).forEach((key) => {
    if (key in totalStats) {
      averageStats[key as keyof TimeStatistics] = Math.round(totalStats[key as keyof TimeStatistics] / days);
    }
  });

  return averageStats;
};

/**
 * 按日期分組計算統計
 */
export const calculateDailyStatistics = (records: TimeRecord[]): Record<string, TimeStatistics> => {
  const dailyStats: Record<string, TimeStatistics> = {};

  records.forEach((record) => {
    if (!dailyStats[record.date]) {
      dailyStats[record.date] = createEmptyStatistics();
    }

    dailyStats[record.date][record.activityType] += record.duration;
    dailyStats[record.date].總計 += record.duration;
  });

  return dailyStats;
};

/**
 * 計算週統計摘要
 */
export const calculateWeeklySummary = (records: TimeRecord[]) => {
  const statistics = calculateStatistics(records);
  const percentages = calculateActivityPercentages(statistics);
  const mostActiveType = getMostActiveType(statistics);
  const dailyStats = calculateDailyStatistics(records);
  const dailyAverage = calculateDailyAverage(records);

  return {
    activeDays: Object.keys(dailyStats).length,
    dailyAverage,
    dailyStats,
    mostActiveType,
    percentages,
    statistics,
    totalRecords: records.length,
  };
};
