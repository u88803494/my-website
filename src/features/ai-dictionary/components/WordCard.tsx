import type { APIErrorResponse, WordAnalysisResponse } from "@/types/dictionary.types";

import type { APICallResult } from "../types";

interface WordCardProps {
  onComplete: (cardId: string) => void;
  onUndo: (cardId: string) => void;
  result: APICallResult;
}

const WordCard: React.FC<WordCardProps> = ({ onComplete, onUndo, result }) => {
  const isError = (response: APIErrorResponse | WordAnalysisResponse): response is APIErrorResponse => {
    return "error" in response;
  };

  // 就地撤銷條
  if (result.showUndoInPlace) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
              <span className="text-sm text-white">✓</span>
            </div>
            <span className="font-medium text-green-800">已完成學習「{result.word}」</span>
          </div>
          <button
            className="px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:text-green-900"
            onClick={() => onUndo(result.id)}
          >
            撤銷
          </button>
        </div>
      </div>
    );
  }

  // 正常卡片
  return (
    <div
      className={`relative rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-1200 ease-in-out ${
        result.isCompleting
          ? "border-blue-200 shadow-lg"
          : result.isRemoving
            ? "translate-y-[-20px] scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
      }`}
    >
      <div className="p-6">
        {/* Complete Learning Button */}
        <button
          className={`absolute top-4 right-4 rounded-md px-3 py-1 text-sm font-medium transition-all duration-300 ${
            result.isCompleting
              ? "scale-105 bg-green-100 text-green-800"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
          }`}
          disabled={result.isCompleting || result.isRemoving}
          onClick={() => onComplete(result.id)}
        >
          {result.isCompleting ? "已完成 👍" : "學習完成"}
        </button>

        {/* Success Animation */}
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

        {/* Word Header */}
        <div className="mb-6 pr-20">
          <h3 className="mb-2 text-2xl font-semibold text-slate-800">{result.word}</h3>
          <p className="text-sm text-slate-500">{result.timestamp}</p>
        </div>

        {isError(result.response) ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                <span className="text-sm text-white">!</span>
              </div>
              <span className="text-red-800">{result.response.error}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transliteration Info */}
            {result.response.isTransliteration && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h4 className="mb-2 font-medium text-amber-800">音譯詞資訊</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">原始外文:</span> {result.response.originalForeignWord}
                  </p>
                  <p>
                    <span className="font-medium">來源語言:</span> {result.response.originLanguage}
                  </p>
                </div>
              </div>
            )}

            {/* Definitions */}
            <div>
              <h4 className="mb-3 font-semibold text-slate-800">詞彙定義</h4>
              <div className="space-y-3">
                {result.response.definitions.map((def, defIndex) => (
                  <div className="rounded-lg border border-slate-200 p-4" key={defIndex}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {def.partOfSpeech}
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-700">{def.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Character Analysis */}
            <div>
              <h4 className="mb-3 font-semibold text-slate-800">字源分析</h4>
              <div className="space-y-4">
                {result.response.characters.map((char, charIndex) => (
                  <div className="rounded-lg border border-slate-200 p-4" key={charIndex}>
                    <div className="mb-3 flex items-start gap-4">
                      <span className="mt-1 text-4xl font-bold text-blue-600">{char.char}</span>
                      <div className="flex-1">
                        <div className="mb-2 flex gap-3">
                          <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-700">
                            注音: {char.zhuyin}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-700">
                            拼音: {char.pinyin}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-800">字源學:</span>
                      <p className="mt-1 leading-relaxed text-slate-700">{char.etymology}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;
