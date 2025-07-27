"use client";

import { BarChart3, List, Settings } from "lucide-react";
import React, { useState } from "react";

import { ActivityType } from "@/features/time-tracker/types";

import TimeEntryForm from "./components/TimeEntryForm/TimeEntryForm";
import TimeRecordsList from "./components/TimeRecordsList/TimeRecordsList";
import StatisticsCard from "./components/TimeStatistics/StatisticsCard";
import TimeStatistics from "./components/TimeStatistics/TimeStatistics";
import { UserSettings } from "./components/UserSettings";
import WeeklyView from "./components/WeeklyView/WeeklyView";
import { useTimeTracker, useUserSettings } from "./hooks";
import { formatMinutesToHours } from "./utils/formatting";
import { calculateStatistics, calculateWeeklySummary } from "./utils/statisticsCalculation";
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

  // Tab handler functions
  const handleMainTab = () => setActiveTab(TAB_MAIN);
  const handleWeeklyStatsTab = () => setActiveTab(TAB_WEEKLY_STATS);
  const handleStatisticsTab = () => setActiveTab(TAB_STATISTICS);
  const { addRecord, deleteRecord, error, getWeeklyRecords, isLoading, records, statistics } = useTimeTracker();
  const { settings } = useUserSettings();
  const INITIAL_STATE = false;
  const [showSettings, setShowSettings] = useState(INITIAL_STATE);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartInTaiwan(undefined, settings.weekStartDay));
  const [activeTab, setActiveTab] = useState<"main" | "statistics" | "weekly-stats">(TAB_MAIN);
  const [showAllRecords, setShowAllRecords] = useState(INITIAL_STATE);

  const handleWeekChange = (weekStart: Date) => {
    setCurrentWeekStart(weekStart);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // 計算本週統計
  const weeklyRecords = getWeeklyRecords(currentWeekStart);
  const weeklyStatistics = calculateStatistics(weeklyRecords);
  const weeklySummary = calculateWeeklySummary(weeklyRecords);

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
            Weekly Stats
          </button>
          <button
            className={`tab ${activeTab === TAB_STATISTICS ? TAB_ACTIVE_CLASS : ""}`}
            onClick={handleStatisticsTab}
          >
            <BarChart3 className={ICON_CLASS} />
            All Stats
          </button>
        </div>

        {activeTab === TAB_MAIN ? (
          <>
            {/* 簡化統計 - 只顯示本週時間 */}
            <div className="mb-6 flex justify-center">
              <div className="card bg-base-200 w-full max-w-md shadow-lg">
                <div className="card-body text-center">
                  <h3 className="mb-2 text-lg font-semibold">本週時間</h3>
                  <div className="text-primary text-4xl font-bold">{formatMinutesToHours(weeklyStatistics.總計)}</div>
                  <div className="text-base-content/60 text-sm">{(weeklyStatistics.總計 / 60).toFixed(1)} 小時</div>
                </div>
              </div>
            </div>

            {/* 主要內容區域 */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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

            {/* 週視圖 */}
            <div className="card bg-base-200 shadow-lg">
              <div className={CARD_BODY_CLASS}>
                <h2 className="card-title mb-4 text-xl">本週統計</h2>
                <WeeklyView onWeekChange={handleWeekChange} records={weeklyRecords} weekStart={currentWeekStart} />
              </div>
            </div>
          </>
        ) : activeTab === TAB_WEEKLY_STATS ? (
          /* Weekly Stats 頁面 - 卡片格式 */
          <div className="space-y-4">
            {/* 標題區域 */}
            <div className="flex items-center gap-2">
              <BarChart3 aria-hidden="true" className="text-primary h-5 w-5" />
              <h2 className="text-base-content text-xl font-semibold">Weekly Statistics</h2>
            </div>

            {/* 統計卡片網格 - 分為兩排 */}
            <div className="space-y-4">
              {/* 第一排：總計時間 */}
              <div className="grid grid-cols-1 gap-4">
                <StatisticsCard isTotal={true} label="本週總計" value={weeklyStatistics.總計} />
              </div>

              {/* 第二排：各活動類型 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <StatisticsCard
                  activityType={ActivityType.WORK}
                  label="工作時間"
                  value={weeklyStatistics[ActivityType.WORK]}
                />
                <StatisticsCard
                  activityType={ActivityType.STUDY}
                  label="讀書時間"
                  value={weeklyStatistics[ActivityType.STUDY] + weeklyStatistics[ActivityType.EXTRA_STUDY]}
                />
                <StatisticsCard
                  activityType={ActivityType.CHARACTER}
                  label="品格時間"
                  value={weeklyStatistics[ActivityType.CHARACTER] + weeklyStatistics[ActivityType.EXTRA_CHARACTER]}
                />
              </div>
            </div>

            {/* 週統計摘要 */}
            {weeklyStatistics.總計 > 0 && (
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-base-content mb-2 font-medium">週統計摘要</h3>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-base-content/60">活躍天數：</span>
                    <span className="ml-1 font-medium">{weeklySummary.activeDays} 天</span>
                  </div>
                  <div>
                    <span className="text-base-content/60">記錄數：</span>
                    <span className="ml-1 font-medium">{weeklyRecords.length} 筆</span>
                  </div>
                  <div>
                    <span className="text-base-content/60">總時數：</span>
                    <span className="ml-1 font-medium">{(weeklyStatistics.總計 / 60).toFixed(1)} 小時</span>
                  </div>
                  <div>
                    <span className="text-base-content/60">日均時間：</span>
                    <span className="ml-1 font-medium">
                      {weeklySummary.activeDays > 0 ? Math.round(weeklyStatistics.總計 / weeklySummary.activeDays) : 0}{" "}
                      分鐘
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 空狀態提示 */}
            {weeklyStatistics.總計 === 0 && (
              <div className="py-8 text-center">
                <div className="text-base-content/40 mb-2">
                  <BarChart3 aria-hidden="true" className="mx-auto mb-3 h-12 w-12" />
                </div>
                <h3 className="text-base-content/60 mb-1 text-lg font-medium">本週尚無時間記錄</h3>
                <p className="text-base-content/40 text-sm">開始記錄你的時間，查看週統計資料</p>
              </div>
            )}
          </div>
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
