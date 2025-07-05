import AboutHero from "./AboutHero";
import AnimatedBackground from "./AnimatedBackground";
import PhilosophySection from "./PhilosophySection";
import StorySection from "./StorySection";
import TechStackSection from "./TechStackSection";

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 動態背景 */}
      <AnimatedBackground />

      {/* 主要內容 */}
      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-12">
        <AboutHero />
        <main>
          <StorySection />
          <PhilosophySection />
          <TechStackSection />
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
