const AIDictionaryHeader: React.FC = () => {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-3xl font-light text-slate-800">
            AI 智能中文字典
            <span className="ml-3 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">Beta</span>
          </h1>
          <p className="text-slate-600">運用人工智慧技術，讓中文詞彙含義與字源更容易理解</p>
        </div>
      </div>
    </div>
  );
};

export default AIDictionaryHeader;
