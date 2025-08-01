import React, { useState } from "react";

import type { TimeRecord } from "../../types";
import TimeEntryForm from "../TimeEntryForm/TimeEntryForm";
import TimeRecordsList from "../TimeRecordsList/TimeRecordsList";

export interface MainTabContentProps {
  isLoading: boolean;
  onAddRecord: (record: Omit<TimeRecord, "createdAt" | "id">) => void;
  onDeleteRecord: (id: string) => void;
  records: TimeRecord[];
}

const MainTabContent: React.FC<MainTabContentProps> = ({ isLoading, onAddRecord, onDeleteRecord, records }) => {
  const [showAllRecords, setShowAllRecords] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 text-xl">新增時間記錄</h2>
          <TimeEntryForm isLoading={isLoading} onSubmit={onAddRecord} />
        </div>
      </div>

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="card-title text-xl">最近記錄</h2>
            <button className="btn btn-sm btn-outline" onClick={() => setShowAllRecords(!showAllRecords)}>
              {showAllRecords ? "顯示較少" : "顯示全部"}
            </button>
          </div>
          <TimeRecordsList
            isLoading={isLoading}
            maxItems={showAllRecords ? undefined : 5}
            onDeleteRecord={onDeleteRecord}
            records={records}
          />
          {!showAllRecords && records.length > 5 && (
            <div className="text-base-content/60 mt-4 text-center text-sm">還有 {records.length - 5} 筆記錄</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainTabContent;
export { MainTabContent };
