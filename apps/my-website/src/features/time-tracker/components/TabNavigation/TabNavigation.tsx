"use client";

import { BarChart3, List } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Tab } from "../../types";

export interface TabNavigationProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onChange }) => {
  const t = useTranslations("TimeTracker");
  const ICON_CLASS = "mr-2 h-4 w-4";

  return (
    <>
      <button className={`tab ${activeTab === Tab.MAIN ? "tab-active" : ""}`} onClick={() => onChange(Tab.MAIN)}>
        <List className={ICON_CLASS} />
        {t("tabs.main")}
      </button>
      <button
        className={`tab ${activeTab === Tab.WEEKLY_STATS ? "tab-active" : ""}`}
        onClick={() => onChange(Tab.WEEKLY_STATS)}
      >
        <BarChart3 className={ICON_CLASS} />
        {t("tabs.weeklyStats")}
      </button>
      <button
        className={`tab ${activeTab === Tab.STATISTICS ? "tab-active" : ""}`}
        onClick={() => onChange(Tab.STATISTICS)}
      >
        <BarChart3 className={ICON_CLASS} />
        {t("tabs.allStatistics")}
      </button>
    </>
  );
};

export default TabNavigation;
