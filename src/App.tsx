import React, { useState, useEffect } from 'react';
import { IndustryType } from './types';
import { SeoStructuredData } from './components/ui/SeoStructuredData';
import { Layout } from './components/layout/Layout';
import { HomePage } from './features/home/HomePage';
import { GrowthAuditModal } from './components/ui/GrowthAuditModal';
import { DesignSystemPage } from './features/design-system/DesignSystemPage';
import { useRouter } from './routes/router';
import { analytics } from './services/analytics';

export default function App() {
  const [activeIndustry, setActiveIndustry] = useState<IndustryType>('healthcare');
  const [auditModalOpen, setAuditModalOpen] = useState<boolean>(false);
  const { currentRoute, navigateTo } = useRouter();

  useEffect(() => {
    analytics.trackPageView(currentRoute === 'design-system' ? 'Design System (DS-01)' : 'Home');
  }, [currentRoute]);

  const handleSelectIndustry = (industry: IndustryType) => {
    setActiveIndustry(industry);
    analytics.trackIndustrySwitch(industry);
  };

  const handleOpenAuditModal = () => {
    analytics.trackCTAClick('Open Audit Modal', 'App Global');
    setAuditModalOpen(true);
  };

  const handleCloseAuditModal = () => {
    setAuditModalOpen(false);
  };

  if (currentRoute === 'design-system') {
    return (
      <>
        <SeoStructuredData />
        <DesignSystemPage onBackToHome={() => navigateTo('home')} />
      </>
    );
  }

  return (
    <>
      {/* SEO Schema injection */}
      <SeoStructuredData />

      {/* Global Layout */}
      <Layout
        activeIndustry={activeIndustry}
        onSelectIndustry={handleSelectIndustry}
        onOpenAuditModal={handleOpenAuditModal}
      >
        <HomePage
          activeIndustry={activeIndustry}
          onSelectIndustry={handleSelectIndustry}
          onOpenAuditModal={handleOpenAuditModal}
        />
      </Layout>

      {/* Design System Floating Quick Access Pill */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => navigateTo('design-system')}
          className="px-3.5 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-2xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          title="Open Design System (DS-01) Documentation"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>DS-01 Design System</span>
        </button>
      </div>

      {/* Confidential Growth Audit Modal */}
      <GrowthAuditModal
        isOpen={auditModalOpen}
        onClose={handleCloseAuditModal}
        initialIndustry={activeIndustry}
      />
    </>
  );
}


