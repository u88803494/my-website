"use client";

import type { TimeRecord, TimeStatistics } from "@/features/time-tracker/types";
import React from "react";

import StatisticsView from "../shared/StatisticsView";

interface TimeStatisticsProps {
  records: TimeRecord[];
  statistics: TimeStatistics;
}

/**
 * 時間統計顯示元件
 * 整合多個統計卡片顯示完整的統計資料
 */
const TimeStatistics: React.FC<TimeStatisticsProps> = ({ records, statistics }) => {
  return (
    <StatisticsView
      emptyStateText={{
        description: "開始記錄你的時間，查看詳細統計資料",
        title: "尚無時間記錄",
      }}
      records={records}
      showPercentages
      statistics={statistics}
      summaryConfig={{
        showActivityCount: true,
        showAverageTime: true,
        showTopActivity: true,
        showTotalHours: true,
        showTrackingStartDate: true,
      }}
      title="全部統計"
    />
  );
};

export default TimeStatistics;
