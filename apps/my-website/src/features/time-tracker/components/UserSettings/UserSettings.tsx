"use client";

import { Settings } from "lucide-react";
import React, { useCallback } from "react";

import type { UserSettings, WeekStartDay } from "@/features/time-tracker/types";

import { useUserSettings } from "../../hooks";

/**
 * 週起始日選項常數
 */
const WEEK_START_OPTIONS = [
  { label: "週日", value: 0 as WeekStartDay },
  { label: "週一", value: 1 as WeekStartDay },
  { label: "週二", value: 2 as WeekStartDay },
  { label: "週三", value: 3 as WeekStartDay },
  { label: "週四", value: 4 as WeekStartDay },
  { label: "週五", value: 5 as WeekStartDay },
  { label: "週六", value: 6 as WeekStartDay },
] as const;

/**
 * 用戶設定組件
 * 提供週起始日等個人化設定選項
 */
const UserSettings: React.FC = () => {
  const { isLoading, settings, updateSettings } = useUserSettings();

  const handleWeekStartDayChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newWeekStartDay = parseInt(event.target.value, 10) as WeekStartDay;
      updateSettings({ weekStartDay: newWeekStartDay });
    },
    [updateSettings],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="loading loading-spinner loading-sm" />
        <span className="ml-2">載入設定中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 標題 */}
      <div className="flex items-center gap-2">
        <Settings aria-hidden="true" className="text-primary h-5 w-5" />
        <h3 className="text-base-content font-medium">用戶設定</h3>
      </div>

      {/* 設定表單 */}
      <div className="bg-base-100 space-y-4 rounded-lg border p-4">
        {/* 週起始日設定 */}
        <div className="form-control">
          <label className="label" htmlFor="week-start-day-select">
            <span className="label-text font-medium">週起始日</span>
            <span className="label-text-alt text-xs">設定週視圖的第一天</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            id="week-start-day-select"
            onChange={handleWeekStartDayChange}
            value={settings.weekStartDay}
          >
            {WEEK_START_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt text-xs opacity-70">更改此設定會立即影響週視圖的顯示方式</span>
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
              <p className="mb-1 font-medium">設定說明</p>
              <ul className="list-inside list-disc space-y-1 text-xs opacity-80">
                <li>週起始日設定會影響週視圖、統計計算等功能</li>
                <li>設定會自動儲存到本地儲存空間</li>
                <li>預設為週日開始（與多數日曆應用一致）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
