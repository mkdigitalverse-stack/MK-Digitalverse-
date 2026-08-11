import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Activity } from 'lucide-react';

interface CaseStudyProps {
  onOpenAuditModal: () => void;
}

export interface CaseStudyItem {
  id: string;
  category: string;
  headline: string;
  problem: string;
  growthIntervention: string[];
  outcome: {
    primaryMetric: string;
    description: string;
    verifiedFact: string;
  };
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'specialty-clinic-network',
    category: 'Specialty Healthcare Practice',
    headline: 'Scaling Specialist Patient Consultations & Eliminating Unqualified Enquiries',
    problem: 'The practice was spending heavily on generic ad campaigns that generated low-intent phone calls, while high-value clinical specialties suffered from high consultation drop-off rates and slow front-desk follow-ups.',
    growthIntervention: [
      'Deployed Precision Geo-Acquisition campaigns targeting specific treatment intent search terms.',
      'Implemented Clinical Trust Architecture with verified doctor authority profiles & treatment pathways.',
      'Integrated 24/7 AI enquiry qualification and instant WhatsApp booking workflows.'
    ],
    outcome: {
      primaryMetric: '3.8x ROI',
      description: 'Consultation conversion rate increased significantly while reducing cost-per-acquired-patient across high-value treatment lines.',
      verifiedFact: 'Illustrative System Benchmark'
    }
  },
  {
    id: 'multi-location-ivf-institute',
    category: 'IVF & Reproductive Medicine',
    headline: 'Building Patient Trust & Private Consultation Conversions for Fertility Care',
    problem: 'Prospective IVF couples experienced high friction and anxiety during digital research, leading to 80%+ drop-off on standard contact forms and missed after-hours enquiries.',
    growthIntervention: [
      'Designed an empathetic, high-trust conversion-focused website platform with sub-second page load times.',
      'Configured private 24/7 AI enquiry qualification assistants for sensitive patient enquiries.',
      'Built automated nurture workflows for instant consultation scheduling and pre-visit care guides.'
    ],
    outcome: {
      primaryMetric: '+185% Conversion',
      description: 'Achieved sub-60 second average response time to new patient enquiries and doubled verified clinic consultation holds.',
      verifiedFact: 'Illustrative System Benchmark'
    }
  },
  {
    id: 'dental-specialty-group',
    category: 'Multi-Location Dental Group',
    headline: 'High-Value Implant & Aligner Acquisition Across Regional Catchment Zones',
    problem: 'Word-of-mouth referrals were insufficient to fill clinical capacity across 4 locations, while local search visibility was dominated by competitor dental chains.',
    growthIntervention: [
      'Executed Local Catchment SEO and Google Maps pack dominance strategies across all clinic locations.',
      'Launched high-converting visual treatment case showcases for implants and aligners.',
      'Unified CRM lead management with automated WhatsApp reminder loops.'
    ],
    outcome: {
      primaryMetric: 'Dominant Visibility',
      description: 'Top-3 local search pack placement established across all catchment areas with continuous month-over-month patient pipeline growth.',
      verifiedFact: 'Illustrative System Benchmark'
    }
  }
];

export const CaseStudyProof: React.FC<CaseStudyProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="case-studies" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      
      {/* Ambient Grid Accent */}
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Proven Growth Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Strategic System Interventions <span className="gold-text-gradient">That Deliver Measurable Impact.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every case study is structured around the exact business problem solved, strategic growth interventions deployed, and verified operational outcomes achieved.
          </p>
        </div>

        {/* Case Studies Cards Grid */}
        <div className="space-y-8 mb-14">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Left Column: Problem & Strategic Headline */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  {cs.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug font-display">
                  {cs.headline}
                </h3>

                <div className="p-4 rounded-xl bg-[#050B18] border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Problem / Growth Bottleneck</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {cs.problem}
                  </p>
                </div>
              </div>

              {/* Center Column: Growth Interventions Deployed */}
              <div className="lg:col-span-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Strategic System Interventions Deployed:
                </h4>
                <div className="space-y-2.5">
                  {cs.growthIntervention.map((inv, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#050B18] border border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-200 leading-relaxed">{inv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Measurable Outcome Box */}
              <div className="lg:col-span-3 space-y-4">
                <div className="p-5 rounded-xl bg-[#050B18] border border-[#C5A059]/40 text-center space-y-2 shadow-inner text-white">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#D4AF37] block">System Benchmark Outcome</span>
                  <div className="text-3xl font-extrabold text-white font-display">
                    {cs.outcome.primaryMetric}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cs.outcome.description}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 font-mono text-center">
                  ✔ {cs.outcome.verifiedFact}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B172A] text-white border border-[#C5A059]/40 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Ready to Implement These Growth Systems in Your Healthcare Organization?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-normal">
            We review your current acquisition channels, brand positioning, and digital conversion infrastructure during a 30-minute executive call.
          </p>
          <button
            onClick={onOpenAuditModal}
            className="btn-gold-primary inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md"
          >
            <span>Book a Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-[#0A192F]" />
          </button>
        </div>

      </div>
    </section>
  );
};
