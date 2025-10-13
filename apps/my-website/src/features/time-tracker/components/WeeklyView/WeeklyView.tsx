"use client";

import type { TimeRecord } from "@/features/time-tracker/types";
import { Calendar } from "lucide-react";
import React, { useMemo } from "react";

import { useUserSettings } from "../../hooks";
import { getWeeklyCategoryTotals } from "../../utils/statisticsCalculation";
import { formatDateInTaiwan, getWeekDatesInTaiwan, getWeekEndInTaiwan, getWeekStartInTaiwan } from "../../utils/time";
import DaySection from "./DaySection";
import WeekNavigation from "./WeekNavigation";
import WeekStats from "./WeekStats";

interface WeeklyViewProps {
  onWeekChange: (weekStart: Date) => void;
  records: TimeRecord[];
  weekStart: Date;
}

/**
 * 週視圖元件
 * 顯示整週的時間記錄和統計
 */
const WeeklyView: React.FC<WeeklyViewProps> = ({ onWeekChange, records, weekStart }) => {
  const { settings } = useUserSettings();

  // 獲取週的所有日期（使用用戶設定的週起始日）
  const weekDates = useMemo(() => {
    return getWeekDatesInTaiwan(weekStart, settings.weekStartDay);
  }, [weekStart, settings.weekStartDay]);

  // 按日期分組記錄
  const recordsByDate = useMemo(() => {
    const grouped: Record<string, TimeRecord[]> = {};

    weekDates.forEach((date) => {
      const dateStr = formatDateInTaiwan(date);
      grouped[dateStr] = records.filter((record) => record.date === dateStr);
    });

    return grouped;
  }, [records, weekDates]);

  // 計算週統計 - 基於當前週的記錄
  const weekStats = useMemo(() => {
    // 使用當前週的記錄來計算統計
    const weekRecords = Object.values(recordsByDate).flat();
    const totalMinutes = weekRecords.reduce((sum, record) => sum + record.duration, 0);
    const recordCount = weekRecords.length;
    const activeDays = Object.values(recordsByDate).filter((records) => records.length > 0).length;

    return {
      activeDays,
      recordCount,
      totalMinutes,
    };
  }, [recordsByDate]);

  // 計算分類總計
  const categoryTotals = useMemo(() => {
    const weekRecords = Object.values(recordsByDate).flat();
    return getWeeklyCategoryTotals(weekRecords);
  }, [recordsByDate]);

  // 導航到上一週
  const goToPreviousWeek = () => {
    const prevWeek = new Date(weekStart);
    prevWeek.setDate(weekStart.getDate() - 7);
    onWeekChange(prevWeek);
  };

  // 導航到下一週
  const goToNextWeek = () => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(weekStart.getDate() + 7);
    onWeekChange(nextWeek);
  };

  // 回到本週
  const goToCurrentWeek = () => {
    const thisWeek = getWeekStartInTaiwan(undefined, settings.weekStartDay);
    onWeekChange(thisWeek);
  };

  const weekEnd = getWeekEndInTaiwan(weekStart, settings.weekStartDay);
  const isCurrentWeek =
    formatDateInTaiwan(weekStart) === formatDateInTaiwan(getWeekStartInTaiwan(undefined, settings.weekStartDay));

  return (
    <div className="space-y-6">
      {/* 週導航標題 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar aria-hidden="true" className="text-primary h-5 w-5" />
          <h3 className="text-base-content font-medium">週視圖</h3>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentWeek && (
            <button className="btn btn-ghost btn-sm" onClick={goToCurrentWeek}>
              回到本週
            </button>
          )}
        </div>
      </div>

      <WeekNavigation
        currentWeekStart={weekStart}
        isCurrentWeek={isCurrentWeek}
        onCurrentWeek={goToCurrentWeek}
        onNextWeek={goToNextWeek}
        onPreviousWeek={goToPreviousWeek}
        weekEnd={weekEnd}
      />

      <WeekStats
        activeDays={weekStats.activeDays}
        characterMinutes={categoryTotals.character}
        recordCount={weekStats.recordCount}
        studyMinutes={categoryTotals.study}
        totalMinutes={weekStats.totalMinutes}
        workMinutes={categoryTotals.work}
      />

      {/* 每日記錄 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weekDates.map((date) => {
          const dateStr = formatDateInTaiwan(date);
          const dayRecords = recordsByDate[dateStr] || [];

          return <DaySection date={date} key={dateStr} records={dayRecords} />;
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
