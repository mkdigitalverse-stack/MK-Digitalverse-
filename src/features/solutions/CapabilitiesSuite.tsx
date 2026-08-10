import React, { useState } from 'react';
import { CAPABILITIES } from '../../data/content';
import { CapabilityItem } from '../../types';
import { 
  Target, 
  Award, 
  Cpu, 
  Code2, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Workflow,
  TrendingUp,
  ChevronRight,
  BarChart3,
  HelpCircle
} from 'lucide-react';

interface CapabilitiesProps {
  onOpenAuditModal: () => void;
}

export const CapabilitiesSuite: React.FC<CapabilitiesProps> = ({ onOpenAuditModal }) => {
  const [selectedCap, setSelectedCap] = useState<CapabilityItem>(CAPABILITIES[0]);

  const getCapIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target': return <Target className="w-5 h-5 text-amber-400" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-amber-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="capabilities" className="py-20 md:py-28 bg-[#050505] relative border-b border-white/10 overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Strategic Guiding Philosophy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Integrated Growth Capabilities</span>
          </div>

          {/* Core Brand Philosophy Callout */}
          <blockquote className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-amber-400/20 text-amber-300 font-display font-bold text-lg sm:text-xl sm:leading-relaxed mb-6 max-w-2xl mx-auto shadow-2xl">
            "Every digital investment should contribute to measurable business growth."
          </blockquote>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            The Growth Capabilities Behind Every Successful Healthcare Organization
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
            We don't sell isolated, commoditized services. We deploy an integrated suite of growth capabilities—anchored by conversion-focused websites, AI business automation, and data-driven performance marketing—all supporting one objective: sustainable business growth.
          </p>
        </div>

        {/* Capability Value Pipeline / Roadmap Matrix */}
        <div className="mb-14">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">
              Capability Value Architecture — How Every Capability Compounds
            </span>
          </div>

          {/* Desktop Matrix Roadmap */}
          <div className="hidden lg:flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-white/10">
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-bold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Business Goal</span>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />

            {CAPABILITIES.map((cap, idx) => {
              const isActive = selectedCap.id === cap.id;
              return (
                <React.Fragment key={cap.id}>
                  <button
                    onClick={() => setSelectedCap(cap)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5 font-semibold'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase">{cap.pillarNumber}</span>
                    <span className="text-xs">{cap.title.split('&')[0].trim()}</span>
                  </button>

                  {idx < CAPABILITIES.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}

            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Business Growth</span>
            </div>

          </div>

          {/* Mobile / Tablet Responsive Matrix Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-2">
            {CAPABILITIES.map((cap) => {
              const isActive = selectedCap.id === cap.id;
              return (
                <button
                  key={cap.id}
                  onClick={() => setSelectedCap(cap)}
                  className={`p-3 rounded-xl text-left transition-all border flex items-center justify-between min-h-[48px] ${
                    isActive
                      ? 'bg-zinc-900 border-amber-400 text-white font-bold'
                      : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs">{cap.title.split('&')[0].trim()}</span>
                  <span className="text-[10px] font-mono text-amber-400">{cap.pillarNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capabilities Minimal & Spacious Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CAPABILITIES.map((cap) => {
            const isSelected = selectedCap.id === cap.id;
            return (
              <div
                key={cap.id}
                onClick={() => setSelectedCap(cap)}
                className={`glass-panel rounded-2xl p-6 sm:p-7 border transition-all cursor-pointer flex flex-col justify-between bg-[#09090b] relative group ${
                  isSelected 
                    ? 'border-amber-400/60 bg-zinc-900/90 shadow-2xl ring-1 ring-amber-400/30' 
                    : 'border-white/10 hover:border-white/20 hover:bg-zinc-900/50'
                }`}
              >
                <div>
                  {/* Top Bar: Pillar badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-white/10 font-mono text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                      Pillar {cap.pillarNumber}
                    </span>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 group-hover:border-white/20 transition-colors">
                      {getCapIcon(cap.icon)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                    {cap.title}
                  </h3>

                  {/* Business Purpose */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Business Purpose:
                    </span>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                      "{cap.purpose}"
                    </p>
                  </div>

                  {/* Framework Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
                    <ShieldCheck className="w-3 h-3" />
                    <span>IP: {cap.framework}</span>
                  </div>
                </div>

                {/* Primary Business Outcome */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Key Outcomes:
                  </span>
                  <div className="space-y-1.5">
                    {cap.outcomes.slice(0, 2).map((out, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Indicator Line */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 rounded-t-2xl"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Capability Specification Panel */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/15 shadow-2xl bg-[#09090b] relative overflow-hidden mb-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Capability Specification Details */}
            <div className="lg:col-span-8 space-y-6">
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono text-xs font-bold uppercase tracking-wider">
                    Pillar {selectedCap.pillarNumber} Specification
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                    Proprietary Framework: {selectedCap.framework}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  <span>{selectedCap.title}</span>
                </h3>
              </div>

              {/* Core Business Objective Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Core Business Purpose
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 font-semibold leading-relaxed">
                  "{selectedCap.purpose}"
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedCap.fullDesc}
              </p>

              {/* Strategic Outcomes List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Measurable Business Outcomes:</span>
                </h4>
                <div className="space-y-2">
                  {selectedCap.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-200 p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Modules Included */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  System Modules Included:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCap.features.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Visual Showcase Preview & Implementation Scope */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              
              {/* High-Resolution Capability Visual Preview Image */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
                <img
                  src={
                    selectedCap.pillarNumber === 1
                      ? "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                      : selectedCap.pillarNumber === 2
                      ? "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
                      : selectedCap.pillarNumber === 3
                      ? "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
                      : selectedCap.pillarNumber === 4
                      ? "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={selectedCap.title}
                  className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Pillar {selectedCap.pillarNumber} Live Interface
                  </div>
                  <div className="text-xs font-bold text-white">
                    {selectedCap.title} Visual Architecture
                  </div>
                </div>
              </div>

              {/* Implementation Scope Card */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 text-center space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
                    Capability Implementation Scope
                  </span>
                  <h4 className="text-base font-bold text-white">
                    Ready to deploy {selectedCap.title}?
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Custom-architected to integrate into your clinical EHR, hospital intake workflows, or practice CRM.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 text-left space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Deployment Specs:
                  </div>
                  <div className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
                    <span>Implementation Time:</span>
                    <span className="text-emerald-400">14-21 Days</span>
                  </div>
                  <div className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
                    <span>System Integration:</span>
                    <span className="text-amber-400">Turnkey / In-House</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-3.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Book Discovery Call</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-3 rounded-full bg-zinc-900 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 hover:text-white transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Growth Audit™</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Closing Action Banner */}
        <div className="text-center space-y-4">
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Looking to combine multiple business capabilities into a single unified growth system?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuditModal}
              className="px-8 py-4 rounded-xl bg-amber-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              <span>See How We Help Businesses Grow</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuditModal}
              className="px-8 py-4 rounded-xl bg-zinc-900 text-zinc-200 border border-white/10 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Request a Growth Audit™</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
