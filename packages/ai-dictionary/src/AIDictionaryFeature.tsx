import AIDictionaryContent from "./components/AIDictionaryContent";
import AIDictionaryHeader from "./components/AIDictionaryHeader";

const AIDictionaryFeature: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AIDictionaryHeader />
      <AIDictionaryContent />
    </div>
  );
};

export default AIDictionaryFeature;
