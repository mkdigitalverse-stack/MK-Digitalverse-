import React from 'react';
import { IndustryType } from '../../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWhatsApp } from '../ui/FloatingWhatsApp';

interface LayoutProps {
  children: React.ReactNode;
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeIndustry,
  onSelectIndustry,
  onOpenAuditModal
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0A192F] font-sans selection:bg-[#C5A059] selection:text-white">
      <Header
        activeIndustry={activeIndustry}
        onSelectIndustry={onSelectIndustry}
        onOpenAuditModal={onOpenAuditModal}
      />
      <main id="main-content">
        {children}
      </main>
      <Footer
        onSelectIndustry={onSelectIndustry}
        onOpenAuditModal={onOpenAuditModal}
      />
      <FloatingWhatsApp />
    </div>
  );
};
