"use client";

import { Coffee } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  onOpenDonateModal: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onOpenDonateModal }) => {
  const t = useTranslations("AIDictionary");

  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <span className="text-2xl text-slate-400">📚</span>
      </div>
      <h3 className="mb-2 text-lg font-medium text-slate-700">{t("emptyState.title")}</h3>
      <p className="text-slate-500">{t("emptyState.description")}</p>

      {/* CTA 區塊 */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="mx-auto max-w-2xl font-medium text-slate-600">
          <strong>{t("emptyState.donatePrompt")}</strong>
        </p>
        <button className="btn btn-primary flex items-center gap-2" onClick={onOpenDonateModal}>
          <Coffee className="h-5 w-5" />
          {t("emptyState.donateButton")}
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
