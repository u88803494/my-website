import { useCallback, useEffect, useMemo, useState } from "react";

import type { TimeRecord, TimeStatistics, UseTimeTrackerReturn } from "@/types/time-tracker.types";

import { calculateStatistics } from "../utils/statisticsCalculation";
import { calculateDuration, getCurrentTaiwanDate, getWeekStartInTaiwan, isSameWeekInTaiwan } from "../utils/time";
import { useLocalStorage } from "./useLocalStorage";

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

  // 同步 localStorage 的資料到本地狀態
  useEffect(() => {
    if (!loading && storedRecords) {
      // 轉換 createdAt 為 Date 物件
      const processedRecords = storedRecords.map((record) => ({
        ...record,
        createdAt: new Date(record.createdAt),
      }));
      setRecords(processedRecords);
    }
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
        return isSameWeekInTaiwan(recordDate, weekStart);
      });
    },
    [records],
  );

  // 清除本週記錄
  const clearWeek = useCallback(() => {
    const currentWeekStart = getWeekStartInTaiwan();
    const updatedRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return !isSameWeekInTaiwan(recordDate, currentWeekStart);
    });

    setRecords(updatedRecords);
    setStoredRecords(updatedRecords);
  }, [records, setStoredRecords]);

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
