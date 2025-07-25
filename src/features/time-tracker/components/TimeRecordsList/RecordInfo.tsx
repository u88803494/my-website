import { Calendar, Clock } from "lucide-react";
import React from "react";

import type { FormattedRecord } from "../../utils/formatting";

interface RecordInfoProps {
  displayDate: string;
  formattedRecord: FormattedRecord;
}

/**
 * 記錄資訊元件
 */
const RecordInfo: React.FC<RecordInfoProps> = ({ displayDate, formattedRecord }) => {
  return (
    <>
      {/* 桌面版：單行佈局 */}
      <div className="hidden items-center justify-between sm:flex">
        {/* 左側：活動類型 + 時間範圍 */}
        <div className="flex flex-1 items-center gap-3">
          <span className={`badge ${formattedRecord.activityColor} font-medium`}>{formattedRecord.activityType}</span>
          <div className="text-base-content/80 flex items-center gap-2 text-sm">
            <Clock aria-hidden="true" className="h-4 w-4" />
            <span>{formattedRecord.timeRange}</span>
          </div>
          {formattedRecord.description && (
            <span className="text-base-content/60 max-w-xs truncate text-sm">{formattedRecord.description}</span>
          )}
        </div>

        {/* 右側：持續時間 + 日期 */}
        <div className="flex items-center gap-4">
          <div className="text-base-content/60 flex items-center gap-2 text-sm">
            <span>{formattedRecord.duration}</span>
            <span className="text-xs">({formattedRecord.decimalDuration})</span>
          </div>
          <div className="text-base-content/50 flex items-center gap-1 text-xs">
            <Calendar aria-hidden="true" className="h-3 w-3" />
            <span>{displayDate}</span>
          </div>
        </div>
      </div>

      {/* 手機版：兩行佈局 */}
      <div className="space-y-2 sm:hidden">
        {/* 第一行：活動類型 + 時間範圍 */}
        <div className="flex items-center">
          <span className={`badge ${formattedRecord.activityColor} text-xs font-medium`}>
            {formattedRecord.activityType}
          </span>
          <div className="text-base-content/80 ml-2 flex items-center gap-1 text-sm">
            <Clock aria-hidden="true" className="h-3 w-3" />
            <span>{formattedRecord.timeRange}</span>
          </div>
        </div>

        {/* 第二行：描述 + 持續時間 + 日期 */}
        <div className="text-base-content/60 flex items-center justify-between text-xs">
          <div className="mr-2 min-w-0 flex-1">
            {formattedRecord.description && <span className="block truncate">{formattedRecord.description}</span>}
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <span>{formattedRecord.duration}</span>
              <span>({formattedRecord.decimalDuration})</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar aria-hidden="true" className="h-3 w-3" />
              <span>{displayDate}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordInfo;
