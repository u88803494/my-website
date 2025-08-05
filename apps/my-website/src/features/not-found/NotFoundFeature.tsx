"use client";

import { ContactSection, NotFoundHero, QuickNavigation, SearchSuggestion } from "./components";

const NotFoundFeature: React.FC = () => {
  return (
    <main className="from-primary/10 via-base-100 to-secondary/10 min-h-screen bg-gradient-to-br">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <NotFoundHero />
          <QuickNavigation />
          <SearchSuggestion />
          <ContactSection />
        </div>
      </div>
    </main>
  );
};

export default NotFoundFeature;
