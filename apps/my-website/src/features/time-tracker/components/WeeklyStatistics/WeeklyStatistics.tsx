"use client";

import { ActivityType, type TimeRecord } from "@/features/time-tracker/types";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar, TrendingUp } from "lucide-react";

import { TIME_TRACKER_I18N } from "../../constants/i18n";
import {
  getWeeklyActiveTypesCount,
  getWeeklyAverageTime,
  getWeeklyCategoryTotals,
  getWeeklyTopActivity,
  getWeeklyTotalHours,
} from "../../utils/statisticsCalculation";
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

  // 篩選出本週的記錄
  const weeklyRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });

  // 計算分類總計用於摘要顯示
  const categoryTotals = getWeeklyCategoryTotals(weeklyRecords);

  // 格式化週期範圍顯示
  const weekRangeDisplay = `${format(weekStart, "M/d", { locale: zhTW })} - ${format(weekEnd, "M/d", { locale: zhTW })}`;

  return (
    <div className="space-y-4">
      {/* 標題區域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar aria-hidden="true" className="text-primary h-5 w-5" />
          <h2 className="text-base-content text-xl font-semibold">{TIME_TRACKER_I18N.STATISTICS.WEEKLY_TITLE}</h2>
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
            activityType={ActivityType.STUDY}
            label={weeklyStats.reading.label}
            percentage={weeklyStats.reading.percentage}
            value={weeklyStats.reading.value}
          />
          <StatisticsCard
            activityType={ActivityType.WORK}
            label={weeklyStats.working.label}
            percentage={weeklyStats.working.percentage}
            value={weeklyStats.working.value}
          />
          <StatisticsCard
            activityType={ActivityType.CHARACTER}
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
          <h3 className="text-base-content/60 mb-1 text-lg font-medium">
            {TIME_TRACKER_I18N.EMPTY_STATE.WEEKLY_TITLE}
          </h3>
          <p className="text-base-content/40 text-sm">{TIME_TRACKER_I18N.EMPTY_STATE.WEEKLY_DESCRIPTION}</p>
        </div>
      )}

      {/* 週統計摘要 */}
      {hasData && (
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="text-base-content mb-2 font-medium">{TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.TITLE}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-base-content/60">{TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.TOP_ACTIVITY}</span>
              <span className="ml-1 font-medium">{getWeeklyTopActivity(categoryTotals)}</span>
            </div>
            <div>
              <span className="text-base-content/60">{TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.ACTIVITY_TYPES}</span>
              <span className="ml-1 font-medium">
                {getWeeklyActiveTypesCount(categoryTotals)} {TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.TYPES_UNIT}
              </span>
            </div>
            <div>
              <span className="text-base-content/60">{TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.AVERAGE_TIME}</span>
              <span className="ml-1 font-medium">
                {getWeeklyAverageTime(categoryTotals)} {TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.MINUTES_UNIT}
              </span>
            </div>
            <div>
              <span className="text-base-content/60">{TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.TOTAL_HOURS}</span>
              <span className="ml-1 font-medium">
                {getWeeklyTotalHours(categoryTotals)} {TIME_TRACKER_I18N.STATISTICS.WEEKLY_SUMMARY.HOURS_UNIT}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyStatistics;
