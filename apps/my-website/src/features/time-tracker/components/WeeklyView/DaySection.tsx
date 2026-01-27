"use client";

import { Calendar, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo } from "react";

import { ActivityType, type ActivityType as ActivityTypeType, type TimeRecord } from "@/features/time-tracker/types";

import { formatMinutesToHours, getActivityTypeColor } from "../../utils/formatting";

// Map ActivityType enum values to translation keys
const ACTIVITY_TYPE_TO_KEY: Record<ActivityTypeType, string> = {
  [ActivityType.WORK]: "activityTypes.work",
  [ActivityType.STUDY]: "activityTypes.study",
  [ActivityType.CHARACTER]: "activityTypes.character",
  [ActivityType.LISTENING]: "activityTypes.listening",
  [ActivityType.EXTRA_STUDY]: "activityTypes.extraStudy",
  [ActivityType.EXTRA_CHARACTER]: "activityTypes.extraCharacter",
  [ActivityType.EXTRA_LISTENING]: "activityTypes.extraListening",
};

interface DaySectionProps {
  date: Date;
  records: TimeRecord[];
}

/**
 * Day record section component
 * Displays all time records for a specific date
 */
const DaySection: React.FC<DaySectionProps> = ({ date, records }) => {
  const t = useTranslations("TimeTracker");
  const locale = useLocale();
  const [isToday, setIsToday] = React.useState(false);

  // Format weekday based on current locale
  const formattedWeekday = useMemo(() => {
    return new Date(date).toLocaleDateString(locale, { weekday: "long" });
  }, [date, locale]);

  // Format date string based on current locale
  const formattedDateString = useMemo(() => {
    return date.toLocaleDateString(locale, { day: "numeric", month: "numeric" });
  }, [date, locale]);

  React.useEffect(() => {
    const today = new Date();
    const isTodayValue =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    setIsToday(isTodayValue);
  }, [date]);

  // 按活動類型分組並計算總分鐘數
  const statsByType = useMemo(() => {
    const stats: Record<ActivityType, { count: number; minutes: number }> = {
      [ActivityType.CHARACTER]: { count: 0, minutes: 0 },
      [ActivityType.EXTRA_CHARACTER]: { count: 0, minutes: 0 },
      [ActivityType.EXTRA_LISTENING]: { count: 0, minutes: 0 },
      [ActivityType.EXTRA_STUDY]: { count: 0, minutes: 0 },
      [ActivityType.LISTENING]: { count: 0, minutes: 0 },
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

  return (
    <div className={`card bg-base-100 border ${isToday ? "border-primary shadow-md" : "border-base-200 shadow-sm"}`}>
      <div className="card-body p-4">
        {/* 日期標題 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar aria-hidden="true" className={`h-4 w-4 ${isToday ? "text-primary" : "text-base-content/60"}`} />
            <h3 className={`font-medium ${isToday ? "text-primary" : "text-base-content"}`}>
              {formattedWeekday}
              {isToday && <span className="badge badge-primary badge-sm ml-2">{t("weeklyView.today")}</span>}
            </h3>
          </div>
          <span className="text-base-content/60 text-sm">{formattedDateString}</span>
        </div>

        {/* 總時間顯示 */}
        <div className="mb-4 flex items-center gap-2">
          <Clock aria-hidden="true" className="text-base-content/60 h-4 w-4" />
          <span className="text-base-content font-medium">
            {totalMinutes > 0 ? formatMinutesToHours(totalMinutes) : t("weeklyView.noRecords")}
          </span>
          {totalMinutes > 0 && (
            <span className="text-base-content/60 text-sm">({(totalMinutes / 60).toFixed(1)} hr)</span>
          )}
        </div>

        {/* 活動類型統計 */}
        {totalMinutes > 0 ? (
          <div className="space-y-2">
            <h4 className="text-base-content/80 mb-2 text-sm font-medium">{t("weeklyView.activityDistribution")}</h4>
            <div className="space-y-2">
              {Object.values(ActivityType)
                .filter((type) => statsByType[type].minutes > 0)
                .map((type) => (
                  <div className="flex items-center justify-between" key={type}>
                    <span className={`badge badge-sm ${getActivityTypeColor(type)}`}>
                      {t(ACTIVITY_TYPE_TO_KEY[type])}
                    </span>
                    <span className="text-base-content/80 text-sm">
                      {formatMinutesToHours(statsByType[type].minutes)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="text-base-content/40 mb-1">
              <Clock aria-hidden="true" className="mx-auto mb-2 h-8 w-8" />
            </div>
            <p className="text-base-content/60 text-sm">
              {isToday ? t("weeklyView.noRecordsToday") : t("weeklyView.noRecordsThisDay")}
            </p>
          </div>
        )}

        {/* 記錄詳情 */}
        {records.length > 0 && (
          <div className="border-base-200 mt-4 border-t pt-3">
            <h4 className="text-base-content/80 mb-2 text-sm font-medium">
              {t("weeklyView.detailedRecords", { count: records.length })}
            </h4>
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
                        {t(ACTIVITY_TYPE_TO_KEY[record.activityType])}
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
