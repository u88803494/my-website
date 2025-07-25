import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface WeekNavigationProps {
  currentWeekStart: Date;
  isCurrentWeek: boolean;
  onCurrentWeek: () => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  weekEnd: Date;
}

/**
 * 週導航元件
 */
const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekStart,
  isCurrentWeek,
  onCurrentWeek,
  onNextWeek,
  onPreviousWeek,
  weekEnd,
}) => {
  return (
    <>
      {!isCurrentWeek && (
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={onCurrentWeek}>
            回到本週
          </button>
        </div>
      )}

      <div className="bg-base-200 flex items-center justify-between rounded-lg p-3">
        <button aria-label="上一週" className="btn btn-ghost btn-sm" onClick={onPreviousWeek}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="text-base-content font-medium">
            {currentWeekStart.toLocaleDateString("zh-TW", {
              day: "numeric",
              month: "long",
            })}{" "}
            -{" "}
            {weekEnd.toLocaleDateString("zh-TW", {
              day: "numeric",
              month: "long",
            })}
          </div>
          <div className="text-base-content/60 text-sm">
            {currentWeekStart.getFullYear()} 年
            {isCurrentWeek && <span className="badge badge-primary badge-sm ml-2">本週</span>}
          </div>
        </div>

        <button aria-label="下一週" className="btn btn-ghost btn-sm" onClick={onNextWeek}>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

export default WeekNavigation;
