"use client";

import { List } from "lucide-react";
import React, { useState } from "react";

import type { ActivityType, TimeRecord } from "@/types/time-tracker.types";

import EmptyState from "./EmptyState";
import RecordItem from "./RecordItem";
import SearchFilters from "./SearchFilters";

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
        <SearchFilters
          filterType={filterType}
          onFilterChange={setFilterType}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />
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
            <EmptyState hasFilters={Boolean(hasFilters)} />
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
