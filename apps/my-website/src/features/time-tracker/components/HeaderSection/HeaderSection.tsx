"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface HeaderSectionProps {
  onToggleSettings: () => void;
}

/**
 * 時間追蹤器頁面標題區域組件
 * 包含標題、說明文字和設定按鈕
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({ onToggleSettings }) => {
  const t = useTranslations("TimeTracker");

  return (
    <div className="relative text-center">
      <h1 className="text-base-content mb-2 text-4xl font-bold">{t("title")}</h1>
      <p className="text-base-content/70">{t("description")}</p>

      {/* 設定按鈕 */}
      <button className="btn btn-ghost btn-sm absolute top-0 right-0" onClick={onToggleSettings} title={t("openSettings")}>
        <Settings aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
};

export default HeaderSection;
