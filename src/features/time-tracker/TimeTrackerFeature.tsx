"use client";

import { BarChart3, List, Settings } from "lucide-react";
import React, { useState } from "react";

import TimeEntryForm from "./components/TimeEntryForm/TimeEntryForm";
import TimeRecordsList from "./components/TimeRecordsList/TimeRecordsList";
import TimeStatistics from "./components/TimeStatistics/TimeStatistics";
import { UserSettings } from "./components/UserSettings";
import WeeklyView from "./components/WeeklyView/WeeklyView";
import { TIME_TRACKER_I18N } from "./constants/i18n";
import { useTimeTracker } from "./hooks";
import { useUserSettings } from "./hooks";
import { getWeekStartInTaiwan } from "./utils/time";

/**
 * 時間追蹤主要功能元件
 * 整合所有子元件並管理主要狀態
 */
const TimeTrackerFeature: React.FC = () => {
  // Constants for repeated class names and strings
  const TAB_ACTIVE_CLASS = "tab-active";
  const ICON_CLASS = "mr-2 h-4 w-4";
  const CARD_BODY_CLASS = "card-body";

  // Tab constants
  const TAB_MAIN = "main";
  const TAB_WEEKLY_STATS = "weekly-stats";
  const TAB_STATISTICS = "statistics";

  // Tab display labels from i18n constants
  const { ALL_STATISTICS, WEEKLY_STATS } = TIME_TRACKER_I18N.TABS;

  // Tab handler functions
  const handleMainTab = () => setActiveTab(TAB_MAIN);
  const handleWeeklyStatsTab = () => setActiveTab(TAB_WEEKLY_STATS);
  const handleStatisticsTab = () => setActiveTab(TAB_STATISTICS);
  const { addRecord, deleteRecord, error, isLoading, records, statistics } = useTimeTracker();
  const { settings } = useUserSettings();
  const INITIAL_STATE = false;
  const [showSettings, setShowSettings] = useState(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<"main" | "statistics" | "weekly-stats">(TAB_WEEKLY_STATS);
  const [showAllRecords, setShowAllRecords] = useState(INITIAL_STATE);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStartInTaiwan(undefined, settings.weekStartDay),
  );

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

  // 決定顯示的記錄數量
  const displayRecords = showAllRecords ? records : records.slice(0, 5);

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

        {/* 頁籤導航 */}
        <div className="tabs tabs-boxed justify-center">
          <button className={`tab ${activeTab === TAB_MAIN ? TAB_ACTIVE_CLASS : ""}`} onClick={handleMainTab}>
            <List className={ICON_CLASS} />
            主要功能
          </button>
          <button
            className={`tab ${activeTab === TAB_WEEKLY_STATS ? TAB_ACTIVE_CLASS : ""}`}
            onClick={handleWeeklyStatsTab}
          >
            <BarChart3 className={ICON_CLASS} />
            {WEEKLY_STATS}
          </button>
          <button
            className={`tab ${activeTab === TAB_STATISTICS ? TAB_ACTIVE_CLASS : ""}`}
            onClick={handleStatisticsTab}
          >
            <BarChart3 className={ICON_CLASS} />
            {ALL_STATISTICS}
          </button>
        </div>

        {activeTab === TAB_MAIN ? (
          <>
            {/* 主要內容區域 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 左側：時間輸入表單 */}
              <div className="card bg-base-200 shadow-lg">
                <div className={CARD_BODY_CLASS}>
                  <h2 className="card-title mb-4 text-xl">新增時間記錄</h2>
                  <TimeEntryForm isLoading={isLoading} onSubmit={addRecord} />
                </div>
              </div>

              {/* 右側：記錄列表 */}
              <div className="card bg-base-200 shadow-lg">
                <div className={CARD_BODY_CLASS}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="card-title text-xl">最近記錄</h2>
                    <button className="btn btn-sm btn-outline" onClick={() => setShowAllRecords(!showAllRecords)}>
                      {showAllRecords ? "顯示較少" : "顯示全部"}
                    </button>
                  </div>
                  <TimeRecordsList
                    isLoading={isLoading}
                    maxItems={showAllRecords ? undefined : 5}
                    onDeleteRecord={deleteRecord}
                    records={displayRecords}
                  />
                  {!showAllRecords && records.length > 5 && (
                    <div className="text-base-content/60 mt-4 text-center text-sm">
                      還有 {records.length - 5} 筆記錄
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : activeTab === TAB_WEEKLY_STATS ? (
          <WeeklyView onWeekChange={setCurrentWeekStart} records={records} weekStart={currentWeekStart} />
        ) : (
          /* 詳細統計頁面 */
          <TimeStatistics records={records} statistics={statistics} />
        )}
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
