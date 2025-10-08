import { DEFAULT_WEEK_START, WEEKLY_GOAL_DEFAULT } from "@packages/shared/constants";
import { type UseUserSettingsReturn } from "@packages/shared/types";
import { useCallback } from "react";

import type { UserSettings } from "../types";
import { useLocalStorage } from "./useLocalStorage";

// 使用者設定的 localStorage key
const USER_SETTINGS_KEY = "tt-user-settings";

// 預設設定
const DEFAULT_SETTINGS: UserSettings = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  weeklyGoal: WEEKLY_GOAL_DEFAULT,
  preferredView: "weekly",
  notificationEnabled: true,
  weekStartDay: DEFAULT_WEEK_START,
};

/**
 * 使用者設定管理 Hook
 *
 * 提供使用者設定的讀取、更新功能，並支援 localStorage 持久化儲存
 *
 * @returns {UseUserSettingsReturn} 包含設定資料、更新函數、載入狀態和錯誤資訊
 */
export const useUserSettings = (): UseUserSettingsReturn => {
  const {
    error,
    loading: isLoading,
    setValue: setSettings,
    value: settings,
  } = useLocalStorage<UserSettings>(USER_SETTINGS_KEY, DEFAULT_SETTINGS);

  /**
   * 更新使用者設定
   * 支援部分更新，會與現有設定合併
   *
   * @param newSettings - 要更新的設定（支援部分更新）
   */
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>): void => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...newSettings,
      }));
    },
    [setSettings],
  );

  return {
    error: error || undefined,
    loading: isLoading,
    settings,
    updateSettings,
  };
};

export default useUserSettings;
