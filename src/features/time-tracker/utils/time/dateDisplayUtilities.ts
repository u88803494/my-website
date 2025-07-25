/**
 * 日期顯示工具 - 處理台灣時區的日期顯示相關操作
 */

import { format, isToday, isYesterday } from "date-fns";
import { zhTW } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

import { formatDateInTaiwan, getTaiwanNow, TAIWAN_TIMEZONE } from "./timeUtilities";

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
 * 檢查日期是否為台灣時區的今天
 */
export const isTodayInTaiwan = (date: Date): boolean => {
  const taiwanDate = toZonedTime(date, TAIWAN_TIMEZONE);
  const taiwanToday = getTaiwanNow();
  return isToday(taiwanDate) && formatDateInTaiwan(taiwanDate) === formatDateInTaiwan(taiwanToday);
};
