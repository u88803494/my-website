"use client";

import { cn } from "@packages/shared/utils";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { AnalysisResultProps } from "../types";

const AnalysisResult: React.FC<AnalysisResultProps> = ({ isCopying, onChange, onCopy, value }) => {
  const t = useTranslations("AIAnalyzer");
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  if (!value) return null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base-content text-lg font-semibold">{t("result.title")}</h3>
        <button
          className={cn("btn btn-outline btn-sm gap-2", showCopySuccess && "btn-success")}
          disabled={isCopying}
          onClick={handleCopy}
        >
          {showCopySuccess ? (
            <>
              <Check className="h-4 w-4" />
              {t("result.copied")}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t("result.copy")}
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <textarea
          className={cn(
            "textarea textarea-bordered h-64 w-full resize-none",
            "font-mono text-sm leading-relaxed",
            "focus:ring-primary focus:ring-2 focus:outline-none",
          )}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("result.placeholder")}
          value={value}
        />

        <div className="text-base-content/40 absolute top-2 right-2 text-xs">
          {t("result.characterCount", { count: value.length })}
        </div>
      </div>

      <div className="text-base-content/60 text-center text-sm">{t("result.hint")}</div>
    </div>
  );
};

export default AnalysisResult;
