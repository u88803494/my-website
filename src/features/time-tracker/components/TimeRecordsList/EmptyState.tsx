import { List } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  hasFilters: boolean;
}

/**
 * 空狀態元件
 */
const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
  return (
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
  );
};

export default EmptyState;
