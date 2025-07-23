import { Clock } from "lucide-react";
import React from "react";

import { formatMinutesToHours } from "../../utils/formatting";

interface DurationPreviewProps {
  duration: number;
  endTime: string;
  error?: string;
  isValid: boolean;
  startTime: string;
}

/**
 * 持續時間預覽元件
 */
const DurationPreview: React.FC<DurationPreviewProps> = ({ duration, endTime, error, isValid, startTime }) => {
  if (!startTime || !endTime) {
    return null;
  }

  if (isValid && duration > 0) {
    return (
      <div className="alert alert-info">
        <Clock aria-hidden="true" className="h-4 w-4" />
        <span>
          預計持續時間：{formatMinutesToHours(duration)}
          <span className="ml-2 text-sm opacity-75">({(duration / 60).toFixed(2)} hr)</span>
        </span>
      </div>
    );
  }

  if (!isValid && error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return null;
};

export default DurationPreview;
