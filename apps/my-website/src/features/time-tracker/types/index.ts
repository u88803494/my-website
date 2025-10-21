/**
 * 時間追蹤功能的核心類型定義
 */

// 活動類型枚舉
export enum ActivityType {
  CHARACTER = "品格",
  EXTRA_CHARACTER = "額外品格",
  EXTRA_LISTENING = "額外聽析",
  EXTRA_STUDY = "額外讀書",
  LISTENING = "聽析",
  STUDY = "讀書",
  WORK = "工作",
}

// 工具函數類型
export interface TimeCalculationResult {
  duration: number; // 分鐘
  error?: string;
  isValid: boolean;
}

// 表單資料介面
export interface TimeEntryFormData {
  activityType: ActivityType | "";
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
  [ActivityType.EXTRA_LISTENING]: number;
  [ActivityType.EXTRA_STUDY]: number;
  [ActivityType.LISTENING]: number;
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

export interface ValidationResult {
  errors: ValidationError[];
  isValid: boolean;
}

// 週資料介面
export interface WeeklyData {
  records: TimeRecord[];
  statistics: TimeStatistics;
  weekStart: string; // YYYY-MM-DD 格式
}

// 週起始日類型定義
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = 週日, 1 = 週一, ..., 6 = 週六

// 頁籤類型
export * from "./tabs";
