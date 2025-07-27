import { BarChart3 } from "lucide-react";
import React from "react";

import { formatMinutesToHours } from "../../utils/formatting";

interface WeekStatsProps {
  activeDays: number;
  averagePerDay: number;
  characterMinutes: number;
  recordCount: number;
  studyMinutes: number;
  totalMinutes: number;
  workMinutes: number;
}

/**
 * 週統計元件
 */
const WeekStats: React.FC<WeekStatsProps> = ({
  activeDays,
  averagePerDay,
  characterMinutes,
  recordCount,
  studyMinutes,
  totalMinutes,
  workMinutes,
}) => {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 aria-hidden="true" className="text-primary h-4 w-4" />
        <h4 className="text-base-content font-medium">週統計</h4>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-6">
        <div>
          <span className="text-base-content/60">總時間：</span>
          <span className="ml-1 font-medium">{formatMinutesToHours(totalMinutes)}</span>
        </div>
        <div>
          <span className="text-base-content/60">記錄數：</span>
          <span className="ml-1 font-medium">{recordCount} 筆</span>
        </div>
        <div>
          <span className="text-base-content/60">活躍天數：</span>
          <span className="ml-1 font-medium">{activeDays} 天</span>
        </div>
        <div>
          <span className="text-base-content/60">日均時間：</span>
          <span className="ml-1 font-medium">{formatMinutesToHours(averagePerDay)}</span>
        </div>
        <div>
          <span className="text-base-content/60">工作時間：</span>
          <span className="ml-1 font-medium">{formatMinutesToHours(workMinutes)}</span>
        </div>
        <div>
          <span className="text-base-content/60">讀書時間：</span>
          <span className="ml-1 font-medium">{formatMinutesToHours(studyMinutes)}</span>
        </div>
        <div>
          <span className="text-base-content/60">品格時間：</span>
          <span className="ml-1 font-medium">{formatMinutesToHours(characterMinutes)}</span>
        </div>
      </div>
    </div>
  );
};

export default WeekStats;
