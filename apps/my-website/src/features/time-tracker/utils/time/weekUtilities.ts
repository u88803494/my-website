/**
 * 週期工具 - 處理台灣時區的週相關操作
 */

import { DEFAULT_WEEK_START } from "@/features/time-tracker/constants";
import type { WeekStartDay } from "@/features/time-tracker/types";
import { eachDayOfInterval, endOfWeek, format, isSameWeek, startOfWeek } from "date-fns";
import { zhTW } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

import { getTaiwanNow, TAIWAN_TIMEZONE } from "./timeUtilities";

/**
 * 獲取指定日期在台灣時區的週開始日期
 * @param date - 指定日期，預設為現在
 * @param weekStartDay - 週起始日 (0-6，0為週日)，預設為專案設定值
 */
export const getWeekStartInTaiwan = (
  date: Date = getTaiwanNow(),
  weekStartDay: WeekStartDay = DEFAULT_WEEK_START,
): Date => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  return startOfWeek(taiwanDate, { weekStartsOn: weekStartDay });
};

/**
 * 獲取指定日期在台灣時區的週結束日期
 * @param date - 指定日期，預設為現在
 * @param weekStartDay - 週起始日 (0-6，0為週日)，預設為專案設定值
 */
export const getWeekEndInTaiwan = (
  date: Date = getTaiwanNow(),
  weekStartDay: WeekStartDay = DEFAULT_WEEK_START,
): Date => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  return endOfWeek(taiwanDate, { weekStartsOn: weekStartDay });
};

/**
 * 檢查兩個日期是否在台灣時區的同一週
 * @param date1 - 第一個日期
 * @param date2 - 第二個日期
 * @param weekStartDay - 週起始日 (0-6，0為週日)，預設為專案設定值
 */
export const isSameWeekInTaiwan = (
  date1: Date,
  date2: Date,
  weekStartDay: WeekStartDay = DEFAULT_WEEK_START,
): boolean => {
  const taiwanDate1 = toZonedTime(date1, TAIWAN_TIMEZONE);
  const taiwanDate2 = toZonedTime(date2, TAIWAN_TIMEZONE);
  return isSameWeek(taiwanDate1, taiwanDate2, { weekStartsOn: weekStartDay });
};

/**
 * 獲取週的日期範圍字串（台灣時區）
 * @param date - 指定日期，預設為現在
 * @param weekStartDay - 週起始日 (0-6，0為週日)，預設為專案設定值
 */
export const getWeekRangeStringInTaiwan = (
  date: Date = getTaiwanNow(),
  weekStartDay: WeekStartDay = DEFAULT_WEEK_START,
): string => {
  const weekStart = getWeekStartInTaiwan(date, weekStartDay);
  const weekEnd = getWeekEndInTaiwan(date, weekStartDay);

  const startStr = format(weekStart, "M/d", { locale: zhTW });
  const endStr = format(weekEnd, "M/d", { locale: zhTW });

  return `${startStr} - ${endStr}`;
};

/**
 * 獲取本週的所有日期（台灣時區）
 * @param date - 指定日期，預設為現在
 * @param weekStartDay - 週起始日 (0-6，0為週日)，預設為專案設定值
 */
export const getWeekDatesInTaiwan = (
  date: Date = getTaiwanNow(),
  weekStartDay: WeekStartDay = DEFAULT_WEEK_START,
): Date[] => {
  const weekStart = getWeekStartInTaiwan(date, weekStartDay);
  const weekEnd = getWeekEndInTaiwan(date, weekStartDay);

  return eachDayOfInterval({ end: weekEnd, start: weekStart });
};

/**
 * 檢查日期是否為台灣時區的本週
 * @param date - 要檢查的日期
 * @param weekStartDay - 週起始日 (0-6，0為週日)，預設為專案設定值
 */
export const isThisWeekInTaiwan = (date: Date, weekStartDay: WeekStartDay = DEFAULT_WEEK_START): boolean => {
  const taiwanToday = getTaiwanNow();
  return isSameWeekInTaiwan(date, taiwanToday, weekStartDay);
};
