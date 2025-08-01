import React from "react";

export interface LoadingStateProps {
  className?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className = "", message = "載入中..." }) => {
  return (
    <div className={`loading-state ${className}`}>
      <div className="loading-spinner">
        <div className="spinner" />
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
