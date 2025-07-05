import type { APICallResult } from "../types";
import EmptyState from "./EmptyState";
import WordCard from "./WordCard";

interface ResultsListProps {
  isLoading: boolean;
  onClearResults: () => void;
  onComplete: (cardId: string) => void;
  onUndo: (cardId: string) => void;
  results: APICallResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({ isLoading, onClearResults, onComplete, onUndo, results }) => {
  if (results.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      {/* AI 生成內容免責聲明 */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg text-amber-600">📚</span>
          <div className="flex-1 text-sm">
            <p className="text-amber-800">本字典內容由 AI 生成，建議搭配傳統字典使用以確保準確性。</p>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium text-slate-800">
          查詢結果 <span className="text-slate-500">({results.length})</span>
        </h2>
        <button className="text-sm text-slate-500 transition-colors hover:text-slate-700" onClick={onClearResults}>
          清除所有結果
        </button>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {results.map((result) => (
          <WordCard key={result.id} onComplete={onComplete} onUndo={onUndo} result={result} />
        ))}
      </div>
    </>
  );
};

export default ResultsList;
