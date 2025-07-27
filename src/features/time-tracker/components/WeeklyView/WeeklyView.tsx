"use client";

import { Calendar } from "lucide-react";
import React, { useMemo, useState } from "react";

import type { TimeRecord } from "@/types/time-tracker.types";

import { useUserSettings } from "../../hooks";
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
  const [currentWeekStart, setCurrentWeekStart] = useState(weekStart);
  const { settings } = useUserSettings();

  // 獲取週的所有日期（使用用戶設定的週起始日）
  const weekDates = useMemo(() => {
    return getWeekDatesInTaiwan(currentWeekStart, settings.weekStartDay);
  }, [currentWeekStart, settings.weekStartDay]);

  // 按日期分組記錄
  const recordsByDate = useMemo(() => {
    const grouped: Record<string, TimeRecord[]> = {};

    weekDates.forEach((date) => {
      const dateStr = formatDateInTaiwan(date);
      grouped[dateStr] = records.filter((record) => record.date === dateStr);
    });

    return grouped;
  }, [records, weekDates]);

  // 計算週統計
  const weekStats = useMemo(() => {
    const totalMinutes = records.reduce((sum, record) => sum + record.duration, 0);
    const recordCount = records.length;
    const activeDays = Object.values(recordsByDate).filter((records) => records.length > 0).length;

    return {
      activeDays,
      averagePerDay: activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0,
      recordCount,
      totalMinutes,
    };
  }, [records, recordsByDate]);

  // 導航到上一週
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeek);
    onWeekChange(prevWeek);
  };

  // 導航到下一週
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeek);
    onWeekChange(nextWeek);
  };

  // 回到本週
  const goToCurrentWeek = () => {
    const thisWeek = getWeekStartInTaiwan(undefined, settings.weekStartDay);
    setCurrentWeekStart(thisWeek);
    onWeekChange(thisWeek);
  };

  const weekEnd = getWeekEndInTaiwan(currentWeekStart, settings.weekStartDay);
  const isCurrentWeek =
    formatDateInTaiwan(currentWeekStart) === formatDateInTaiwan(getWeekStartInTaiwan(undefined, settings.weekStartDay));

  return (
    <div className="space-y-4">
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
        currentWeekStart={currentWeekStart}
        isCurrentWeek={isCurrentWeek}
        onCurrentWeek={goToCurrentWeek}
        onNextWeek={goToNextWeek}
        onPreviousWeek={goToPreviousWeek}
        weekEnd={weekEnd}
      />

      <WeekStats
        activeDays={weekStats.activeDays}
        averagePerDay={weekStats.averagePerDay}
        recordCount={weekStats.recordCount}
        totalMinutes={weekStats.totalMinutes}
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
