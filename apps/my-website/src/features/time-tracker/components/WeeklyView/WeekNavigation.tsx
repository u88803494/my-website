"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

// Dynamic import to disable SSR and avoid hydration mismatch
const ClientSideDate = dynamic(() => import("./ClientSideDate"), {
  loading: () => <span className="opacity-0">...</span>,
  ssr: false,
});

// Client-side year display component
const ClientSideYear = dynamic(
  () =>
    Promise.resolve(({ date, locale }: { date: Date; locale: string }) => {
      const formattedYear = date.toLocaleDateString(locale, { year: "numeric" });
      return <>{formattedYear}</>;
    }),
  {
    loading: () => <span className="opacity-0">...</span>,
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
 * Week navigation component
 */
const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekStart,
  isCurrentWeek,
  onNextWeek,
  onPreviousWeek,
  weekEnd,
}) => {
  const t = useTranslations("TimeTracker");
  const locale = useLocale();

  // Memoize date formatting options based on locale
  const dateOptions = useMemo<Intl.DateTimeFormatOptions>(() => ({ day: "numeric", month: "long" }), []);

  return (
    <div className="bg-base-200 flex items-center justify-between rounded-lg p-3">
      <button aria-label={t("weeklyView.previousWeek")} className="btn btn-ghost btn-sm" onClick={onPreviousWeek}>
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      <div className="text-center">
        <div className="text-base-content font-medium">
          <ClientSideDate date={currentWeekStart} locale={locale} options={dateOptions} /> -{" "}
          <ClientSideDate date={weekEnd} locale={locale} options={dateOptions} />
        </div>
        <div className="text-base-content/60 text-sm">
          <ClientSideYear date={currentWeekStart} locale={locale} />
          {isCurrentWeek && <span className="badge badge-primary badge-sm ml-2">{t("weeklyView.thisWeek")}</span>}
        </div>
      </div>

      <button aria-label={t("weeklyView.nextWeek")} className="btn btn-ghost btn-sm" onClick={onNextWeek}>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default WeekNavigation;
