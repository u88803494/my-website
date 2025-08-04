/**
 * 時間基礎工具 - 處理台灣時區的基本時間操作
 */

import { format, parseISO } from "date-fns";
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
