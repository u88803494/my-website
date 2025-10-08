import type {
  TimeRecord,
  TimeStatistics,
  UserSettings,
  UseTimeTrackerReturn,
  WeeklyStats,
} from "@packages/shared/types";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const { settings } = useUserSettings();

  // 同步 localStorage 的資料到本地狀態
  useEffect(() => {
    if (!loading && storedRecords) {
      const processedRecords = storedRecords.map((record) => ({
        ...record,
        createdAt: new Date(record.createdAt ?? Date.now()).toISOString(),
      }));
      setRecords(processedRecords);
    }
  }, [storedRecords, loading]);

  // 計算統計資料
  const statistics = useMemo((): TimeStatistics => {
    return calculateStatistics(records);
  }, [records]);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
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
        createdAt: new Date().toISOString(), // 添加創建時間戳
        date: recordData.date || getCurrentTaiwanDate(),
        duration: durationResult.duration,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      const updatedRecords = [newRecord, ...records];
      setRecords(updatedRecords);
      setStoredRecords(updatedRecords);
    },
    [records, setStoredRecords],
  );

  // 刪除記錄
  const deleteRecord = useCallback(
    (id: string) => {
      const updatedRecords = records.filter((record) => record.id !== id);
      setRecords(updatedRecords);
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

    setRecords(updatedRecords);
    setStoredRecords(updatedRecords);
  }, [records, setStoredRecords, settings.weekStartDay]);

  return {
    addRecord,
    clearWeek,
    deleteRecord,
    error: error || undefined,
    getWeeklyRecords,
    isLoading: loading,
    records: sortedRecords, // 按建立時間倒序
    statistics,
    removeRecord: deleteRecord,
    updateRecord: (_id: string, _updates: Partial<TimeRecord>) => {
      throw new Error("Not implemented");
    },
    updateSettings: (_settings: Partial<UserSettings>) => {
      throw new Error("Not implemented");
    },
    weeklyStatistics: {} as WeeklyStats, // Placeholder
    settings: settings,
  };
};

export default useTimeTracker;
