// 該文件提供時間追蹤功能的本地型別定義
// 以避免與共享包中的型別衝突

export interface TimeCalculationResult {
  duration: number;
  isValid: boolean;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export enum Tab {
  MAIN = "MAIN",
  WEEKLY_STATS = "WEEKLY_STATS",
  STATISTICS = "STATISTICS",
}

// 為了兼容性，從共享包導入一些型別
export {
  ActivityType,
  type TimeEntryFormData,
  type TimeRecord,
  type TimeStatistics,
  type TimeTrackerState,
  type UseLocalStorageReturn,
  type UserSettings,
  type UseTimeTrackerReturn,
  type UseUserSettingsReturn,
  type ValidationResult,
  type WeeklyStats,
  type WeekStartDay,
} from "@packages/shared/types/time-tracker.types";
