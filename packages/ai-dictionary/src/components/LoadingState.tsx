const LoadingState: React.FC = () => {
  return (
    <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-blue-800">正在分析詞彙，請稍候...</span>
      </div>
    </div>
  );
};

export default LoadingState;
