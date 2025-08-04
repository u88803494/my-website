import { BarChart3, List } from "lucide-react";
import React from "react";

import { TIME_TRACKER_I18N } from "../../constants/i18n";
import { Tab } from "../../types";

export interface TabNavigationProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onChange }) => {
  const ICON_CLASS = "mr-2 h-4 w-4";

  return (
    <>
      <button className={`tab ${activeTab === Tab.MAIN ? "tab-active" : ""}`} onClick={() => onChange(Tab.MAIN)}>
        <List className={ICON_CLASS} />
        {TIME_TRACKER_I18N.TABS.MAIN}
      </button>
      <button
        className={`tab ${activeTab === Tab.WEEKLY_STATS ? "tab-active" : ""}`}
        onClick={() => onChange(Tab.WEEKLY_STATS)}
      >
        <BarChart3 className={ICON_CLASS} />
        {TIME_TRACKER_I18N.TABS.WEEKLY_STATS}
      </button>
      <button
        className={`tab ${activeTab === Tab.STATISTICS ? "tab-active" : ""}`}
        onClick={() => onChange(Tab.STATISTICS)}
      >
        <BarChart3 className={ICON_CLASS} />
        {TIME_TRACKER_I18N.TABS.ALL_STATISTICS}
      </button>
    </>
  );
};

export default TabNavigation;
