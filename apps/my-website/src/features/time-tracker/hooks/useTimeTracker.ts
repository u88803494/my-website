import { useCallback, useMemo } from "react";

import type { TimeRecord, TimeStatistics, UseTimeTrackerReturn } from "@/features/time-tracker/types";

import { calculateStatistics } from "../utils/statisticsCalculation";
import { calculateDuration, getCurrentTaiwanDate, getWeekStartInTaiwan, isSameWeekInTaiwan } from "../utils/time";
import { useLocalStorage } from "./useLocalStorage";
import { useUserSettings } from "./useUserSettings";

const STORAGE_KEY = "time-tracker-records";

/**
 * 時間追蹤主要邏輯 hook
 * 管理時間記錄的增刪改查和統計計算
 */
export const useTimeTracker = (): UseTimeTrackerReturn => {
  const {
    error,
    loading,
    setValue: setStoredRecords,
    value: storedRecords,
  } = useLocalStorage<TimeRecord[]>(STORAGE_KEY, []);
  const { settings } = useUserSettings();

  // 直接使用 useMemo 計算處理後的記錄，完全避免 useEffect + setState
  const records = useMemo<TimeRecord[]>(() => {
    if (!loading && storedRecords && storedRecords.length > 0) {
      return storedRecords.map((record) => ({
        ...record,
        createdAt: new Date(record.createdAt),
      }));
    }
    return [];
  }, [storedRecords, loading]);

  // 計算統計資料
  const statistics = useMemo((): TimeStatistics => {
    return calculateStatistics(records);
  }, [records]);

  // 新增記錄
  const addRecord = useCallback(
    (recordData: Omit<TimeRecord, "createdAt" | "id">) => {
      const durationResult = calculateDuration(recordData.startTime, recordData.endTime);

      if (!durationResult.isValid) {
        throw new Error(durationResult.error || "時間計算錯誤");
      }

      const newRecord: TimeRecord = {
        ...recordData,
        createdAt: new Date(),
        date: recordData.date || getCurrentTaiwanDate(),
        duration: durationResult.duration,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      // 只更新 storedRecords，records 會透過 useMemo 自動更新
      const updatedRecords = [newRecord, ...records];
      setStoredRecords(updatedRecords);
    },
    [records, setStoredRecords],
  );

  // 刪除記錄
  const deleteRecord = useCallback(
    (id: string) => {
      // 只更新 storedRecords，records 會透過 useMemo 自動更新
      const updatedRecords = records.filter((record) => record.id !== id);
      setStoredRecords(updatedRecords);
    },
    [records, setStoredRecords],
  );

  // 獲取指定週的記錄
  const getWeeklyRecords = useCallback(
    (weekStart: Date): TimeRecord[] => {
      return records.filter((record) => {
        const recordDate = new Date(record.date);
        return isSameWeekInTaiwan(recordDate, weekStart, settings.weekStartDay);
      });
    },
    [records, settings.weekStartDay],
  );

  // 清除本週記錄
  const clearWeek = useCallback(() => {
    const currentWeekStart = getWeekStartInTaiwan(undefined, settings.weekStartDay);
    const updatedRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return !isSameWeekInTaiwan(recordDate, currentWeekStart, settings.weekStartDay);
    });

    // 只更新 storedRecords，records 會透過 useMemo 自動更新
    setStoredRecords(updatedRecords);
  }, [records, setStoredRecords, settings.weekStartDay]);

  return {
    addRecord,
    clearWeek,
    deleteRecord,
    error,
    getWeeklyRecords,
    isLoading: loading,
    records: records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()), // 按建立時間倒序
    statistics,
  };
};

export default useTimeTracker;
