import type { TimeRecord, TimeStatistics } from "@/features/time-tracker/types";
import { ActivityType } from "@/features/time-tracker/types";

/**
 * 初始化空的統計資料
 */
export const createEmptyStatistics = (): TimeStatistics => ({
  [ActivityType.CHARACTER]: 0,
  [ActivityType.EXTRA_CHARACTER]: 0,
  [ActivityType.EXTRA_LISTENING]: 0,
  [ActivityType.EXTRA_STUDY]: 0,
  [ActivityType.LISTENING]: 0,
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
      [ActivityType.EXTRA_LISTENING]: 0,
      [ActivityType.EXTRA_STUDY]: 0,
      [ActivityType.LISTENING]: 0,
      [ActivityType.STUDY]: 0,
      [ActivityType.WORK]: 0,
    };
  }

  return {
    [ActivityType.CHARACTER]: Math.round((statistics[ActivityType.CHARACTER] / total) * 100),
    [ActivityType.EXTRA_CHARACTER]: Math.round((statistics[ActivityType.EXTRA_CHARACTER] / total) * 100),
    [ActivityType.EXTRA_LISTENING]: Math.round((statistics[ActivityType.EXTRA_LISTENING] / total) * 100),
    [ActivityType.EXTRA_STUDY]: Math.round((statistics[ActivityType.EXTRA_STUDY] / total) * 100),
    [ActivityType.LISTENING]: Math.round((statistics[ActivityType.LISTENING] / total) * 100),
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

  // 使用 ActivityType enum 來遍歷，避免type assertion
  Object.values(ActivityType).forEach((activityType) => {
    const duration = statistics[activityType];
    if (duration > maxDuration) {
      maxDuration = duration;
      mostActiveType = activityType;
    }
  });

  return mostActiveType;
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

    const stats = dailyStats[record.date];
    if (stats) {
      stats[record.activityType] += record.duration;
      stats.總計 += record.duration;
    }
  });

  return dailyStats;
};

/**
 * 週分類總計介面
 */
export interface WeeklyCategoryTotals {
  character: number; // CHARACTER + EXTRA_CHARACTER
  listening: number; // LISTENING + EXTRA_LISTENING
  study: number; // STUDY + EXTRA_STUDY
  work: number; // WORK
}

/**
 * 計算週分類總計
 */
export const getWeeklyCategoryTotals = (records: TimeRecord[]): WeeklyCategoryTotals => {
  return records.reduce(
    (totals, record) => {
      switch (record.activityType) {
        case ActivityType.CHARACTER:
        case ActivityType.EXTRA_CHARACTER:
          totals.character += record.duration;
          break;
        case ActivityType.EXTRA_LISTENING:
        case ActivityType.LISTENING:
          totals.listening += record.duration;
          break;
        case ActivityType.EXTRA_STUDY:
        case ActivityType.STUDY:
          totals.study += record.duration;
          break;
        case ActivityType.WORK:
          totals.work += record.duration;
          break;
      }
      return totals;
    },
    { character: 0, listening: 0, study: 0, work: 0 },
  );
};

/**
 * 計算週統計摘要
 */
export const calculateWeeklySummary = (records: TimeRecord[]) => {
  const statistics = calculateStatistics(records);
  const percentages = calculateActivityPercentages(statistics);
  const mostActiveType = getMostActiveType(statistics);
  const dailyStats = calculateDailyStatistics(records);

  return {
    activeDays: Object.keys(dailyStats).length,
    dailyStats,
    mostActiveType,
    percentages,
    statistics,
    totalRecords: records.length,
  };
};

/**
 * 計算週統計的最多時間活動
 */
export const getWeeklyTopActivity = (categoryTotals: WeeklyCategoryTotals): string => {
  const activities = [
    { name: "Reading", value: categoryTotals.study },
    { name: "Working", value: categoryTotals.work },
    { name: "Character", value: categoryTotals.character },
    { name: "Listening", value: categoryTotals.listening },
  ];
  const maxActivity = activities.reduce((prev, current) => (prev.value > current.value ? prev : current));
  return maxActivity.value > 0 ? maxActivity.name : "無";
};

/**
 * 計算週統計的活動類型數量
 */
export const getWeeklyActiveTypesCount = (categoryTotals: WeeklyCategoryTotals): number => {
  return [categoryTotals.study, categoryTotals.work, categoryTotals.character, categoryTotals.listening].filter(
    (value) => value > 0,
  ).length;
};

/**
 * 計算週統計的平均時長
 */
export const getWeeklyAverageTime = (categoryTotals: WeeklyCategoryTotals): number => {
  const totalTime = categoryTotals.character + categoryTotals.study + categoryTotals.work + categoryTotals.listening;
  const activeTypes = getWeeklyActiveTypesCount(categoryTotals);
  return activeTypes > 0 ? Math.round(totalTime / activeTypes) : 0;
};

/**
 * 計算週統計的總時數
 */
export const getWeeklyTotalHours = (categoryTotals: WeeklyCategoryTotals): number => {
  const totalTime = categoryTotals.character + categoryTotals.study + categoryTotals.work + categoryTotals.listening;
  return Number((totalTime / 60).toFixed(1));
};

/**
 * 計算百分比的通用函數
 */
export const calculatePercentage = (value: number, total: number): number => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};
