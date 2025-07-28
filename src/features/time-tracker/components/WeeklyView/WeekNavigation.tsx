"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

// 使用 dynamic 載入組件，並關閉 SSR
const ClientSideDate = dynamic(() => import("./ClientSideDate"), {
  // 提供一個載入時的佔位符，避免佈局跳動
  loading: () => <span className="opacity-0">...</span>,
  ssr: false,
});

// 建立一個顯示年份的客戶端組件
const ClientSideYear = dynamic(
  () =>
    Promise.resolve(({ date }: { date: Date }) => {
      return <>{date.getFullYear()} 年</>;
    }),
  {
    loading: () => <span className="opacity-0">... 年</span>,
    ssr: false,
  },
);

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
  onNextWeek,
  onPreviousWeek,
  weekEnd,
}) => {
  return (
    <div className="bg-base-200 flex items-center justify-between rounded-lg p-3">
      <button aria-label="上一週" className="btn btn-ghost btn-sm" onClick={onPreviousWeek}>
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      <div className="text-center">
        <div className="text-base-content font-medium">
          <ClientSideDate date={currentWeekStart} locale="zh-TW" options={{ day: "numeric", month: "long" }} /> -{" "}
          <ClientSideDate date={weekEnd} locale="zh-TW" options={{ day: "numeric", month: "long" }} />
        </div>
        <div className="text-base-content/60 text-sm">
          <ClientSideYear date={currentWeekStart} />
          {isCurrentWeek && <span className="badge badge-primary badge-sm ml-2">本週</span>}
        </div>
      </div>

      <button aria-label="下一週" className="btn btn-ghost btn-sm" onClick={onNextWeek}>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default WeekNavigation;
