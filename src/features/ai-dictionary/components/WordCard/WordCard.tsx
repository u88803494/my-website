import type { APIErrorResponse, WordAnalysisResponse } from "@/types/dictionary.types";
import { cn } from "@/utils/cn";

import type { APICallResult } from "../../types";
import CompleteBar from "./CompleteBar";
import Definitions from "./Definitions";
import ErrorMessage from "./ErrorMessage";
import Etymology from "./Etymology";

interface WordCardProps {
  onComplete: (cardId: string) => void;
  onUndo: (cardId: string) => void;
  result: APICallResult;
}

const WordCard: React.FC<WordCardProps> = ({ onComplete, onUndo, result }) => {
  const isError = (response: APIErrorResponse | WordAnalysisResponse): response is APIErrorResponse => {
    return "error" in response;
  };

  if (result.showUndoInPlace) {
    return <CompleteBar id={result.id} onUndo={onUndo} word={result.word} />;
  }

  // 狀態 className 合併
  const cardClass = cn(
    "relative rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-1200 ease-in-out",
    result.isCompleting && "border-blue-200 shadow-lg",
    result.isRemoving ? "translate-y-[-20px] scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100",
  );

  const buttonClass = cn(
    "absolute top-4 right-4 rounded-md px-3 py-1 text-sm font-medium transition-all duration-300",
    result.isCompleting
      ? "scale-105 bg-green-100 text-green-800"
      : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
  );

  return (
    <div className={cardClass}>
      <div className="p-6">
        {/* 完成學習按鈕 */}
        <button
          className={buttonClass}
          disabled={result.isCompleting || result.isRemoving}
          onClick={() => onComplete(result.id)}
        >
          {result.isCompleting ? "已完成 👍" : "學習完成"}
        </button>

        {/* 成功動畫 */}
        {result.isCompleting && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="animate-bounce text-6xl">🎉</div>
            </div>
            <div className="pointer-events-none absolute top-8 right-8">
              <div className="animate-pulse text-3xl">✨</div>
            </div>
            <div className="pointer-events-none absolute top-12 right-12">
              <div className="animate-ping text-2xl">⭐</div>
            </div>
          </>
        )}

        {/* 單字標題 */}
        <div className="mb-6 pr-20">
          <h3 className="mb-2 text-2xl font-semibold text-slate-800">{result.word}</h3>
          <p className="text-sm text-slate-500">{result.timestamp}</p>
        </div>

        {isError(result.response) ? (
          <ErrorMessage error={result.response.error} />
        ) : (
          <div className="space-y-6">
            <Definitions definitions={result.response.definitions} />
            <Etymology etymologyBlocks={result.response.etymologyBlocks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;
