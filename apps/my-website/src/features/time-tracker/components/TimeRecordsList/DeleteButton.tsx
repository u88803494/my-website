"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface DeleteButtonProps {
  isDeleting: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  onDelete: () => void;
  showConfirm: boolean;
}

/**
 * 刪除按鈕元件
 */
const DeleteButton: React.FC<DeleteButtonProps> = ({
  isDeleting,
  itemName,
  onCancel,
  onConfirm,
  onDelete,
  showConfirm,
}) => {
  const t = useTranslations("TimeTracker");

  if (!showConfirm) {
    return (
      <button
        aria-label={t("delete.deleteRecord", { itemName })}
        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
        disabled={isDeleting}
        onClick={onDelete}
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex gap-1">
      <button className="btn btn-ghost btn-xs" disabled={isDeleting} onClick={onCancel}>
        {t("delete.cancel")}
      </button>
      <button
        className={`btn btn-error btn-xs ${isDeleting ? "loading" : ""}`}
        disabled={isDeleting}
        onClick={onConfirm}
      >
        {!isDeleting && <Trash2 aria-hidden="true" className="h-3 w-3" />}
        {isDeleting ? t("delete.deleting") : t("delete.confirm")}
      </button>
    </div>
  );
};

export default DeleteButton;
