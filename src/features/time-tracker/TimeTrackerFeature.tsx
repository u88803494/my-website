"use client";

import { Settings } from "lucide-react";
import React, { useState } from "react";

import TimeEntryForm from "./components/TimeEntryForm/TimeEntryForm";
import TimeRecordsList from "./components/TimeRecordsList/TimeRecordsList";
import TimeStatistics from "./components/TimeStatistics/TimeStatistics";
import { UserSettings } from "./components/UserSettings";
import WeeklyView from "./components/WeeklyView/WeeklyView";
import { useTimeTracker, useUserSettings } from "./hooks";
import { getWeekStartInTaiwan } from "./utils/time";

/**
 * 時間追蹤主要功能元件
 * 整合所有子元件並管理主要狀態
 */
const TimeTrackerFeature: React.FC = () => {
  const { addRecord, deleteRecord, error, getWeeklyRecords, isLoading, records, statistics } = useTimeTracker();
  const { settings } = useUserSettings();
  const [showSettings, setShowSettings] = useState(false);

  const handleWeekChange = (weekStart: Date) => {
    // 週變更處理邏輯，目前暫時空實作
    console.log("Week changed to:", weekStart);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>發生錯誤：{error}</span>
        </div>
      </div>
    );
  }

  const currentWeekStart = getWeekStartInTaiwan(undefined, settings.weekStartDay);
  const weeklyRecords = getWeeklyRecords(currentWeekStart);

  return (
    <div className="bg-base-100 min-h-screen p-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* 頁面標題和設定按鈕 */}
        <div className="relative text-center">
          <h1 className="text-base-content mb-2 text-4xl font-bold">時間追蹤器</h1>
          <p className="text-base-content/70">記錄和分析你的時間分配，提升效率管理</p>

          {/* 設定按鈕 */}
          <button className="btn btn-ghost btn-sm absolute top-0 right-0" onClick={toggleSettings} title="開啟設定">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* 統計資料 */}
        <TimeStatistics statistics={statistics} />

        {/* 主要內容區域：表單與記錄並排 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* 左側：時間輸入表單 */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-4 text-xl">新增時間記錄</h2>
              <TimeEntryForm isLoading={isLoading} onSubmit={addRecord} />
            </div>
          </div>

          {/* 右側：記錄列表 */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-4 text-xl">最近記錄</h2>
              <TimeRecordsList
                isLoading={isLoading}
                maxItems={10}
                onDeleteRecord={deleteRecord}
                records={records.slice(0, 10)} // 只顯示最近 10 筆
              />
            </div>
          </div>
        </div>

        {/* 週視圖：佔據整個寬度 */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4 text-xl">本週統計</h2>
            <WeeklyView onWeekChange={handleWeekChange} records={weeklyRecords} weekStart={currentWeekStart} />
          </div>
        </div>
      </div>

      {/* 設定模態視窗 */}
      {showSettings && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">應用設定</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={toggleSettings}>
                ✕
              </button>
            </div>

            <UserSettings />

            <div className="modal-action">
              <button className="btn btn-primary" onClick={toggleSettings}>
                完成
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={toggleSettings} />
        </div>
      )}
    </div>
  );
};

export default TimeTrackerFeature;
