/**
 * 日期相關的工具函數
 */

/**
 * 獲取當前日期的字串格式 (YYYY-MM-DD)
 */
export const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * 格式化日期為字串 (YYYY-MM-DD)
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 獲取指定日期所在週的週一
 */
export const getWeekStart = (date: Date = new Date()): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 調整為週一開始
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

/**
 * 獲取指定日期所在週的週日
 */
export const getWeekEnd = (date: Date = new Date()): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

/**
 * 檢查兩個日期是否在同一週
 */
export const isSameWeek = (date1: Date, date2: Date): boolean => {
  const week1Start = getWeekStart(date1);
  const week2Start = getWeekStart(date2);

  return week1Start.getTime() === week2Start.getTime();
};

/**
 * 獲取週的日期範圍字串
 */
export const getWeekRangeString = (date: Date = new Date()): string => {
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);

  const startStr = weekStart.toLocaleDateString("zh-TW", {
    day: "numeric",
    month: "numeric",
  });

  const endStr = weekEnd.toLocaleDateString("zh-TW", {
    day: "numeric",
    month: "numeric",
  });

  return `${startStr} - ${endStr}`;
};

/**
 * 獲取日期的顯示名稱（包含星期）
 */
export const getDateDisplayName = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateStr = formatDate(date);
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  if (dateStr === todayStr) {
    return "今天";
  } else if (dateStr === yesterdayStr) {
    return "昨天";
  } else {
    return date.toLocaleDateString("zh-TW", {
      day: "numeric",
      month: "numeric",
      weekday: "short",
    });
  }
};

/**
 * 獲取本週的所有日期
 */
export const getWeekDates = (date: Date = new Date()): Date[] => {
  const weekStart = getWeekStart(date);
  const dates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    dates.push(currentDate);
  }

  return dates;
};

/**
 * 檢查日期是否為今天
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDate(date) === formatDate(today);
};

/**
 * 檢查日期是否為本週
 */
export const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  return isSameWeek(date, today);
};
