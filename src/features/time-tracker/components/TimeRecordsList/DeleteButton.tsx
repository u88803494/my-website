import { Trash2 } from "lucide-react";
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
  if (!showConfirm) {
    return (
      <button
        aria-label={`刪除 ${itemName} 記錄`}
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
        取消
      </button>
      <button
        className={`btn btn-error btn-xs ${isDeleting ? "loading" : ""}`}
        disabled={isDeleting}
        onClick={onConfirm}
      >
        {!isDeleting && <Trash2 aria-hidden="true" className="h-3 w-3" />}
        {isDeleting ? "刪除中..." : "確認"}
      </button>
    </div>
  );
};

export default DeleteButton;
