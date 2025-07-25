/**
 * 週期工具 - 處理台灣時區的週相關操作
 */

import { eachDayOfInterval, endOfWeek, format, isSameWeek, startOfWeek } from "date-fns";
import { zhTW } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

import { getTaiwanNow, TAIWAN_TIMEZONE } from "./timeUtilities";

/**
 * 獲取指定日期在台灣時區的週開始日期（週一）
 */
export const getWeekStartInTaiwan = (date: Date = getTaiwanNow()): Date => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  return startOfWeek(taiwanDate, { weekStartsOn: 1 }); // 週一開始
};

/**
 * 獲取指定日期在台灣時區的週結束日期（週日）
 */
export const getWeekEndInTaiwan = (date: Date = getTaiwanNow()): Date => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  return endOfWeek(taiwanDate, { weekStartsOn: 1 }); // 週一開始，所以週日結束
};

/**
 * 檢查兩個日期是否在台灣時區的同一週
 */
export const isSameWeekInTaiwan = (date1: Date, date2: Date): boolean => {
  const taiwanDate1 = toZonedTime(date1, TAIWAN_TIMEZONE);
  const taiwanDate2 = toZonedTime(date2, TAIWAN_TIMEZONE);
  return isSameWeek(taiwanDate1, taiwanDate2, { weekStartsOn: 1 });
};

/**
 * 獲取週的日期範圍字串（台灣時區）
 */
export const getWeekRangeStringInTaiwan = (date: Date = getTaiwanNow()): string => {
  const weekStart = getWeekStartInTaiwan(date);
  const weekEnd = getWeekEndInTaiwan(date);

  const startStr = format(weekStart, "M/d", { locale: zhTW });
  const endStr = format(weekEnd, "M/d", { locale: zhTW });

  return `${startStr} - ${endStr}`;
};

/**
 * 獲取本週的所有日期（台灣時區）
 */
export const getWeekDatesInTaiwan = (date: Date = getTaiwanNow()): Date[] => {
  const weekStart = getWeekStartInTaiwan(date);
  const weekEnd = getWeekEndInTaiwan(date);

  return eachDayOfInterval({ end: weekEnd, start: weekStart });
};

/**
 * 檢查日期是否為台灣時區的本週
 */
export const isThisWeekInTaiwan = (date: Date): boolean => {
  const taiwanToday = getTaiwanNow();
  return isSameWeekInTaiwan(date, taiwanToday);
};
