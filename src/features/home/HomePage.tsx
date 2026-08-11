import React from 'react';
import { IndustryType } from '../../types';
import { Hero } from './Hero';
import { HealthcareProblemSection } from './HealthcareProblemSection';
import { GrowthFramework } from '../frameworks/GrowthFramework';
import { CredentialsSection } from './CredentialsSection';
import { IndustrySolutions } from '../solutions/IndustrySolutions';
import { CapabilitiesSuite } from '../solutions/CapabilitiesSuite';
import { CaseStudyProof } from './CaseStudyProof';
import { ClientProofHub } from './ClientProofHub';
import { DifferentiationMatrix } from './DifferentiationMatrix';
import { RightFitEvaluation } from './RightFitEvaluation';
import { HealthcareReadinessAssessment } from './HealthcareReadinessAssessment';
import { RoiCalculator } from '../calculator/RoiCalculator';
import { FaqSection } from './FaqSection';

interface HomePageProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeIndustry,
  onOpenAuditModal
}) => {
  return (
    <>
      {/* 01 — HERO */}
      <Hero
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 02 — HEALTHCARE GROWTH CHALLENGE */}
      <HealthcareProblemSection
        onOpenAuditModal={onOpenAuditModal}
      />

      {/* 03 — HEALTHCARE GROWTH SYSTEM™ */}
      <div id="growth-system">
        <GrowthFramework
          onOpenAuditModal={onOpenAuditModal}
        />
      </div>

      {/* 04 — EXECUTIVE CREDENTIALS / NUMBERS */}
      <div id="credentials">
        <CredentialsSection
          onOpenAuditModal={onOpenAuditModal}
        />
      </div>

      {/* 05 — SOLUTIONS */}
      <div id="capabilities">
        <IndustrySolutions
          onOpenAuditModal={onOpenAuditModal}
        />
        <CapabilitiesSuite
          onOpenAuditModal={onOpenAuditModal}
        />
      </div>

      {/* 06 — PROOF / EVIDENCE */}
      <div id="proof-evidence">
        <CaseStudyProof
          onOpenAuditModal={onOpenAuditModal}
        />
        <ClientProofHub
          onOpenAuditModal={onOpenAuditModal}
        />
      </div>

      {/* 07 — RIGHT-FIT PARTNERSHIP */}
      <div id="right-fit">
        <DifferentiationMatrix
          onOpenAuditModal={onOpenAuditModal}
        />
        <RightFitEvaluation
          onOpenAuditModal={onOpenAuditModal}
        />
      </div>

      {/* 08 — HEALTHCARE GROWTH AUDIT™ */}
      <div id="readiness-assessment">
        <HealthcareReadinessAssessment
          onOpenAuditModal={onOpenAuditModal}
        />
        <div id="roi-calculator">
          <RoiCalculator
            initialIndustry={activeIndustry}
            onOpenAuditModal={onOpenAuditModal}
          />
        </div>
      </div>

      {/* 09 — FAQ */}
      <div id="faq">
        <FaqSection
          onOpenAuditModal={onOpenAuditModal}
        />
      </div>
    </>
  );
};
