import React from "react";

import { formatMinutesToHours } from "../../utils/formatting";
import StatisticsCard from "../TimeStatistics/StatisticsCard";

interface WeekStatsProps {
  activeDays: number;
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
  characterMinutes,
  recordCount,
  studyMinutes,
  totalMinutes,
  workMinutes,
}) => {
  return (
    <div className="space-y-4">
      {/* 累計總時數卡片 */}
      <StatisticsCard isTotal={true} label="累計總時數" value={totalMinutes} />

      {/* 其他統計資訊 */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-5">
          <div>
            <span className="text-base-content/60">記錄數：</span>
            <span className="ml-1 font-medium">{recordCount} 筆</span>
          </div>
          <div>
            <span className="text-base-content/60">活躍天數：</span>
            <span className="ml-1 font-medium">{activeDays} 天</span>
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
    </div>
  );
};

export default WeekStats;
