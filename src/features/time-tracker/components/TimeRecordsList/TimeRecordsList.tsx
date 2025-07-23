"use client";

import { Filter, List, Search } from "lucide-react";
import React, { useState } from "react";

import type { ActivityType, TimeRecord } from "@/types/time-tracker.types";
import { ACTIVITY_TYPE_OPTIONS } from "@/types/time-tracker.types";

import RecordItem from "./RecordItem";

interface TimeRecordsListProps {
  isLoading?: boolean;
  maxItems?: number;
  onDeleteRecord: (id: string) => void;
  records: TimeRecord[];
  showSearch?: boolean;
}

/**
 * 時間記錄列表元件
 * 顯示記錄列表並提供搜尋和篩選功能
 */
const TimeRecordsList: React.FC<TimeRecordsListProps> = ({
  isLoading = false,
  maxItems,
  onDeleteRecord,
  records,
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"" | ActivityType>("");
  const [deletingId, setDeletingId] = useState<null | string>(null);

  // 篩選和搜尋記錄
  const filteredRecords = React.useMemo(() => {
    let filtered = records;

    // 按活動類型篩選
    if (filterType) {
      filtered = filtered.filter((record) => record.activityType === filterType);
    }

    // 按搜尋詞篩選
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (record) =>
          record.activityType.toLowerCase().includes(term) ||
          record.description?.toLowerCase().includes(term) ||
          record.startTime.includes(term) ||
          record.endTime.includes(term),
      );
    }

    // 限制顯示數量
    if (maxItems && maxItems > 0) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [records, filterType, searchTerm, maxItems]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteRecord(id);
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
  };

  const hasFilters = searchTerm.trim() || filterType;

  return (
    <div className="space-y-4">
      {/* 標題和控制項 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List aria-hidden="true" className="text-primary h-5 w-5" />
          <h3 className="text-base-content font-medium">
            時間記錄
            {filteredRecords.length > 0 && (
              <span className="text-base-content/60 ml-2 text-sm">({filteredRecords.length} 筆)</span>
            )}
          </h3>
        </div>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            清除篩選
          </button>
        )}
      </div>

      {/* 搜尋和篩選控制項 */}
      {showSearch && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* 搜尋框 */}
          <div className="form-control flex-1">
            <div className="input-group flex items-center gap-2">
              <span className="bg-base-200 flex items-center justify-center">
                <Search aria-hidden="true" className="h-4 w-4" />
              </span>
              <input
                aria-label="搜尋時間記錄"
                className="input input-bordered flex-1"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋記錄..."
                type="text"
                value={searchTerm}
              />
            </div>
          </div>

          {/* 活動類型篩選 */}
          <div className="form-control">
            <div className="input-group flex items-center gap-2">
              <span className="bg-base-200 flex items-center justify-center">
                <Filter aria-hidden="true" className="h-4 w-4" />
              </span>
              <select
                aria-label="篩選活動類型"
                className="select select-bordered"
                onChange={(e) => setFilterType(e.target.value as "" | ActivityType)}
                value={filterType}
              >
                <option value="">所有類型</option>
                {ACTIVITY_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 載入狀態 */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-md" />
        </div>
      )}

      {/* 記錄列表 */}
      {!isLoading && (
        <div className="space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <RecordItem
                isDeleting={deletingId === record.id}
                key={record.id}
                onDelete={handleDelete}
                record={record}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="text-base-content/40 mb-2">
                <List aria-hidden="true" className="mx-auto mb-3 h-12 w-12" />
              </div>
              <h4 className="text-base-content/60 mb-1 text-lg font-medium">
                {hasFilters ? "沒有符合條件的記錄" : "尚無時間記錄"}
              </h4>
              <p className="text-base-content/40 text-sm">
                {hasFilters ? "嘗試調整搜尋條件或篩選設定" : "開始記錄你的時間，追蹤日常活動"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 顯示更多提示 */}
      {maxItems && records.length > maxItems && !hasFilters && (
        <div className="py-2 text-center">
          <p className="text-base-content/60 text-sm">
            顯示最近 {maxItems} 筆記錄，共 {records.length} 筆
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeRecordsList;
