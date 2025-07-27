"use client";

import { BarChart3, List, Settings } from "lucide-react";
import React, { useState } from "react";

import TimeEntryForm from "./components/TimeEntryForm/TimeEntryForm";
import TimeRecordsList from "./components/TimeRecordsList/TimeRecordsList";
import TimeStatistics from "./components/TimeStatistics/TimeStatistics";
import { UserSettings } from "./components/UserSettings";
import WeeklyView from "./components/WeeklyView/WeeklyView";
import { useTimeTracker, useUserSettings } from "./hooks";
import { formatMinutesToHours } from "./utils/formatting";
import { calculateStatistics } from "./utils/statisticsCalculation";
import { getWeekStartInTaiwan } from "./utils/time";

/**
 * 時間追蹤主要功能元件
 * 整合所有子元件並管理主要狀態
 */
const TimeTrackerFeature: React.FC = () => {
  const { addRecord, deleteRecord, error, getWeeklyRecords, isLoading, records, statistics } = useTimeTracker();
  const { settings } = useUserSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartInTaiwan(undefined, settings.weekStartDay));
  const [activeTab, setActiveTab] = useState<"main" | "statistics">("main");
  const [showAllRecords, setShowAllRecords] = useState(false);

  const handleWeekChange = (weekStart: Date) => {
    setCurrentWeekStart(weekStart);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // 計算本週統計
  const weeklyRecords = getWeeklyRecords(currentWeekStart);
  const weeklyStatistics = calculateStatistics(weeklyRecords);

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
          <button className={`tab ${activeTab === "main" ? "tab-active" : ""}`} onClick={() => setActiveTab("main")}>
            <List className="mr-2 h-4 w-4" />
            主要功能
          </button>
          <button
            className={`tab ${activeTab === "statistics" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("statistics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            詳細統計
          </button>
        </div>

        {activeTab === "main" ? (
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
                <div className="card-body">
                  <h2 className="card-title mb-4 text-xl">新增時間記錄</h2>
                  <TimeEntryForm isLoading={isLoading} onSubmit={addRecord} />
                </div>
              </div>

              {/* 右側：記錄列表 */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
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
              <div className="card-body">
                <h2 className="card-title mb-4 text-xl">本週統計</h2>
                <WeeklyView onWeekChange={handleWeekChange} records={weeklyRecords} weekStart={currentWeekStart} />
              </div>
            </div>
          </>
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
