import React, { useState } from 'react';
import { IndustryType } from './types';
import { SeoStructuredData } from './components/SeoStructuredData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DifferentiationMatrix } from './components/DifferentiationMatrix';
import { IndustrySolutions } from './components/IndustrySolutions';
import { GrowthFramework } from './components/GrowthFramework';
import { CapabilitiesSuite } from './components/CapabilitiesSuite';
import { RoiCalculator } from './components/RoiCalculator';
import { CaseStudyProof } from './components/CaseStudyProof';
import { FaqSection } from './components/FaqSection';
import { GrowthAuditModal } from './components/GrowthAuditModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeIndustry, setActiveIndustry] = useState<IndustryType>('healthcare');
  const [auditModalOpen, setAuditModalOpen] = useState<boolean>(false);

  const handleOpenAuditModal = () => {
    setAuditModalOpen(true);
  };

  const handleCloseAuditModal = () => {
    setAuditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* SEO Schema injection */}
      <SeoStructuredData />

      {/* Global Header */}
      <Header
        activeIndustry={activeIndustry}
        onSelectIndustry={setActiveIndustry}
        onOpenAuditModal={handleOpenAuditModal}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          activeIndustry={activeIndustry}
          onSelectIndustry={setActiveIndustry}
          onOpenAuditModal={handleOpenAuditModal}
        />

        {/* Traditional Agency vs MK Digitalverse Partner Matrix */}
        <DifferentiationMatrix onOpenAuditModal={handleOpenAuditModal} />

        {/* Tailored Industry Growth Systems (Healthcare & Luxury Venues) */}
        <IndustrySolutions
          activeIndustry={activeIndustry}
          onSelectIndustry={setActiveIndustry}
          onOpenAuditModal={handleOpenAuditModal}
        />

        {/* The 5-Phase Growth System Framework */}
        <GrowthFramework onOpenAuditModal={handleOpenAuditModal} />

        {/* Capabilities Suite */}
        <CapabilitiesSuite onOpenAuditModal={handleOpenAuditModal} />

        {/* Interactive Financial & Growth Calculator */}
        <RoiCalculator
          initialIndustry={activeIndustry}
          onOpenAuditModal={handleOpenAuditModal}
        />

        {/* Case Studies & Impact Proof */}
        <CaseStudyProof onOpenAuditModal={handleOpenAuditModal} />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectIndustry={setActiveIndustry}
        onOpenAuditModal={handleOpenAuditModal}
      />

      {/* Confidential Growth Audit Modal */}
      <GrowthAuditModal
        isOpen={auditModalOpen}
        onClose={handleCloseAuditModal}
        initialIndustry={activeIndustry}
      />
    </div>
  );
}
