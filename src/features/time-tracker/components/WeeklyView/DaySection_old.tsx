import { Calendar, Clock } from "lucide-react";
import React, { useMemo } from "react";

import type { TimeRecord } from "@/features/time-tracker/types";
import { ActivityType } from "@/features/time-tracker/types";

import { formatMinutesToHours, getActivityTypeColor } from "../../utils/formatting";

interface DaySectionProps {
  date: Date;
  isToday?: boolean;
  records: TimeRecord[];
}

/**
 * 單日記錄區段元件
 * 顯示特定日期的所有時間記錄
 */
const DaySection: React.FC<DaySectionProps> = ({ date, isToday = false, records }) => {
  // 按活動類型分組並計算總分鐘數
  const statsByType = useMemo(() => {
    const stats: Record<ActivityType, { count: number; minutes: number }> = {
      [ActivityType.CHARACTER]: { count: 0, minutes: 0 },
      [ActivityType.EXTRA_CHARACTER]: { count: 0, minutes: 0 },
      [ActivityType.EXTRA_STUDY]: { count: 0, minutes: 0 },
      [ActivityType.STUDY]: { count: 0, minutes: 0 },
      [ActivityType.WORK]: { count: 0, minutes: 0 },
    };

    records.forEach((record) => {
      stats[record.activityType] = {
        count: (stats[record.activityType]?.count || 0) + 1,
        minutes: (stats[record.activityType]?.minutes || 0) + record.duration,
      };
    });

    return stats;
  }, [records]);

  // 計算當天總分鐘數
  const totalMinutes = useMemo(() => {
    return records.reduce((sum, record) => sum + record.duration, 0);
  }, [records]);

  const dayOfWeek = new Date(date).toLocaleDateString("zh-TW", { weekday: "long" });
  const dateString = date.toLocaleDateString("zh-TW", {
    day: "numeric",
    month: "numeric",
  });

  return (
    <div className={`card bg-base-100 border ${isToday ? "border-primary shadow-md" : "border-base-200 shadow-sm"}`}>
      <div className="card-body p-4">
        {/* 日期標題 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar aria-hidden="true" className={`h-4 w-4 ${isToday ? "text-primary" : "text-base-content/60"}`} />
            <h3 className={`font-medium ${isToday ? "text-primary" : "text-base-content"}`}>
              {dayOfWeek}
              {isToday && <span className="badge badge-primary badge-sm ml-2">今天</span>}
            </h3>
          </div>
          <span className="text-base-content/60 text-sm">{dateString}</span>
        </div>

        {/* 總時間顯示 */}
        <div className="mb-4 flex items-center gap-2">
          <Clock aria-hidden="true" className="text-base-content/60 h-4 w-4" />
          <span className="text-base-content font-medium">
            {totalMinutes > 0 ? formatMinutesToHours(totalMinutes) : "無記錄"}
          </span>
          {totalMinutes > 0 && (
            <span className="text-base-content/60 text-sm">({(totalMinutes / 60).toFixed(1)} hr)</span>
          )}
        </div>

        {/* 活動類型統計 */}
        {Object.entries(statsByType).length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-base-content/80 mb-2 text-sm font-medium">活動分佈</h4>
            <div className="space-y-2">
              {Object.entries(statsByType).map(([type, { minutes }]) => (
                <div className="flex items-center justify-between" key={type}>
                  <span className={`badge badge-sm ${getActivityTypeColor(type as ActivityType)}`}>{type}</span>
                  <span className="text-base-content/80 text-sm">{formatMinutesToHours(minutes)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="text-base-content/40 mb-1">
              <Clock aria-hidden="true" className="mx-auto mb-2 h-8 w-8" />
            </div>
            <p className="text-base-content/60 text-sm">{isToday ? "今天還沒有記錄" : "這天沒有記錄"}</p>
          </div>
        )}

        {/* 記錄詳情 */}
        {records.length > 0 && (
          <div className="border-base-200 mt-4 border-t pt-3">
            <h4 className="text-base-content/80 mb-2 text-sm font-medium">詳細記錄 ({records.length} 筆)</h4>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {records
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((record) => (
                  <div className="flex items-center justify-between text-xs" key={record.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-base-content/60">
                        {record.startTime}-{record.endTime}
                      </span>
                      <span className={`badge badge-xs ${getActivityTypeColor(record.activityType)}`}>
                        {record.activityType}
                      </span>
                    </div>
                    <span className="text-base-content/60">{formatMinutesToHours(record.duration)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySection;
