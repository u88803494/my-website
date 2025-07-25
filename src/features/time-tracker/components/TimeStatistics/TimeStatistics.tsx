"use client";

import { BarChart3 } from "lucide-react";
import React from "react";

import type { ActivityType, TimeStatistics as TimeStatisticsType } from "@/types/time-tracker.types";

import { calculatePercentages } from "../../utils/formatting";
import StatisticsCard from "./StatisticsCard";

interface TimeStatisticsProps {
  statistics: TimeStatisticsType;
}

/**
 * 時間統計顯示元件
 * 整合多個統計卡片顯示完整的統計資料
 */
const TimeStatistics: React.FC<TimeStatisticsProps> = ({ statistics }) => {
  // 計算百分比
  const percentages = calculatePercentages(statistics);

  // 準備活動類型統計資料
  const activityStats = Object.entries(statistics)
    .filter(([key]) => key !== "總計")
    .map(([key, value]) => ({
      activityType: key as ActivityType,
      label: key,
      percentage: percentages[key] || 0,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value); // 按時間長度排序

  const hasData = statistics.總計 > 0;

  return (
    <div className="space-y-4">
      {/* 標題區域 */}
      <div className="flex items-center gap-2">
        <BarChart3 aria-hidden="true" className="text-primary h-5 w-5" />
        <h2 className="text-base-content text-xl font-semibold">時間統計</h2>
      </div>

      {/* 統計卡片網格 - 分為兩排 */}
      <div className="space-y-4">
        {/* 第一排：總計時間 */}
        <div className="grid grid-cols-1 gap-4">
          <StatisticsCard isTotal={true} label="總計時間" value={statistics.總計} />
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
          <h3 className="text-base-content/60 mb-1 text-lg font-medium">尚無時間記錄</h3>
          <p className="text-base-content/40 text-sm">開始記錄你的時間，查看詳細統計資料</p>
        </div>
      )}

      {/* 統計摘要 */}
      {hasData && (
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="text-base-content mb-2 font-medium">統計摘要</h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-base-content/60">最多時間：</span>
              <span className="ml-1 font-medium">{activityStats[0]?.label || "無"}</span>
            </div>
            <div>
              <span className="text-base-content/60">活動類型：</span>
              <span className="ml-1 font-medium">{activityStats.filter((s) => s.value > 0).length} 種</span>
            </div>
            <div>
              <span className="text-base-content/60">平均時長：</span>
              <span className="ml-1 font-medium">
                {activityStats.length > 0
                  ? `${Math.round(statistics.總計 / activityStats.filter((s) => s.value > 0).length)} 分鐘`
                  : "0 分鐘"}
              </span>
            </div>
            <div>
              <span className="text-base-content/60">總時數：</span>
              <span className="ml-1 font-medium">{(statistics.總計 / 60).toFixed(1)} 小時</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeStatistics;
