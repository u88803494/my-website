import type { TimeCalculationResult } from "../types";

/**
 * 驗證時間格式 (HH:MM)
 */
export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * 將時間字串轉換為分鐘數
 */
export const timeStringToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * 將分鐘數轉換為時間字串
 */
export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

/**
 * 計算兩個時間之間的持續時間（分鐘）
 * 要求結束時間必須晚於開始時間（同一天內）
 */
export const calculateDuration = (startTime: string, endTime: string): TimeCalculationResult => {
  // 驗證時間格式
  if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
    return {
      duration: 0,
      error: "請輸入正確的時間格式 (HH:MM)",
      isValid: false,
    };
  }

  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);

  // 檢查結束時間是否早於開始時間
  if (endMinutes <= startMinutes) {
    return {
      duration: 0,
      error: "結束時間必須晚於開始時間",
      isValid: false,
    };
  }

  // 計算同一天內的持續時間
  const duration = endMinutes - startMinutes;

  // 驗證持續時間是否合理（雖然在上面的檢查後這個應該不會觸發）
  if (duration <= 0) {
    return {
      duration: 0,
      error: "持續時間必須大於零",
      isValid: false,
    };
  }

  if (duration > 24 * 60) {
    return {
      duration: 0,
      error: "單次記錄不能超過 24 小時",
      isValid: false,
    };
  }

  return {
    duration,
    isValid: true,
  };
};
