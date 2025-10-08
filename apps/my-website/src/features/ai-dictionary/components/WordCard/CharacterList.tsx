import type { EtymologyBlock } from "@packages/shared/types";
import { cn } from "@packages/shared/utils/cn";

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
          <div className="rounded-lg border border-slate-200 p-3 sm:p-4" key={block.char}>
            <div className="mb-3 flex flex-row items-center gap-2 sm:gap-4">
              <span className="mt-1 text-3xl font-bold text-blue-600 sm:text-4xl">{block.char}</span>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap gap-2 sm:gap-3">
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 sm:text-sm">
                    注音: {block.zhuyin}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 sm:text-sm">
                    拼音: {block.pinyin}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <p className="mt-1 text-sm leading-relaxed break-words text-slate-700 sm:text-base">{block.etymology}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterList;
