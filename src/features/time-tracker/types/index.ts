/**
 * 時間追蹤功能的核心類型定義
 */

// 週起始日類型定義
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = 週日 … 6 = 週六
export const DEFAULT_WEEK_START: WeekStartDay = 0; // 專案預設週日

// 活動類型枚舉
export enum ActivityType {
  CHARACTER = "品格",
  EXTRA_CHARACTER = "額外品格",
  EXTRA_STUDY = "額外讀書",
  STUDY = "讀書",
  WORK = "工作",
}

// 表單資料介面
export interface TimeEntryFormData {
  activityType: ActivityType;
  /**
   * 記錄日期（YYYY-MM-DD 格式，必填）
   */
  date: string;
  description?: string;
  endTime: string;
  startTime: string;
}

// 時間記錄介面
export interface TimeRecord {
  activityType: ActivityType;
  createdAt: Date;
  date: string; // YYYY-MM-DD 格式
  description?: string;
  duration: number; // 分鐘
  endTime: string; // HH:MM 格式
  id: string;
  startTime: string; // HH:MM 格式
}

// 時間統計介面
export interface TimeStatistics {
  [ActivityType.CHARACTER]: number;
  [ActivityType.EXTRA_CHARACTER]: number;
  [ActivityType.EXTRA_STUDY]: number;
  [ActivityType.STUDY]: number;
  [ActivityType.WORK]: number;
  總計: number;
}

export interface UseLocalStorageReturn<T> {
  error: null | string;
  loading: boolean;
  setValue: (value: ((prevValue: T) => T) | T) => void;
  value: T;
}

// 使用者設定介面
export interface UserSettings {
  weekStartDay: WeekStartDay;
}

// Hook 返回類型
export interface UseTimeTrackerReturn {
  addRecord: (record: Omit<TimeRecord, "createdAt" | "id">) => void;
  clearWeek: () => void;
  deleteRecord: (id: string) => void;
  error: null | string;
  getWeeklyRecords: (weekStart: Date) => TimeRecord[];
  isLoading: boolean;
  records: TimeRecord[];
  statistics: TimeStatistics;
}

export interface UseUserSettingsReturn {
  error: null | string;
  isLoading: boolean;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

// 驗證錯誤介面
export interface ValidationError {
  field: string;
  message: string;
}

// 週資料介面
export interface WeeklyData {
  records: TimeRecord[];
  statistics: TimeStatistics;
  weekStart: string; // YYYY-MM-DD 格式
}

// 活動類型選項常數
export const ACTIVITY_TYPE_OPTIONS = [
  { label: ActivityType.STUDY, value: ActivityType.STUDY },
  { label: ActivityType.WORK, value: ActivityType.WORK },
  { label: ActivityType.CHARACTER, value: ActivityType.CHARACTER },
  { label: ActivityType.EXTRA_STUDY, value: ActivityType.EXTRA_STUDY },
  { label: ActivityType.EXTRA_CHARACTER, value: ActivityType.EXTRA_CHARACTER },
] as const;

// 工具函數類型
export interface TimeCalculationResult {
  duration: number; // 分鐘
  error?: string;
  isValid: boolean;
}

export interface ValidationResult {
  errors: ValidationError[];
  isValid: boolean;
}
