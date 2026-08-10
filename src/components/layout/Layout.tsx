import React from 'react';
import { IndustryType } from '../../types';
import { Header } from './Header';
import { Footer } from './Footer';

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
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-amber-400 selection:text-black">
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
    </div>
  );
};
