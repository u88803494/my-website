"use client";

import { endOfWeek, startOfWeek } from "date-fns";
import { useMemo } from "react";

import type { TimeRecord } from "@/types/time-tracker.types";

import { getWeeklyCategoryTotals, type WeeklyCategoryTotals } from "../../../utils/statisticsCalculation";
import { getTaiwanNow } from "../../../utils/time/timeUtilities";

export interface UseWeeklyStatsReturn {
  hasData: boolean;
  weekEnd: Date;
  weeklyStats: WeeklyStatsData;
  weekStart: Date;
}

export interface WeeklyStatsData {
  character: {
    label: string;
    percentage: number;
    value: number;
  };
  reading: {
    label: string;
    percentage: number;
    value: number;
  };
  total: {
    label: string;
    percentage?: never; // 總計不顯示百分比
    value: number;
  };
  working: {
    label: string;
    percentage: number;
    value: number;
  };
}

/**
 * 週統計資料 Hook
 * 計算當前週（週日到週六）的統計資料
 */
export const useWeeklyStats = (records: TimeRecord[]): UseWeeklyStatsReturn => {
  const today = getTaiwanNow();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // 週日開始
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 }); // 週六結束

  // 篩選出本週的記錄
  const weeklyRecords = useMemo(() => {
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
  }, [records, weekStart, weekEnd]);

  // 計算週統計資料
  const weeklyStats = useMemo((): WeeklyStatsData => {
    // 計算分類總計
    const categoryTotals: WeeklyCategoryTotals = getWeeklyCategoryTotals(weeklyRecords);

    // 計算總時間
    const totalTime = categoryTotals.character + categoryTotals.study + categoryTotals.work;

    // 計算百分比
    const calculatePercentage = (value: number): number => {
      return totalTime > 0 ? Math.round((value / totalTime) * 100) : 0;
    };

    return {
      character: {
        label: "Character",
        percentage: calculatePercentage(categoryTotals.character),
        value: categoryTotals.character,
      },
      reading: {
        label: "Reading",
        percentage: calculatePercentage(categoryTotals.study),
        value: categoryTotals.study,
      },
      total: {
        label: "Total",
        value: totalTime,
      },
      working: {
        label: "Working",
        percentage: calculatePercentage(categoryTotals.work),
        value: categoryTotals.work,
      },
    };
  }, [weeklyRecords]);

  const hasData = weeklyStats.total.value > 0;

  return {
    hasData,
    weekEnd,
    weeklyStats,
    weekStart,
  };
};
