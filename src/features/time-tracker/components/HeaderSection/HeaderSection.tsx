"use client";

import { Settings } from "lucide-react";
import React from "react";

interface HeaderSectionProps {
  onToggleSettings: () => void;
}

/**
 * 時間追蹤器頁面標題區域組件
 * 包含標題、說明文字和設定按鈕
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({ onToggleSettings }) => {
  return (
    <div className="relative text-center">
      <h1 className="text-base-content mb-2 text-4xl font-bold">時間追蹤器</h1>
      <p className="text-base-content/70">記錄和分析你的時間分配，提升效率管理</p>

      {/* 設定按鈕 */}
      <button className="btn btn-ghost btn-sm absolute top-0 right-0" onClick={onToggleSettings} title="開啟設定">
        <Settings aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
};

export default HeaderSection;
