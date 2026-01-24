"use client";

import { useTranslations } from "next-intl";
import React from "react";

import type { TimeRecord, TimeStatistics } from "@/features/time-tracker/types";

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
  const t = useTranslations("TimeTracker");

  return (
    <StatisticsView
      emptyStateText={{
        description: t("statistics.emptyDescription"),
        title: t("statistics.emptyTitle"),
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
      title={t("statistics.allStatistics")}
    />
  );
};

export default TimeStatistics;
