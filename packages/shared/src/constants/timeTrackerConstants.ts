import { ActivityType, type WeekStartDay } from "../types/time-tracker.types";

export const TIME_ENTRY_DEFAULTS = {
  startTime: "09:00",
  endTime: "10:00",
  duration: 60,
};

export const ACTIVITY_TYPE_CONFIG = {
  [ActivityType.WORK]: {
    label: "工作",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  [ActivityType.STUDY]: {
    label: "學習",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [ActivityType.LISTENING]: {
    label: "聽力",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [ActivityType.CHARACTER]: {
    label: "品格",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  [ActivityType.EXTRA_STUDY]: {
    label: "額外學習",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  [ActivityType.EXTRA_LISTENING]: {
    label: "額外聽力",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  [ActivityType.EXTRA_CHARACTER]: {
    label: "額外品格",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
} as const;

// Define the options for activity type selection
export const ACTIVITY_TYPE_OPTIONS = [
  { value: ActivityType.WORK, label: "工作" },
  { value: ActivityType.STUDY, label: "學習" },
  { value: ActivityType.LISTENING, label: "聽力" },
  { value: ActivityType.CHARACTER, label: "品格" },
  { value: ActivityType.EXTRA_STUDY, label: "額外學習" },
  { value: ActivityType.EXTRA_LISTENING, label: "額外聽力" },
  { value: ActivityType.EXTRA_CHARACTER, label: "額外品格" },
];

export const WEEKLY_GOAL_DEFAULT = 40 * 60; // 40 hours in minutes

export const DEFAULT_WEEK_START: WeekStartDay = 'monday';