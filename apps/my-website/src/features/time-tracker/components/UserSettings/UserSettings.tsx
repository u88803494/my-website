"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo } from "react";

import type { UserSettings, WeekStartDay } from "@/features/time-tracker/types";

import { useUserSettings } from "../../hooks";

/**
 * 用戶設定組件
 * 提供週起始日等個人化設定選項
 */
const UserSettings: React.FC = () => {
  const t = useTranslations("TimeTracker");
  const { isLoading, settings, updateSettings } = useUserSettings();

  // Build week start options with translations
  const weekStartOptions = useMemo(() => {
    const weekdayKeys: Array<{ key: string; value: WeekStartDay }> = [
      { key: "sunday", value: 0 },
      { key: "monday", value: 1 },
      { key: "tuesday", value: 2 },
      { key: "wednesday", value: 3 },
      { key: "thursday", value: 4 },
      { key: "friday", value: 5 },
      { key: "saturday", value: 6 },
    ];
    return weekdayKeys.map(({ key, value }) => ({
      label: t(`settings.weekdays.${key}`),
      value,
    }));
  }, [t]);

  const handleWeekStartDayChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const parsed = parseInt(event.target.value, 10);
      // 運行時驗證，確保是有效的 WeekStartDay (0-6)
      if (parsed >= 0 && parsed <= 6) {
        updateSettings({ weekStartDay: parsed as WeekStartDay });
      }
    },
    [updateSettings],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="loading loading-spinner loading-sm" />
        <span className="ml-2">{t("settings.loadingSettings")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 標題 */}
      <div className="flex items-center gap-2">
        <Settings aria-hidden="true" className="text-primary h-5 w-5" />
        <h3 className="text-base-content font-medium">{t("settings.userSettings")}</h3>
      </div>

      {/* 設定表單 */}
      <div className="bg-base-100 space-y-4 rounded-lg border p-4">
        {/* 週起始日設定 */}
        <div className="form-control">
          <label className="label" htmlFor="week-start-day-select">
            <span className="label-text font-medium">{t("settings.weekStartDay")}</span>
            <span className="label-text-alt text-xs">{t("settings.weekStartDayDescription")}</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            id="week-start-day-select"
            onChange={handleWeekStartDayChange}
            value={settings.weekStartDay}
          >
            {weekStartOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt text-xs opacity-70">{t("settings.weekStartDayNote")}</span>
          </label>
        </div>

        {/* 設定說明 */}
        <div className="alert alert-info">
          <div className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <div className="text-sm">
              <p className="mb-1 font-medium">{t("settings.settingsInfo")}</p>
              <ul className="list-inside list-disc space-y-1 text-xs opacity-80">
                <li>{t("settings.settingsInfoItem1")}</li>
                <li>{t("settings.settingsInfoItem2")}</li>
                <li>{t("settings.settingsInfoItem3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
