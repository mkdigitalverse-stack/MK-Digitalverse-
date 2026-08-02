import React from 'react';
import { IndustryType } from '../types';
import { INDUSTRY_DATA } from '../data/content';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  HeartPulse, 
  Palmtree,
  CheckCircle2,
  BarChart3,
  Cpu
} from 'lucide-react';

interface HeroProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  activeIndustry,
  onSelectIndustry,
  onOpenAuditModal
}) => {
  const currentIndustryData = INDUSTRY_DATA[activeIndustry];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern bg-[#050505]">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/5 via-emerald-500/5 to-cyan-500/0 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Positioning Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Strategic Digital Growth Partner
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-amber-400">
              Not A Digital Marketing Agency
            </span>
          </div>

          {/* Main Headline - Communicating Who + Outcome + Differentiation in 5 seconds */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl">
            Predictable Patient & Venue Revenue Engines for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              Healthcare
            </span>{' '}
            &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Luxury Venues
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed font-normal">
            We replace fragmented marketing tactics with proprietary, audit-driven growth systems.
            Integrating brand authority, enterprise web platforms, AI pre-qualification, and high-intent acquisition in India.
          </p>

          {/* Dual Sector Focus Bar */}
          <div className="mt-8 p-1.5 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-md inline-flex items-center gap-2 max-w-xl w-full sm:w-auto">
            <button
              onClick={() => onSelectIndustry('healthcare')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeIndustry === 'healthcare'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Healthcare Growth System™</span>
            </button>

            <button
              onClick={() => onSelectIndustry('wedding_venues')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeIndustry === 'wedding_venues'
                  ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palmtree className="w-4 h-4" />
              <span>Venue Growth System™</span>
            </button>
          </div>

          {/* Primary CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-panel text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-all border border-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Request Healthcare Growth Audit™</span>
            </button>
          </div>

          {/* Dynamic Industry Highlight Box */}
          <div className="mt-12 w-full max-w-4xl glass-panel rounded-2xl p-6 sm:p-8 text-left border border-white/10 shadow-2xl relative bg-[#09090b]/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>
                    {activeIndustry === 'healthcare' ? 'Healthcare Growth System™' : 'Venue Growth System™'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {currentIndustryData.title}
                </h3>
                <p className="text-sm text-zinc-300 mt-1">
                  {currentIndustryData.description}
                </p>
              </div>

              <div className="bg-zinc-900/90 px-4 py-3 rounded-xl border border-white/10 shrink-0">
                <div className="text-[11px] font-semibold uppercase text-zinc-400">Target Segment</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {currentIndustryData.targetAudience.slice(0, 3).join(' • ')}
                </div>
              </div>
            </div>

            {/* Micro Pillars Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {currentIndustryData.growthPillars.map((pillar, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {pillar.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-16 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                ₹150Cr+
              </div>
              <div className="text-xs font-medium text-zinc-400 mt-1">
                Client Revenue Generated
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
                4.2x
              </div>
              <div className="text-xs font-medium text-zinc-400 mt-1">
                Average Revenue ROI
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
                120K+
              </div>
              <div className="text-xs font-medium text-zinc-400 mt-1">
                Qualified Inquiries Processed
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                99.8%
              </div>
              <div className="text-xs font-medium text-zinc-400 mt-1">
                System SLA Uptime
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
