"use client";

import React, { useState } from "react";

import { HeaderSection, MainTabContent, SettingsModal, TabNavigation, WeeklyView } from "./components";
import TimeStatistics from "./components/TimeStatistics";
import { useTimeTracker, useUserSettings } from "./hooks";
import { Tab } from "./types";
import { getWeekStartInTaiwan } from "./utils/time";

/**
 * 時間追蹤主要功能元件
 * 整合所有子元件並管理主要狀態
 */
const TimeTrackerFeature: React.FC = () => {
  const { addRecord, deleteRecord, error, isLoading, records, statistics } = useTimeTracker();
  const { settings } = useUserSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MAIN);
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

  // 搜尋功能需要在全部記錄中搜尋，所以不在這裡限制記錄數量

  return (
    <div className="bg-base-100 min-h-screen p-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* 頁面標題和設定按鈕 */}
        <HeaderSection onToggleSettings={toggleSettings} />

        {/* 頁籤導航 */}
        <div className="tabs tabs-boxed justify-center">
          <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === Tab.MAIN && (
          <MainTabContent
            isLoading={isLoading}
            onAddRecord={addRecord}
            onDeleteRecord={deleteRecord}
            records={records}
          />
        )}
        {activeTab === Tab.WEEKLY_STATS && (
          <WeeklyView onWeekChange={setCurrentWeekStart} records={records} weekStart={currentWeekStart} />
        )}
        {activeTab === Tab.STATISTICS && <TimeStatistics records={records} statistics={statistics} />}
      </div>

      {/* 設定模態視窗 */}
      <SettingsModal isOpen={showSettings} onClose={toggleSettings} />
    </div>
  );
};

export default TimeTrackerFeature;
