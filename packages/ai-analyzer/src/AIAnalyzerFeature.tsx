"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import AnalysisResult from "./components/AnalysisResult";
import NeedInput from "./components/NeedInput";
import UsageTips from "./components/UsageTips";
import { useAIAnalysis } from "./hooks/useAIAnalysis";

const AIAnalyzerFeature: React.FC = () => {
  const t = useTranslations("AIAnalyzer");
  const { analysisResult, analyzeNeed, copyToClipboard, error, isLoading, needInput, setAnalysisResult, setNeedInput } =
    useAIAnalysis();

  const [isCopying, setIsCopying] = useState(false);

  const handleSubmit = () => {
    analyzeNeed();
  };

  const handleCopy = async () => {
    setIsCopying(true);
    await copyToClipboard();
    setIsCopying(false);
  };

  // Build tips array from translations
  const tips = [t("tips.tip1"), t("tips.tip2"), t("tips.tip3"), t("tips.tip4"), t("tips.tip5")];

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-base-content text-4xl font-bold">{t("title")}</h1>
        <p className="text-base-content/70 mx-auto max-w-2xl text-xl">{t("subtitle")}</p>
      </div>

      {/* Usage Tips */}
      <UsageTips tips={tips} />

      {/* Need Input */}
      <div className="space-y-4">
        <h2 className="text-base-content text-center text-2xl font-semibold">{t("inputSection")}</h2>
        <NeedInput isLoading={isLoading} onChange={setNeedInput} onSubmit={handleSubmit} value={needInput} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mx-auto max-w-2xl">
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result */}
      <AnalysisResult isCopying={isCopying} onChange={setAnalysisResult} onCopy={handleCopy} value={analysisResult} />
    </div>
  );
};

export default AIAnalyzerFeature;
