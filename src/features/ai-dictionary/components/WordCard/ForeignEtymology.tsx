import { cn } from "@/utils/cn";

interface ForeignEtymologyProps {
  className?: string;
  foreignEtymology?: null | string;
}

const ForeignEtymology: React.FC<ForeignEtymologyProps> = ({ className, foreignEtymology }) => {
  if (!foreignEtymology || typeof foreignEtymology !== "string" || !foreignEtymology.trim()) return null;
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}>
      <h5 className="mb-2 font-medium text-slate-800">外來語來源</h5>
      <div className="leading-relaxed whitespace-pre-line text-slate-700">{foreignEtymology}</div>
    </div>
  );
};

export default ForeignEtymology;
