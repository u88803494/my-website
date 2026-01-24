"use client";

import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import type { TimeRecord, TimeStatistics } from "@/features/time-tracker/types";
import { ActivityType, type ActivityType as ActivityTypeType } from "@/features/time-tracker/types";

import { calculatePercentages } from "../../utils/formatting";
import StatisticsCard from "../TimeStatistics/StatisticsCard";

// Map ActivityType enum values to translation keys
const ACTIVITY_TYPE_TO_KEY: Record<ActivityTypeType, string> = {
  [ActivityType.WORK]: "activityTypes.work",
  [ActivityType.STUDY]: "activityTypes.study",
  [ActivityType.CHARACTER]: "activityTypes.character",
  [ActivityType.LISTENING]: "activityTypes.listening",
  [ActivityType.EXTRA_STUDY]: "activityTypes.extraStudy",
  [ActivityType.EXTRA_CHARACTER]: "activityTypes.extraCharacter",
  [ActivityType.EXTRA_LISTENING]: "activityTypes.extraListening",
};

interface StatisticsViewProps {
  /** 空狀態提示文字 */
  emptyStateText?: {
    description: string;
    title: string;
  };
  /** 記錄資料 */
  records: TimeRecord[];
  /** 是否顯示百分比 */
  showPercentages?: boolean;
  /** 統計資料 */
  statistics: TimeStatistics;
  /** 摘要配置 */
  summaryConfig?: {
    /** 自訂摘要項目 */
    customItems?: Array<{
      label: string;
      value: string;
    }>;
    /** 顯示活動類型數量 */
    showActivityCount?: boolean;
    /** 顯示平均時長 */
    showAverageTime?: boolean;
    /** 顯示最多時間活動 */
    showTopActivity?: boolean;
    /** 顯示總時數 */
    showTotalHours?: boolean;
    /** 顯示統計開始時間 */
    showTrackingStartDate?: boolean;
  };
  /** 標題 */
  title: string;
}

/**
 * 共用統計顯示元件
 * 支援依賴注入的方式顯示不同類型的統計資料
 */
const StatisticsView: React.FC<StatisticsViewProps> = ({
  title,
  emptyStateText,
  records,
  showPercentages = false,
  statistics,
  summaryConfig = {},
}) => {
  const t = useTranslations("TimeTracker");

  // Default empty state text with translations
  const defaultEmptyStateText = {
    description: t("statistics.emptyDescription"),
    title: t("statistics.emptyTitle"),
  };
  const effectiveEmptyStateText = emptyStateText || defaultEmptyStateText;
  // 計算百分比
  const percentages = showPercentages ? calculatePercentages(statistics) : {};

  // 準備活動類型統計資料 - 使用 ActivityType enum 遍歷避免 type assertion
  const activityStats = Object.values(ActivityType)
    .map((activityType) => ({
      activityType,
      label: t(ACTIVITY_TYPE_TO_KEY[activityType]),
      percentage: percentages[activityType] || undefined,
      value: statistics[activityType],
    }))
    .sort((a, b) => b.value - a.value); // 按時間長度排序

  const hasData = statistics.總計 > 0;

  // 計算統計開始時間（第一筆記錄的創建時間）
  const getTrackingStartDate = (): null | string => {
    if (records.length === 0) return null;

    // 找到最早的記錄（按 createdAt 排序）
    const earliestRecord = records.reduce((earliest, current) => {
      if (!current.createdAt || !earliest.createdAt) return earliest;
      return current.createdAt < earliest.createdAt ? current : earliest;
    });

    if (!earliestRecord.createdAt) return null;

    // 轉換 Date 為字符串格式
    const createdAt = earliestRecord.createdAt;
    if (!createdAt) return null;
    const dateStr = createdAt instanceof Date ? createdAt.toISOString().split("T")[0] : String(createdAt);
    return dateStr || null;
  };

  const trackingStartDate = getTrackingStartDate();

  // 構建摘要項目
  const summaryItems: Array<{ label: string; value: string }> = [];

  if (summaryConfig.showTrackingStartDate && trackingStartDate) {
    summaryItems.push({
      label: t("statistics.trackingStartDate"),
      value: trackingStartDate,
    });
  }

  if (summaryConfig.showTopActivity) {
    summaryItems.push({
      label: t("statistics.topActivity"),
      value: activityStats[0]?.label || t("statistics.none"),
    });
  }

  if (summaryConfig.showActivityCount) {
    summaryItems.push({
      label: t("statistics.activityTypeCount"),
      value: `${activityStats.filter((s) => s.value > 0).length} ${t("statistics.typesUnit")}`,
    });
  }

  if (summaryConfig.showAverageTime) {
    const activeActivities = activityStats.filter((s) => s.value > 0);
    const averageTime = activeActivities.length > 0 ? Math.round(statistics.總計 / activeActivities.length) : 0;
    summaryItems.push({
      label: t("statistics.averageTime"),
      value: `${averageTime} ${t("statistics.minutesUnit")}`,
    });
  }

  if (summaryConfig.showTotalHours) {
    summaryItems.push({
      label: t("statistics.totalHours"),
      value: `${(statistics.總計 / 60).toFixed(1)} ${t("statistics.hoursUnit")}`,
    });
  }

  // 添加自訂摘要項目
  if (summaryConfig.customItems) {
    summaryItems.push(...summaryConfig.customItems);
  }

  return (
    <div className="space-y-4">
      {/* 標題區域 */}
      <div className="flex items-center gap-2">
        <BarChart3 aria-hidden="true" className="text-primary h-5 w-5" />
        <h2 className="text-base-content text-xl font-semibold">{title}</h2>
      </div>

      {/* 統計卡片網格 - 分為兩排 */}
      <div className="space-y-4">
        {/* 第一排：總計時間 */}
        <div className="grid grid-cols-1 gap-4">
          <StatisticsCard
            isTotal={true}
            label={
              title.includes(t("statistics.weeklyStatistics"))
                ? t("statistics.totalTimeThisWeek")
                : t("statistics.totalTime")
            }
            value={statistics.總計}
          />
        </div>

        {/* 第二排：各活動類型 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {activityStats.map((stat) => (
            <StatisticsCard
              activityType={stat.activityType}
              key={stat.activityType}
              label={stat.label}
              percentage={stat.percentage}
              value={stat.value}
            />
          ))}
        </div>
      </div>

      {/* 空狀態提示 */}
      {!hasData && (
        <div className="py-8 text-center">
          <div className="text-base-content/40 mb-2">
            <BarChart3 aria-hidden="true" className="mx-auto mb-3 h-12 w-12" />
          </div>
          <h3 className="text-base-content/60 mb-1 text-lg font-medium">{effectiveEmptyStateText.title}</h3>
          <p className="text-base-content/40 text-sm">{effectiveEmptyStateText.description}</p>
        </div>
      )}

      {/* 統計摘要 */}
      {hasData && summaryItems.length > 0 && (
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="text-base-content mb-2 font-medium">{t("statistics.statisticsSummary")}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
            {summaryItems.map((item, index) => (
              <div key={index}>
                <span className="text-base-content/60">{item.label}</span>
                <span className="ml-1 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsView;
