"use client";

import { Calendar, Clock, Trash2 } from "lucide-react";
import React, { useState } from "react";

import type { TimeRecord } from "@/types/time-tracker.types";

import { getDateDisplayName } from "../../utils/dateHelpers";
import { formatTimeRecord } from "../../utils/formatting";

interface RecordItemProps {
  isDeleting?: boolean;
  onDelete: (id: string) => void;
  record: TimeRecord;
}

/**
 * 單一時間記錄項目元件
 * 顯示記錄詳情並提供刪除功能
 */
const RecordItem: React.FC<RecordItemProps> = ({ isDeleting = false, onDelete, record }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedRecord = formatTimeRecord(record);
  const displayDate = getDateDisplayName(new Date(record.date));

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(record.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-base-100 border-base-200 rounded-lg border p-3 transition-shadow hover:shadow-sm">
      {/* 桌面版：單行佈局 */}
      <div className="hidden items-center justify-between sm:flex">
        {/* 左側：活動類型 + 時間範圍 */}
        <div className="flex flex-1 items-center gap-3">
          <span className={`badge ${formattedRecord.activityColor} font-medium`}>{formattedRecord.activityType}</span>
          <div className="text-base-content/80 flex items-center gap-2 text-sm">
            <Clock aria-hidden="true" className="h-4 w-4" />
            <span>{formattedRecord.timeRange}</span>
          </div>
          {formattedRecord.description && (
            <span className="text-base-content/60 max-w-xs truncate text-sm">{formattedRecord.description}</span>
          )}
        </div>

        {/* 右側：持續時間 + 日期 + 操作 */}
        <div className="flex items-center gap-4">
          <div className="text-base-content/60 flex items-center gap-2 text-sm">
            <span>{formattedRecord.duration}</span>
            <span className="text-xs">({formattedRecord.decimalDuration})</span>
          </div>
          <div className="text-base-content/50 flex items-center gap-1 text-xs">
            <Calendar aria-hidden="true" className="h-3 w-3" />
            <span>{displayDate}</span>
          </div>

          {/* 刪除按鈕 */}
          {!showDeleteConfirm ? (
            <button
              aria-label={`刪除 ${formattedRecord.activityType} 記錄`}
              className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              disabled={isDeleting}
              onClick={handleDeleteClick}
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-1">
              <button className="btn btn-ghost btn-xs" disabled={isDeleting} onClick={handleCancelDelete}>
                取消
              </button>
              <button
                className={`btn btn-error btn-xs ${isDeleting ? "loading" : ""}`}
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {!isDeleting && <Trash2 aria-hidden="true" className="h-3 w-3" />}
                {isDeleting ? "刪除中..." : "確認"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 手機版：兩行佈局 */}
      <div className="space-y-2 sm:hidden">
        {/* 第一行：活動類型 + 時間範圍 + 刪除按鈕 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`badge ${formattedRecord.activityColor} text-xs font-medium`}>
              {formattedRecord.activityType}
            </span>
            <div className="text-base-content/80 flex items-center gap-1 text-sm">
              <Clock aria-hidden="true" className="h-3 w-3" />
              <span>{formattedRecord.timeRange}</span>
            </div>
          </div>

          {/* 刪除按鈕 */}
          {!showDeleteConfirm ? (
            <button
              aria-label={`刪除 ${formattedRecord.activityType} 記錄`}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10"
              disabled={isDeleting}
              onClick={handleDeleteClick}
            >
              <Trash2 aria-hidden="true" className="h-3 w-3" />
            </button>
          ) : (
            <div className="flex gap-1">
              <button className="btn btn-ghost btn-xs" disabled={isDeleting} onClick={handleCancelDelete}>
                取消
              </button>
              <button
                className={`btn btn-error btn-xs ${isDeleting ? "loading" : ""}`}
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {!isDeleting && <Trash2 aria-hidden="true" className="h-3 w-3" />}
                {isDeleting ? "刪除中..." : "確認"}
              </button>
            </div>
          )}
        </div>

        {/* 第二行：描述 + 持續時間 + 日期 */}
        <div className="text-base-content/60 flex items-center justify-between text-xs">
          <div className="mr-2 min-w-0 flex-1">
            {formattedRecord.description && <span className="block truncate">{formattedRecord.description}</span>}
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <span>{formattedRecord.duration}</span>
              <span>({formattedRecord.decimalDuration})</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar aria-hidden="true" className="h-3 w-3" />
              <span>{displayDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordItem;
