import React, { useState, useEffect } from 'react';
import { IndustryType } from './types';
import { SeoStructuredData } from './components/ui/SeoStructuredData';
import { Layout } from './components/layout/Layout';
import { HomePage } from './features/home/HomePage';
import { AboutPage } from './features/about/AboutPage';
import { GrowthAuditModal } from './components/ui/GrowthAuditModal';
import { DesignSystemPage } from './features/design-system/DesignSystemPage';
import { NotFoundPage } from './components/ui/NotFoundPage';
import { useRouter } from './routes/router';
import { analytics } from './services/analytics';

export default function App() {
  const [activeIndustry, setActiveIndustry] = useState<IndustryType>('healthcare');
  const [auditModalOpen, setAuditModalOpen] = useState<boolean>(false);
  const { currentRoute, navigateTo } = useRouter();

  useEffect(() => {
    const pageTitle = currentRoute === 'design-system' 
      ? 'Design System (DS-01)' 
      : currentRoute === 'about'
      ? 'About MK Digitalverse'
      : currentRoute === '404' 
      ? '404 Not Found' 
      : 'Home';
    analytics.trackPageView(pageTitle);
  }, [currentRoute]);

  const handleSelectIndustry = (industry: IndustryType) => {
    setActiveIndustry(industry);
    analytics.trackIndustrySwitch(industry);
  };

  const handleOpenAuditModal = () => {
    analytics.trackDiscoveryCallBooking('App Global');
    analytics.trackCTAClick('Open Audit Modal', 'App Global');
    setAuditModalOpen(true);
  };

  const handleCloseAuditModal = () => {
    setAuditModalOpen(false);
  };

  if (currentRoute === '404') {
    return (
      <>
        <SeoStructuredData />
        <NotFoundPage 
          onReturnHome={() => navigateTo('home')} 
          onOpenAuditModal={handleOpenAuditModal} 
        />
        <GrowthAuditModal
          isOpen={auditModalOpen}
          onClose={handleCloseAuditModal}
          initialIndustry={activeIndustry}
        />
      </>
    );
  }

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
        {currentRoute === 'about' ? (
          <AboutPage 
            onOpenAuditModal={handleOpenAuditModal} 
            onNavigateToSolutions={() => navigateTo('home', 'capabilities')}
          />
        ) : (
          <HomePage
            activeIndustry={activeIndustry}
            onSelectIndustry={handleSelectIndustry}
            onOpenAuditModal={handleOpenAuditModal}
          />
        )}
      </Layout>

      {/* Confidential Growth Audit Modal */}
      <GrowthAuditModal
        isOpen={auditModalOpen}
        onClose={handleCloseAuditModal}
        initialIndustry={activeIndustry}
      />
    </>
  );
}


