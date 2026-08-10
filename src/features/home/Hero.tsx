import React from 'react';
import { IndustryType } from '../../types';
import { INDUSTRY_DATA } from '../../data/content';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HeartPulse, 
  Palmtree,
  CheckCircle2,
  Cpu,
  TrendingUp,
  Award,
  Search,
  Layout,
  Target,
  Bot,
  Workflow
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
  const isHealthcare = activeIndustry === 'healthcare';

  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#050505] border-b border-white/10">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Positioning Badge */}
        <div className="flex flex-col items-start mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/10 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
              Strategic Digital Growth Partner
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-amber-400">
              Not A Traditional Marketing Agency
            </span>
          </div>
        </div>

        {/* Two-Column Desktop Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          
          {/* Left Column: Headline, Outcomes & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Primary H1 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
              Helping Healthcare Organizations Achieve{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                Measurable Business Growth
              </span>
            </h1>

            {/* Outcome-Led Subheadline */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl font-normal">
              We replace fragmented marketing tactics with proprietary, audit-driven growth systems engineered specifically for hospitals, multi-specialty clinics, IVF centres, dental practices, diagnostic labs, cosmetic clinics, and wellness centres to generate more qualified patient enquiries, increase appointment conversion, and build lasting clinical authority.
            </p>

            {/* Core Outcome Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>More Qualified Patient Enquiries</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 AI Patient Pre-Qualification & Triage</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conversion-Focused Websites ⭐</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Predictable Patient Acquisition & LTV</span>
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenAuditModal}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Book Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAuditModal}
                className="px-8 py-4 rounded-xl bg-zinc-900 text-zinc-100 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>
                  Request Healthcare Growth Audit™
                </span>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Growth System Visual Illustration */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 border border-white/15 bg-[#09090b]/90 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    The Growth System Methodology
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Proprietary IP
                </span>
              </div>

              {/* Sequential Business Operating System Flow */}
              <div className="space-y-2.5 relative">
                
                <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 hover:border-amber-400/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Growth Audit™</span>
                      <span className="text-[10px] text-amber-400 font-mono">Diagnose Leaks</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">Forensic analysis of intake friction & ad spend waste</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 hover:border-amber-400/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Growth Strategy</span>
                      <span className="text-[10px] text-amber-400 font-mono">Align Economics</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">LTV forecasting & unit economics architecture</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 hover:border-emerald-400/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Brand Positioning</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Build Authority</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">Clinical & luxury prestige that eliminates price resistance</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 hover:border-cyan-400/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    04
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>AI Triage Systems</span>
                      <span className="text-[10px] text-cyan-400 font-mono">24/7 Qualification</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">Instant qualification & automated WhatsApp lead routing</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 hover:border-amber-400/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    05
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Next.js Web Engine</span>
                      <span className="text-[10px] text-amber-400 font-mono">High Conversion</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">Sub-second load speeds & frictionless booking UI</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-zinc-950 to-amber-950/40 border border-amber-400/30 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center font-mono text-xs font-extrabold shrink-0">
                    06
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span>Measurable Business Growth</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Predictable ROI</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 truncate font-medium">Continuous optimization & market share scale</p>
                  </div>
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-zinc-400 text-center font-mono uppercase tracking-wider">
                Integrated Business Operating System
              </div>

            </div>
          </div>

        </div>

        {/* Proprietary IP Trust Strip Banner Above Fold */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">
              Proprietary Business Intellectual Property Frameworks:
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-xs font-bold text-white font-mono">
                Healthcare Growth System™
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">End-to-end patient engine</div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-xs font-bold text-white font-mono">
                Clinical Trust Architecture™
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Doctor authority & patient trust</div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-xs font-bold text-white font-mono">
                Healthcare Growth Audit™
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Intake leak & unit diagnostic</div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-xs font-bold text-white font-mono">
                Healthcare Growth Index™
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">HGI™ executive dashboard</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
