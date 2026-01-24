"use client";

import type { APIErrorResponse, WordAnalysisResponse } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import { ArrowUpCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import type { APICallResult } from "../../types";
import CompleteBar from "./CompleteBar";
import Definitions from "./Definitions";
import ErrorMessage from "./ErrorMessage";
import Etymology from "./Etymology";

interface WordCardProps {
  onComplete: (cardId: string) => void;
  onRegenerate: (cardId: string) => void;
  onUndo: (cardId: string) => void;
  result: APICallResult;
}

const WordCard: React.FC<WordCardProps> = ({ onComplete, onRegenerate, onUndo, result }) => {
  const t = useTranslations("AIDictionary");

  const isError = (response: APIErrorResponse | WordAnalysisResponse): response is APIErrorResponse => {
    return "error" in response;
  };

  const handleScrollToTop = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  const handleRegenerate = () => {
    onRegenerate(result.id);
  };

  if (result.showUndoInPlace) {
    return <CompleteBar id={result.id} onUndo={onUndo} word={result.word} />;
  }

  // 卡片樣式類別
  const cardClass = cn(
    // 基礎樣式
    "relative rounded-lg border border-slate-200 bg-white shadow-sm",
    "transition-all duration-1200 ease-in-out",
    // 狀態樣式
    result.isCompleting && "border-blue-200 shadow-lg",
    result.isRemoving ? "translate-y-[-20px] scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100",
  );

  // 按鈕樣式類別
  const buttonClass = cn(
    // 基礎樣式
    "rounded-md px-3 py-1 text-sm font-medium",
    "transition-all duration-300",
    // 狀態樣式
    result.isCompleting
      ? "scale-105 bg-green-100 text-green-800"
      : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
  );

  return (
    <div className={cardClass}>
      <div className="p-4 sm:p-6">
        {/* 成功動畫 */}
        {result.isCompleting && (
          <>
            <div className={cn("pointer-events-none absolute inset-0", "flex items-center justify-center")}>
              <div className="animate-bounce text-6xl">🎉</div>
            </div>
            <div className={cn("pointer-events-none absolute", "top-8 right-8")}>
              <div className="animate-pulse text-3xl">✨</div>
            </div>
            <div className={cn("pointer-events-none absolute", "top-12 right-12")}>
              <div className="animate-ping text-2xl">⭐</div>
            </div>
          </>
        )}

        {/* 時間戳 - 右上角 */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <p className={cn("text-xs text-slate-500", "sm:text-sm")}>{result.timestamp}</p>
        </div>

        {/* 單字標題區域 */}
        <div className={cn("mb-6 pr-16")}>
          <div className="flex items-center gap-3">
            <h3 className={cn("text-lg font-semibold text-slate-800", "sm:text-2xl")}>{result.word}</h3>

            {/* 重新生成按鈕 */}
            <button
              aria-label={t("wordCard.regenerateAria")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1",
                "text-xs text-slate-500",
                "transition-all duration-200",
                "hover:bg-slate-50 hover:text-slate-600",
                "focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              disabled={result.isCompleting || result.isRemoving}
              onClick={handleRegenerate}
              type="button"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{t("wordCard.regenerate")}</span>
            </button>
          </div>
        </div>

        {isError(result.response) ? (
          <ErrorMessage error={result.response.error} />
        ) : (
          <div className="space-y-6">
            <Definitions definitions={result.response.definitions} />
            <Etymology etymologyBlocks={result.response.etymologyBlocks} />
          </div>
        )}

        {/* 底部操作區域 */}
        <div className={cn("mt-6 flex items-center justify-between", "border-t border-slate-100 pt-4")}>
          {/* 學習完成按鈕 */}
          <button
            className={buttonClass}
            disabled={result.isCompleting || result.isRemoving}
            onClick={() => onComplete(result.id)}
          >
            {result.isCompleting ? t("wordCard.completed") : t("wordCard.markComplete")}
          </button>

          {/* 捲動到頂部按鈕 */}
          <button
            aria-label={t("wordCard.scrollToTopAria")}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1",
              "text-xs text-slate-500",
              "transition-all duration-200",
              "hover:bg-slate-50 hover:text-slate-600",
              "focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none",
            )}
            onClick={handleScrollToTop}
            type="button"
          >
            <ArrowUpCircle className="h-3 w-3" />
            <span>{t("wordCard.scrollToTop")}</span>
          </button>

          {/* 空元素 - 用於平衡佈局 */}
          <div className="w-20" />
        </div>
      </div>
    </div>
  );
};

export default WordCard;
