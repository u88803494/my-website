/**
 * 活動相關常數定義
 */

import { ActivityType, type WeekStartDay } from "../types";

/**
 * 活動類型選項常數
 */
export const ACTIVITY_TYPE_OPTIONS = [
  { label: ActivityType.STUDY, value: ActivityType.STUDY },
  { label: ActivityType.WORK, value: ActivityType.WORK },
  { label: ActivityType.CHARACTER, value: ActivityType.CHARACTER },
  { label: ActivityType.LISTENING, value: ActivityType.LISTENING },
  { label: ActivityType.EXTRA_STUDY, value: ActivityType.EXTRA_STUDY },
  { label: ActivityType.EXTRA_CHARACTER, value: ActivityType.EXTRA_CHARACTER },
  { label: ActivityType.EXTRA_LISTENING, value: ActivityType.EXTRA_LISTENING },
] as const;

/**
 * 預設週起始日（週四）
 */
export const DEFAULT_WEEK_START: WeekStartDay = "sunday";
