import type { ActivityType } from "@/features/time-tracker/types";
import { Clock, TrendingUp } from "lucide-react";
import React from "react";

import { formatMinutesToDecimalHours, formatMinutesToHours, getActivityTypeColor } from "../../utils/formatting";

interface StatisticsCardProps {
  activityType?: ActivityType;
  isTotal?: boolean;
  label: string;
  percentage?: number;
  value: number; // 分鐘
}

/**
 * 統計卡片元件
 * 顯示單一統計項目的資訊
 */
const StatisticsCard: React.FC<StatisticsCardProps> = ({ activityType, isTotal = false, label, percentage, value }) => {
  const formattedTime = formatMinutesToHours(value);
  const decimalHours = formatMinutesToDecimalHours(value);

  // 獲取活動類型對應的色彩
  const colorClass = activityType
    ? getActivityTypeColor(activityType)
    : isTotal
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-base-200 text-base-content border-base-300";

  return (
    <div className={`card bg-base-100 border shadow-sm ${isTotal ? "border-primary/20" : "border-base-200"}`}>
      <div className="card-body p-4">
        {/* 標題區域 */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base-content/80 text-sm font-medium">{label}</h3>
          {isTotal ? (
            <TrendingUp aria-hidden="true" className="text-primary h-4 w-4" />
          ) : (
            <Clock aria-hidden="true" className="text-base-content/60 h-4 w-4" />
          )}
        </div>

        {/* 活動類型標籤 */}
        {activityType && (
          <div className="mb-3">
            <span className={`badge badge-sm ${colorClass} font-medium`}>{activityType}</span>
          </div>
        )}

        {/* 時間顯示 */}
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${isTotal ? "text-primary" : "text-base-content"}`}>
            {value === 0 ? "0" : formattedTime}
          </div>

          {value > 0 && <div className="text-base-content/60 text-sm">{decimalHours}</div>}
        </div>

        {/* 百分比顯示 */}
        {percentage !== undefined && percentage > 0 && (
          <div className="mt-2">
            <div className="text-base-content/60 mb-1 flex items-center justify-between text-xs">
              <span>佔比</span>
              <span>{percentage}%</span>
            </div>
            <div className="bg-base-200 h-1.5 w-full rounded-full">
              <div
                aria-label={`${label} 佔 ${percentage}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={percentage}
                className={`h-1.5 rounded-full transition-all duration-300 ${isTotal ? "bg-primary" : "bg-primary/70"}`}
                role="progressbar"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* 空狀態 */}
        {value === 0 && <div className="text-base-content/40 mt-1 text-xs">尚無記錄</div>}
      </div>
    </div>
  );
};

export default StatisticsCard;
