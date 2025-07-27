"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar, TrendingUp } from "lucide-react";
import React from "react";

import type { TimeRecord } from "@/types/time-tracker.types";

import StatisticsCard from "../TimeStatistics/StatisticsCard";
import { useWeeklyStats } from "./hooks/useWeeklyStats";

interface WeeklyStatisticsProps {
  records: TimeRecord[];
}

/**
 * 週統計組件
 * 顯示當前週的 Reading、Working、Character、Total 四張統計卡片
 */
const WeeklyStatistics: React.FC<WeeklyStatisticsProps> = ({ records }) => {
  const { hasData, weekEnd, weeklyStats, weekStart } = useWeeklyStats(records);

  // 格式化週期範圍顯示
  const weekRangeDisplay = `${format(weekStart, "M/d", { locale: zhTW })} - ${format(weekEnd, "M/d", { locale: zhTW })}`;

  return (
    <div className="space-y-4">
      {/* 標題區域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar aria-hidden="true" className="text-primary h-5 w-5" />
          <h2 className="text-base-content text-xl font-semibold">週統計</h2>
        </div>
        <div className="text-base-content/60 text-sm">{weekRangeDisplay}</div>
      </div>

      {/* 統計卡片網格 */}
      <div className="space-y-4">
        {/* 第一排：總計時間 */}
        <div className="grid grid-cols-1 gap-4">
          <StatisticsCard isTotal={true} label={weeklyStats.total.label} value={weeklyStats.total.value} />
        </div>

        {/* 第二排：各類型統計 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <StatisticsCard
            label={weeklyStats.reading.label}
            percentage={weeklyStats.reading.percentage}
            value={weeklyStats.reading.value}
          />
          <StatisticsCard
            label={weeklyStats.working.label}
            percentage={weeklyStats.working.percentage}
            value={weeklyStats.working.value}
          />
          <StatisticsCard
            label={weeklyStats.character.label}
            percentage={weeklyStats.character.percentage}
            value={weeklyStats.character.value}
          />
        </div>
      </div>

      {/* 空狀態提示 */}
      {!hasData && (
        <div className="py-8 text-center">
          <div className="text-base-content/40 mb-2">
            <TrendingUp aria-hidden="true" className="mx-auto mb-3 h-12 w-12" />
          </div>
          <h3 className="text-base-content/60 mb-1 text-lg font-medium">本週尚無時間記錄</h3>
          <p className="text-base-content/40 text-sm">開始記錄你的時間，查看本週統計資料</p>
        </div>
      )}

      {/* 週統計摘要 */}
      {hasData && (
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="text-base-content mb-2 font-medium">本週摘要</h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-base-content/60">最多時間：</span>
              <span className="ml-1 font-medium">
                {(() => {
                  const activities = [
                    { name: weeklyStats.reading.label, value: weeklyStats.reading.value },
                    { name: weeklyStats.working.label, value: weeklyStats.working.value },
                    { name: weeklyStats.character.label, value: weeklyStats.character.value },
                  ];
                  const maxActivity = activities.reduce((prev, current) =>
                    prev.value > current.value ? prev : current,
                  );
                  return maxActivity.value > 0 ? maxActivity.name : "無";
                })()}
              </span>
            </div>
            <div>
              <span className="text-base-content/60">活動類型：</span>
              <span className="ml-1 font-medium">
                {
                  [weeklyStats.reading, weeklyStats.working, weeklyStats.character].filter((stat) => stat.value > 0)
                    .length
                }{" "}
                種
              </span>
            </div>
            <div>
              <span className="text-base-content/60">平均時長：</span>
              <span className="ml-1 font-medium">
                {(() => {
                  const activeTypes = [weeklyStats.reading, weeklyStats.working, weeklyStats.character].filter(
                    (stat) => stat.value > 0,
                  ).length;
                  return activeTypes > 0 ? `${Math.round(weeklyStats.total.value / activeTypes)} 分鐘` : "0 分鐘";
                })()}
              </span>
            </div>
            <div>
              <span className="text-base-content/60">總時數：</span>
              <span className="ml-1 font-medium">{(weeklyStats.total.value / 60).toFixed(1)} 小時</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyStatistics;
