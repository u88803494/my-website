/**
 * 統一的時區管理工具
 * 使用 date-fns 和 date-fns-tz 來確保所有時間操作都使用台灣時區
 */

import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameWeek,
  isToday,
  isYesterday,
  parseISO,
  startOfWeek,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

// 定義台灣時區
export const TAIWAN_TIMEZONE = "Asia/Taipei";

/**
 * 獲取當前台灣時間的 Date 物件
 */
export const getTaiwanNow = (): Date => {
  return toZonedTime(new Date(), TAIWAN_TIMEZONE);
};

/**
 * 獲取當前台灣日期的字串格式 (YYYY-MM-DD)
 */
export const getCurrentTaiwanDate = (): string => {
  const taiwanNow = getTaiwanNow();
  return format(taiwanNow, "yyyy-MM-dd");
};

/**
 * 獲取當前台灣時間的字串格式 (HH:mm)
 */
export const getCurrentTaiwanTime = (): string => {
  const taiwanNow = getTaiwanNow();
  return format(taiwanNow, "HH:mm");
};

/**
 * 將日期格式化為台灣時區的字串 (YYYY-MM-DD)
 */
export const formatDateInTaiwan = (date: Date): string => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  return format(taiwanDate, "yyyy-MM-dd");
};

/**
 * 將時間格式化為台灣時區的字串 (HH:mm)
 */
export const formatTimeInTaiwan = (date: Date): string => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  return format(taiwanDate, "HH:mm");
};

/**
 * 解析日期字串並轉換為台灣時區的 Date 物件
 */
export const parseDateInTaiwan = (dateString: string): Date => {
  // 假設輸入的日期字串是台灣時區的日期
  const parsedDate = parseISO(`${dateString}T00:00:00`);
  return toZonedTime(parsedDate, TAIWAN_TIMEZONE);
};

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
 * 獲取日期的顯示名稱（包含星期，台灣時區）
 */
export const getDateDisplayNameInTaiwan = (date: Date): string => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);

  if (isToday(taiwanDate)) {
    return "今天";
  } else if (isYesterday(taiwanDate)) {
    return "昨天";
  } else {
    return format(taiwanDate, "M/d (E)", { locale: zhTW });
  }
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
 * 檢查日期是否為台灣時區的今天
 */
export const isTodayInTaiwan = (date: Date): boolean => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  const taiwanToday = getTaiwanNow();
  return isToday(taiwanDate) && formatDateInTaiwan(taiwanDate) === formatDateInTaiwan(taiwanToday);
};

/**
 * 檢查日期是否為台灣時區的本週
 */
export const isThisWeekInTaiwan = (date: Date): boolean => {
  const taiwanToday = getTaiwanNow();
  return isSameWeekInTaiwan(date, taiwanToday);
};

/**
 * 從日期和時間字串創建完整的台灣時區 Date 物件
 * @param dateString YYYY-MM-DD 格式的日期字串
 * @param timeString HH:mm 格式的時間字串
 */
export const createTaiwanDateTime = (dateString: string, timeString: string): Date => {
  const dateTimeString = `${dateString}T${timeString}:00`;
  const localDate = parseISO(dateTimeString);
  // 將本地時間視為台灣時間並轉換為 UTC
  return fromZonedTime(localDate, TAIWAN_TIMEZONE);
};
