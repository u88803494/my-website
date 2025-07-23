/**
 * 時區測試工具
 * 用於驗證時區設定是否正確運作
 */

import {
  formatDateInTaiwan,
  getCurrentTaiwanDate,
  getCurrentTaiwanTime,
  getTaiwanNow,
  getWeekStartInTaiwan,
  isTodayInTaiwan,
  TAIWAN_TIMEZONE,
} from "../utils/timezoneHelpers";

/**
 * 測試並輸出時區相關資訊
 */
export const testTimezone = () => {
  console.log("=== 時區測試結果 ===");
  console.log(`設定時區: ${TAIWAN_TIMEZONE}`);
  console.log(`系統時區: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  console.log(`當前台灣時間: ${getTaiwanNow()}`);
  console.log(`當前台灣日期: ${getCurrentTaiwanDate()}`);
  console.log(`當前台灣時間 (HH:mm): ${getCurrentTaiwanTime()}`);
  console.log(`本週開始日期: ${formatDateInTaiwan(getWeekStartInTaiwan())}`);
  console.log(`今天是否為台灣時區的今天: ${isTodayInTaiwan(new Date())}`);
  console.log("=====================");
};

/**
 * 比較本地時間與台灣時間的差異
 */
export const compareTimezones = () => {
  const now = new Date();
  const taiwanNow = getTaiwanNow();

  console.log("=== 時間比較 ===");
  console.log(`UTC 時間: ${now.toISOString()}`);
  console.log(`本地時間: ${now.toLocaleString()}`);
  console.log(`台灣時間: ${taiwanNow.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`);
  console.log(`時差 (分鐘): ${(taiwanNow.getTime() - now.getTime()) / (1000 * 60)}`);
  console.log("===============");
};
