const EmptyState: React.FC = () => {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <span className="text-2xl text-slate-400">📚</span>
      </div>
      <h3 className="mb-2 text-lg font-medium text-slate-700">開始您的詞彙探索之旅</h3>
      <p className="text-slate-500">在上方搜索框輸入中文詞彙，開始深入了解其含義與字源</p>
    </div>
  );
};

export default EmptyState;
