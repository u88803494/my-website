"use client";

import { useTranslations } from "next-intl";

import type { APICallResult } from "../types";
import EmptyState from "./EmptyState";
import WordCard from "./WordCard";

interface ResultsListProps {
  isLoading: boolean;
  onClearResults: () => void;
  onComplete: (cardId: string) => void;
  onOpenDonateModal: () => void;
  onRegenerate: (cardId: string) => void;
  onUndo: (cardId: string) => void;
  results: APICallResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({
  isLoading,
  onClearResults,
  onComplete,
  onOpenDonateModal,
  onRegenerate,
  onUndo,
  results,
}) => {
  const t = useTranslations("AIDictionary");

  if (results.length === 0 && !isLoading) {
    return <EmptyState onOpenDonateModal={onOpenDonateModal} />;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium text-slate-800">
          {t("results.title")} <span className="text-slate-500">({results.length})</span>
        </h2>
        <button className="text-sm text-slate-500 transition-colors hover:text-slate-700" onClick={onClearResults}>
          {t("results.clearAll")}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {results.map((result) => (
          <WordCard
            key={result.id}
            onComplete={onComplete}
            onRegenerate={onRegenerate}
            onUndo={onUndo}
            result={result}
          />
        ))}
      </div>
    </>
  );
};

export default ResultsList;
