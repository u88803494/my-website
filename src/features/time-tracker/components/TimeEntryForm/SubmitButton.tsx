import { Plus } from "lucide-react";
import React from "react";

interface SubmitButtonProps {
  isLoading?: boolean;
}

/**
 * 提交按鈕元件
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading = false }) => {
  return (
    <div className="form-control">
      <button className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading} type="submit">
        {!isLoading && <Plus aria-hidden="true" className="mr-2 h-4 w-4" />}
        {isLoading ? "新增中..." : "新增記錄"}
      </button>
    </div>
  );
};

export default SubmitButton;
