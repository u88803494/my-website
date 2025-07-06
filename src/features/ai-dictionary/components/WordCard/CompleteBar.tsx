interface CompleteBarProps {
  id: string;
  onUndo: (cardId: string) => void;
  word: string;
}

const CompleteBar: React.FC<CompleteBarProps> = ({ id, onUndo, word }) => (
  <div className="rounded-lg border border-green-200 bg-green-50 p-4 transition-all duration-500 ease-in-out">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
          <span className="text-sm text-white">✓</span>
        </div>
        <span className="font-medium text-green-800">已完成學習「{word}」</span>
      </div>
      <button
        className="px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:text-green-900"
        onClick={() => onUndo(id)}
      >
        撤銷
      </button>
    </div>
  </div>
);

export default CompleteBar;
