"use client";

import { useState } from "react";

import { useWordAnalysis } from "../hooks/useWordAnalysis";
import { useWordLearning } from "../hooks/useWordLearning";
import DonateModal from "./DonateModal";
import LoadingState from "./LoadingState";
import ResultsList from "./ResultsList";
import WordSearchForm from "./WordSearchForm";

const AIDictionaryContent: React.FC = () => {
  const mutation = useWordAnalysis();
  const { addResult, handleClearResults, handleCompleteCard, handleUndo, testResults } = useWordLearning();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleSubmit = (word: string) => {
    mutation.mutate(word, {
      onError: (error) => {
        addResult(word, { error: error.message });
      },
      onSuccess: (data) => {
        addResult(word, data);
      },
    });
  };

  const handleOpenDonateModal = () => {
    setIsDonateModalOpen(true);
  };

  const handleCloseDonateModal = () => {
    setIsDonateModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {/* Search Form */}
        <WordSearchForm isLoading={mutation.isPending} onSubmit={handleSubmit} />

        {/* Loading State */}
        {mutation.isPending && <LoadingState />}

        {/* 免責聲明：僅在尚未搜尋時顯示 */}
        {testResults.length === 0 && !mutation.isPending && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-amber-600">📚</span>
              <div className="flex-1 text-sm">
                <p className="text-amber-800">本字典內容由 AI 生成，建議搭配傳統字典使用以確保準確性。</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <ResultsList
          isLoading={mutation.isPending}
          onClearResults={handleClearResults}
          onComplete={handleCompleteCard}
          onOpenDonateModal={handleOpenDonateModal}
          onUndo={handleUndo}
          results={testResults}
        />
      </div>

      {/* Donate Modal */}
      <DonateModal isOpen={isDonateModalOpen} onClose={handleCloseDonateModal} />
    </div>
  );
};

export default AIDictionaryContent;
