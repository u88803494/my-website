"use client";

import React, { useState } from "react";

import type { TimeRecord } from "@/features/time-tracker/types";

import { formatTimeRecord } from "../../utils/formatting";
import { getDateDisplayNameInTaiwan } from "../../utils/time";
import DeleteButton from "./DeleteButton";
import RecordInfo from "./RecordInfo";

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
  const displayDate = getDateDisplayNameInTaiwan(new Date(record.date));

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
      <div className="flex items-center justify-between">
        <RecordInfo displayDate={displayDate} formattedRecord={formattedRecord} />
        <DeleteButton
          isDeleting={isDeleting}
          itemName={formattedRecord.activityType}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          onDelete={handleDeleteClick}
          showConfirm={showDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default RecordItem;
