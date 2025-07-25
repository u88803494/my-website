/**
 * 時間追蹤功能內部類型定義
 */

// 重新匯出主要類型
export type {
  TimeEntryFormData,
  TimeRecord,
  TimeStatistics,
  UseLocalStorageReturn,
  UseTimeTrackerReturn,
  ValidationError,
  WeeklyData,
} from "@/types/time-tracker.types";

export { ActivityType } from "@/types/time-tracker.types";

// 工具函數類型
export interface TimeCalculationResult {
  duration: number; // 分鐘
  error?: string;
  isValid: boolean;
}

import type { ValidationError } from "@/types/time-tracker.types";

export interface ValidationResult {
  errors: ValidationError[];
  isValid: boolean;
}
