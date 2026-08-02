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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-cyan-500/0 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Positioning Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Digital Growth Partner
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-medium text-amber-400">
              Not A Digital Marketing Agency
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl">
            Predictable Revenue & Acquisition Engines for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400">
              Healthcare
            </span>{' '}
            &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Luxury Wedding Venues
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
            We replace fragmented marketing tactics with integrated digital growth systems.
            Combining strategic brand positioning, enterprise web platforms, AI pre-qualification, and high-intent acquisition.
          </p>

          {/* Dual Sector Focus Bar */}
          <div className="mt-8 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md inline-flex items-center gap-2 max-w-xl w-full sm:w-auto">
            <button
              onClick={() => onSelectIndustry('healthcare')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeIndustry === 'healthcare'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Healthcare Growth System</span>
            </button>

            <button
              onClick={() => onSelectIndustry('wedding_venues')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeIndustry === 'wedding_venues'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Palmtree className="w-4 h-4" />
              <span>Luxury Venues Engine</span>
            </button>
          </div>

          {/* Primary CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenAuditModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Strategic Growth Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#roi-calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-panel text-slate-200 font-semibold text-sm hover:bg-slate-800/80 transition-all border border-slate-700/80"
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Calculate Projected ROI</span>
            </a>
          </div>

          {/* Dynamic Industry Highlight Box */}
          <div className="mt-12 w-full max-w-4xl glass-panel rounded-2xl p-6 sm:p-8 text-left border border-slate-800/90 shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>Targeted Industry Growth Engine</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {currentIndustryData.title}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  {currentIndustryData.description}
                </p>
              </div>

              <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 shrink-0">
                <div className="text-[11px] font-semibold uppercase text-slate-400">Target Segment</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {currentIndustryData.targetAudience.slice(0, 3).join(' • ')}
                </div>
              </div>
            </div>

            {/* Micro Pillars Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {currentIndustryData.growthPillars.map((pillar, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {pillar.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-16 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                $18M+
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">
                Client Revenue Generated
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
                4.2x
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">
                Average Revenue ROI
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
                120K+
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">
                Qualified Inquiries Routed
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                99.8%
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">
                Client System Uptime
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
