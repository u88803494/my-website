import type { EtymologyBlock } from "@/types/dictionary.types";
import { cn } from "@/utils/cn";

interface CharacterListProps {
  characters?: EtymologyBlock[];
  className?: string;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, className }) => {
  if (!characters || characters.length === 0) return null;
  return (
    <div className={cn(className)}>
      {characters.map((block) => {
        if (block.type !== "character") return null;
        return (
          <div className="rounded-lg border border-slate-200 p-4" key={block.char}>
            <div className="mb-3 flex items-start gap-4">
              <span className="mt-1 text-4xl font-bold text-blue-600">{block.char}</span>
              <div className="flex-1">
                <div className="mb-2 flex gap-3">
                  <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-700">注音: {block.zhuyin}</span>
                  <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-700">拼音: {block.pinyin}</span>
                </div>
              </div>
            </div>
            <div>
              <span className="font-medium text-slate-800">字源學:</span>
              <p className="mt-1 leading-relaxed text-slate-700">{block.etymology}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterList;
