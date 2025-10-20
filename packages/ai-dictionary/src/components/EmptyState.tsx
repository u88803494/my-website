"use client";

import { Coffee } from "lucide-react";

interface EmptyStateProps {
  onOpenDonateModal: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onOpenDonateModal }) => {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <span className="text-2xl text-slate-400">📚</span>
      </div>
      <h3 className="mb-2 text-lg font-medium text-slate-700">開始您的詞彙探索之旅</h3>
      <p className="text-slate-500">在上方搜索框輸入中文詞彙，開始深入了解其含義與字源</p>

      {/* CTA 區塊 */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="mx-auto max-w-2xl font-medium text-slate-600">
          <strong>如果這個工具對您有所啟發，歡迎贊助我，支持它持續進化。</strong>
        </p>
        <button className="btn btn-primary flex items-center gap-2" onClick={onOpenDonateModal}>
          <Coffee className="h-5 w-5" />
          贊助我，請我喝杯咖啡
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
