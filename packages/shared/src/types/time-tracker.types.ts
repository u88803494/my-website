export interface TimeRecord {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // in minutes
  activityType: ActivityType;
  description?: string;
  createdAt?: string;
}

export interface TimeStatistics {
  [ActivityType.WORK]: number;
  [ActivityType.STUDY]: number;
  [ActivityType.LISTENING]: number;
  [ActivityType.CHARACTER]: number;
  [ActivityType.EXTRA_STUDY]: number;
  [ActivityType.EXTRA_LISTENING]: number;
  [ActivityType.EXTRA_CHARACTER]: number;
  總計: number;
}

export interface TimeTrackerState {
  records: TimeRecord[];
  settings: UserSettings;
  currentWeek: string;
}

export interface UserSettings {
  timezone: string;
  weeklyGoal: number; // in minutes
  preferredView: 'weekly' | 'monthly';
  notificationEnabled: boolean;
  weekStartDay?: WeekStartDay;
}

export interface WeeklyStats {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  records: TimeRecord[];
  statistics: TimeStatistics;
}

export enum ActivityType {
  WORK = "WORK",
  STUDY = "STUDY",
  LISTENING = "LISTENING",
  CHARACTER = "CHARACTER",
  EXTRA_STUDY = "EXTRA_STUDY",
  EXTRA_LISTENING = "EXTRA_LISTENING",
  EXTRA_CHARACTER = "EXTRA_CHARACTER",
}

export type WeekStartDay = 'sunday' | 'monday';

// 使用者設定回傳值
export interface UseUserSettingsReturn {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  error?: string;
  loading?: boolean;
  value?: UserSettings;
}

// 時間條目表單值
export interface TimeEntryFormData {
  date: string;
  startTime: string;
  endTime: string;
  activityType: ActivityType;
  description?: string;
}

// 時間追蹤器回傳值
export interface UseTimeTrackerReturn {
  addRecord: (record: Omit<TimeRecord, 'id'>) => void;
  clearWeek: () => void;
  deleteRecord: (id: string) => void;
  error?: string;
  getWeeklyRecords: (weekStart: Date) => TimeRecord[];
  isLoading?: boolean;
  records: TimeRecord[];
  removeRecord: (id: string) => void;
  statistics: TimeStatistics;
  updateRecord: (id: string, updates: Partial<TimeRecord>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  weeklyStatistics: WeeklyStats;
  settings: UserSettings;
}

// 本地存儲回傳值
export interface UseLocalStorageReturn<T> {
  getItem: (key: string) => T | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: T) => void;
}

// 驗證錯誤
export interface ValidationError {
  field: string;
  message: string;
}

// 驗證結果
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}