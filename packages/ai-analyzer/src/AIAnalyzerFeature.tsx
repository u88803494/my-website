"use client";

import { useState } from "react";

import AnalysisResult from "./components/AnalysisResult";
import NeedInput from "./components/NeedInput";
import UsageTips from "./components/UsageTips";
import { PLACEHOLDER_TEXT, USAGE_TIPS } from "./constants";
import { useAIAnalysis } from "./hooks/useAIAnalysis";

const AIAnalyzerFeature: React.FC = () => {
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

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* 標題區域 */}
      <div className="space-y-4 text-center">
        <h1 className="text-base-content text-4xl font-bold">AI 需求分析器</h1>
        <p className="text-base-content/70 mx-auto max-w-2xl text-xl">
          協助深度思考，釐清需求，學會如何給 AI 更好的提示詞
        </p>
      </div>

      {/* 使用提示 */}
      <UsageTips tips={USAGE_TIPS} />

      {/* 需求輸入 */}
      <div className="space-y-4">
        <h2 className="text-base-content text-center text-2xl font-semibold">描述您的想法或需求</h2>
        <NeedInput
          isLoading={isLoading}
          onChange={setNeedInput}
          onSubmit={handleSubmit}
          placeholder={PLACEHOLDER_TEXT}
          value={needInput}
        />
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="alert alert-error mx-auto max-w-2xl">
          <span>{error}</span>
        </div>
      )}

      {/* 分析結果 */}
      <AnalysisResult isCopying={isCopying} onChange={setAnalysisResult} onCopy={handleCopy} value={analysisResult} />
    </div>
  );
};

export default AIAnalyzerFeature;
