"use client";

import { useWordAnalysis } from "../hooks/useWordAnalysis";
import { useWordLearning } from "../hooks/useWordLearning";
import LoadingState from "./LoadingState";
import ResultsList from "./ResultsList";
import WordSearchForm from "./WordSearchForm";

const AIDictionaryContent: React.FC = () => {
  const mutation = useWordAnalysis();
  const { addResult, handleClearResults, handleCompleteCard, handleUndo, testResults } = useWordLearning();

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

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Search Form */}
        <WordSearchForm isLoading={mutation.isPending} onSubmit={handleSubmit} />

        {/* Loading State */}
        {mutation.isPending && <LoadingState />}

        {/* Results */}
        <ResultsList
          isLoading={mutation.isPending}
          onClearResults={handleClearResults}
          onComplete={handleCompleteCard}
          onUndo={handleUndo}
          results={testResults}
        />
      </div>
    </div>
  );
};

export default AIDictionaryContent;
