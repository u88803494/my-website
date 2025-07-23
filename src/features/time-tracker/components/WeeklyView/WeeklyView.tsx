"use client";

import { BarChart3, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

import type { TimeRecord } from "@/types/time-tracker.types";

import { formatMinutesToHours } from "../../utils/formatting";
import {
  formatDateInTaiwan,
  getWeekDatesInTaiwan,
  getWeekEndInTaiwan,
  getWeekStartInTaiwan,
  isTodayInTaiwan,
} from "../../utils/timezoneHelpers";
import DaySection from "./DaySection";

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

  // 獲取週的所有日期
  const weekDates = useMemo(() => {
    return getWeekDatesInTaiwan(currentWeekStart);
  }, [currentWeekStart]);

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
    const thisWeek = getWeekStartInTaiwan();
    setCurrentWeekStart(thisWeek);
    onWeekChange(thisWeek);
  };

  const weekEnd = getWeekEndInTaiwan(currentWeekStart);
  const isCurrentWeek = formatDateInTaiwan(currentWeekStart) === formatDateInTaiwan(getWeekStartInTaiwan());

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

      {/* 週期間和導航 */}
      <div className="bg-base-200 flex items-center justify-between rounded-lg p-3">
        <button aria-label="上一週" className="btn btn-ghost btn-sm" onClick={goToPreviousWeek}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="text-base-content font-medium">
            {currentWeekStart.toLocaleDateString("zh-TW", {
              day: "numeric",
              month: "long",
            })}{" "}
            -{" "}
            {weekEnd.toLocaleDateString("zh-TW", {
              day: "numeric",
              month: "long",
            })}
          </div>
          <div className="text-base-content/60 text-sm">
            {currentWeekStart.getFullYear()} 年
            {isCurrentWeek && <span className="badge badge-primary badge-sm ml-2">本週</span>}
          </div>
        </div>

        <button aria-label="下一週" className="btn btn-ghost btn-sm" onClick={goToNextWeek}>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {/* 週統計摘要 */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 aria-hidden="true" className="text-primary h-4 w-4" />
          <h4 className="text-base-content font-medium">週統計</h4>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <span className="text-base-content/60">總時間：</span>
            <span className="ml-1 font-medium">{formatMinutesToHours(weekStats.totalMinutes)}</span>
          </div>
          <div>
            <span className="text-base-content/60">記錄數：</span>
            <span className="ml-1 font-medium">{weekStats.recordCount} 筆</span>
          </div>
          <div>
            <span className="text-base-content/60">活躍天數：</span>
            <span className="ml-1 font-medium">{weekStats.activeDays} 天</span>
          </div>
          <div>
            <span className="text-base-content/60">日均時間：</span>
            <span className="ml-1 font-medium">{formatMinutesToHours(weekStats.averagePerDay)}</span>
          </div>
        </div>
      </div>

      {/* 每日記錄 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weekDates.map((date) => {
          const dateStr = formatDateInTaiwan(date);
          const dayRecords = recordsByDate[dateStr] || [];
          const isTodayDate = isTodayInTaiwan(date);

          return <DaySection date={date} isToday={isTodayDate} key={dateStr} records={dayRecords} />;
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
