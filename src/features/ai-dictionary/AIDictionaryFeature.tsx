import ScrollToTopButton from "@/components/shared/ScrollToTopButton";

import AIDictionaryContent from "./components/AIDictionaryContent";
import AIDictionaryHeader from "./components/AIDictionaryHeader";

const AIDictionaryFeature: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AIDictionaryHeader />
      <AIDictionaryContent />
      <ScrollToTopButton />
    </div>
  );
};

export default AIDictionaryFeature;
