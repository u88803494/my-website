"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface SubmitButtonProps {
  isLoading?: boolean;
}

/**
 * 提交按鈕元件
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading = false }) => {
  const t = useTranslations("TimeTracker");

  return (
    <div className="form-control">
      <button className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading} type="submit">
        {!isLoading && <Plus aria-hidden="true" className="mr-2 h-4 w-4" />}
        {isLoading ? t("form.submitting") : t("form.submit")}
      </button>
    </div>
  );
};

export default SubmitButton;
