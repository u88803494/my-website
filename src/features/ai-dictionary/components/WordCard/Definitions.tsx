import { BookOpen } from "lucide-react";

import type { WordAnalysisResponse } from "@/types/dictionary.types";

interface DefinitionsProps {
  definitions: WordAnalysisResponse["definitions"];
}

const Definitions: React.FC<DefinitionsProps> = ({ definitions }) => (
  <div>
    <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
      {/* 書本 icon，lucide-react 取代原 SVG */}
      <span className="mr-1 inline-block align-middle" style={{ minWidth: 20 }}>
        <BookOpen size={18} strokeWidth={2} />
      </span>
      常見意思
    </h4>
    <div className="space-y-3">
      {definitions.map((def, defIndex) => (
        <div className="rounded-lg border border-slate-200 p-3 sm:p-4" key={defIndex}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">{def.partOfSpeech}</span>
          </div>
          <p className="mb-2 text-sm leading-relaxed break-words text-slate-700 sm:text-base">{def.meaning}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Definitions;
