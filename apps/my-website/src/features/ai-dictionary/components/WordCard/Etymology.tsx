import { PenLine } from "lucide-react";

import type { EtymologyBlock } from "@/types/dictionary.types";
import { cn } from "@/utils/cn";

import CharacterCard from "./CharacterList"; // 直接用原 CharacterList 單卡片
import ForeignEtymology from "./ForeignEtymology";

interface EtymologyProps {
  etymologyBlocks: EtymologyBlock[];
}

const Etymology: React.FC<EtymologyProps> = ({ etymologyBlocks }) => (
  <div>
    <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
      <span className="mr-1 inline-block align-middle" style={{ minWidth: 20 }}>
        <PenLine size={18} strokeWidth={2} />
      </span>
      字源分析
    </h4>
    {etymologyBlocks.map((block, idx) =>
      block.type === "foreign" ? (
        <ForeignEtymology className={cn(idx !== 0 && "mt-4")} foreignEtymology={block.value} key={`foreign-${idx}`} />
      ) : (
        <CharacterCard characters={[block]} className={cn(idx !== 0 && "mt-4")} key={`char-${block.char}-${idx}`} />
      ),
    )}
  </div>
);

export default Etymology;
