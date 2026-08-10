import React, { useState } from 'react';
import { IndustryType } from '../../types';
import { Hero } from './Hero';
import { TrustedPartnershipsSection } from './TrustedPartnershipsSection';
import { DifferentiationMatrix } from './DifferentiationMatrix';
import { IndustrySolutions } from '../solutions/IndustrySolutions';
import { GrowthFramework } from '../frameworks/GrowthFramework';
import { CapabilitiesSuite } from '../solutions/CapabilitiesSuite';
import { HealthcareVisualShowcaseSection } from './HealthcareVisualShowcaseSection';
import { RoiCalculator } from '../calculator/RoiCalculator';
import { CaseStudyProof } from './CaseStudyProof';
import { HealthcareReadinessAssessment } from './HealthcareReadinessAssessment';
import { HealthcareDecisionJourney } from './HealthcareDecisionJourney';
import { RightFitEvaluation } from './RightFitEvaluation';
import { TechnicalExcellenceSection } from './TechnicalExcellenceSection';
import { DesignSystemV2Section } from './DesignSystemV2Section';
import { MasterDesignSystemPhasesSection } from './MasterDesignSystemPhasesSection';
import { TwelveMandatesGlobalSection } from './TwelveMandatesGlobalSection';
import { FaqSection } from './FaqSection';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface HomePageProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeIndustry,
  onSelectIndustry,
  onOpenAuditModal
}) => {
  const [showGuidelinesBlueprint, setShowGuidelinesBlueprint] = useState<boolean>(false);

  return (
    <>
      {/* 1. Hero Section */}
      <Hero
        activeIndustry={activeIndustry}
        onSelectIndustry={onSelectIndustry}
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 2. Trusted Partnerships & Social Proof */}
      <TrustedPartnershipsSection
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 3. Industry Solutions */}
      <IndustrySolutions
        activeIndustry={activeIndustry}
        onSelectIndustry={onSelectIndustry}
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 3. Core Growth Framework */}
      <GrowthFramework
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 4. Natural Healthcare Visual Tour & Interactive Feature Showcase */}
      <HealthcareVisualShowcaseSection
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 5. Full Capabilities Suite */}
      <CapabilitiesSuite
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 6. Differentiation Matrix */}
      <DifferentiationMatrix
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 7. Healthcare Decision Journey */}
      <HealthcareDecisionJourney
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 8. Multi-Layer Case Study & Proof */}
      <CaseStudyProof
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 9. Interactive ROI Calculator */}
      <RoiCalculator
        initialIndustry={activeIndustry}
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 10. Healthcare Growth Readiness Assessment */}
      <HealthcareReadinessAssessment
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 11. Right-Fit Evaluation */}
      <RightFitEvaluation
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 12. Technical Excellence & Sub-Second Web Engine */}
      <TechnicalExcellenceSection
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 13. Optional Expandable Design System Blueprint (For Developer / Brand Audit Reference) */}
      <section className="py-12 bg-slate-950 border-t border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowGuidelinesBlueprint(!showGuidelinesBlueprint)}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{showGuidelinesBlueprint ? 'Hide Master Design System Guidelines' : 'View Master Brand Design System Guidelines (DES-02 / Mandates)'}</span>
            {showGuidelinesBlueprint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showGuidelinesBlueprint && (
            <div className="mt-8 space-y-12 text-left animate-fadeIn">
              <DesignSystemV2Section onOpenAuditModal={onOpenAuditModal} />
              <MasterDesignSystemPhasesSection onOpenAuditModal={onOpenAuditModal} />
              <TwelveMandatesGlobalSection onOpenAuditModal={onOpenAuditModal} />
            </div>
          )}
        </div>
      </section>

      {/* 14. Frequently Asked Questions */}
      <FaqSection
        onOpenAuditModal={onOpenAuditModal}
      />
    </>
  );
};

