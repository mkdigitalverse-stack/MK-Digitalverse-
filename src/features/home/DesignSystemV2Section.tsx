import React, { useState } from 'react';
import { DESIGN_SYSTEM_V2_DES02 } from '../../theme/designTokens';
import { Sparkles, Layers, ArrowRight, ShieldCheck, Check, X, Play, Cpu, TrendingUp, Zap, ChevronRight } from 'lucide-react';

interface DesignSystemV2Props {
  onOpenAuditModal: () => void;
}

export const DesignSystemV2Section: React.FC<DesignSystemV2Props> = ({ onOpenAuditModal }) => {
  const [activeLayout, setActiveLayout] = useState<string>('Layout A');
  const [activeDiagram, setActiveDiagram] = useState<number>(0);
  const [isHoveredButton, setIsHoveredButton] = useState<boolean>(false);

  return (
    <section id="design-system-v2" className="py-20 md:py-28 bg-[#FAF8F3] text-slate-900 relative overflow-hidden border-t border-amber-900/10">
      
      {/* 🌟 14. The MK Digitalverse Flowing Gold Ribbon Signature SVG Motif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M-100,100 C300,300 600,-50 1000,200 C1300,350 1500,100 1600,250"
            stroke="url(#goldRibbonGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <path
            d="M-100,130 C300,330 600,-20 1000,230 C1300,380 1500,130 1600,280"
            stroke="url(#goldRibbonGlow)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E6C687" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="goldRibbonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5D061" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
              <stop offset="100%" stopColor="#F5D061" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>DES-02 | MK Digitalverse Design System v2.0</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Design is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">Business Growth Tool</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold">
            "{DESIGN_SYSTEM_V2_DES02.coreMotto}"
          </p>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-md inline-block text-xs font-mono font-bold text-slate-800">
            Visual Personality Blueprint: <span className="text-amber-700">{DESIGN_SYSTEM_V2_DES02.visualPersonality}</span>
          </div>
        </div>

        {/* Brand Feeling Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
          {/* What Visitors SHOULD Feel */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>01. What Visitors Immediately Feel (✓)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DESIGN_SYSTEM_V2_DES02.brandFeelings.yes.map((feeling, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-slate-800 border border-amber-400/30 text-amber-200 text-xs font-semibold shadow-sm">
                  ✓ {feeling}
                </span>
              ))}
            </div>
          </div>

          {/* What We STRICTLY Avoid */}
          <div className="p-6 rounded-3xl bg-white text-slate-900 border border-rose-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase font-mono">
              <X className="w-4 h-4 text-rose-500" />
              <span>Strictly Avoided Positioning (❌)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DESIGN_SYSTEM_V2_DES02.brandFeelings.no.map((item, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ❌ Not {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 08. Section Formula & Magazine Rhythm (Interactive Layout Switcher) */}
        <div className="mb-16 max-w-5xl mx-auto p-8 rounded-3xl bg-white border border-amber-200 shadow-2xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-100">
            <div>
              <div className="text-xs font-mono text-amber-800 uppercase font-bold tracking-widest">08. Section Layout Formula</div>
              <h3 className="text-xl font-bold text-slate-900">Magazine Spread Rhythm Engine</h3>
            </div>
            <div className="text-xs font-mono text-slate-500">6 Alternating Layout Archetypes</div>
          </div>

          {/* Layout Buttons */}
          <div className="flex flex-wrap gap-2">
            {DESIGN_SYSTEM_V2_DES02.sectionFormulas.map((sf) => (
              <button
                key={sf.layout}
                onClick={() => setActiveLayout(sf.layout)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeLayout === sf.layout
                    ? 'bg-slate-900 text-amber-300 shadow-lg scale-105 border border-amber-500/30'
                    : 'bg-amber-50/80 text-slate-700 hover:bg-amber-100 border border-amber-200/60'
                }`}
              >
                {sf.layout}: {sf.name}
              </button>
            ))}
          </div>

          {/* Active Layout Blueprint Preview */}
          {(() => {
            const currentFormula = DESIGN_SYSTEM_V2_DES02.sectionFormulas.find(f => f.layout === activeLayout);
            return (
              <div className="p-6 rounded-2xl bg-slate-950 text-white border border-amber-500/30 space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                  <span>LAYOUT ARCHETYPE: {currentFormula?.layout}</span>
                  <span>{currentFormula?.name}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentFormula?.desc}
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Visual Ratio: 40% Visual / 60% Content</span>
                  <span className="text-amber-300 font-bold">Zero Repetitive Block Stacking</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 17. AI & Growth System Visual Language (Interactive Node Diagram) */}
        <div className="mb-16 max-w-5xl mx-auto p-8 rounded-3xl bg-slate-950 text-white border border-amber-500/40 shadow-2xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest">17. AI & Growth System Architecture</div>
              <h3 className="text-xl font-bold text-white">Custom Integrated System Diagrams</h3>
            </div>
            <div className="inline-flex p-1 rounded-full bg-slate-900 border border-white/10">
              {DESIGN_SYSTEM_V2_DES02.systemDiagrams.map((diag, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDiagram(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeDiagram === idx ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {diag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Connected System Node Flowchart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-6">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase text-center">
              {DESIGN_SYSTEM_V2_DES02.systemDiagrams[activeDiagram].name} Flow
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {DESIGN_SYSTEM_V2_DES02.systemDiagrams[activeDiagram].nodes.map((node, i, arr) => (
                <React.Fragment key={i}>
                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-400/30 text-amber-200 text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                    {node}
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="text-center text-[11px] text-slate-400 font-mono">
              ✓ Connected growth loops ensure every touchpoint feeds predictable healthcare revenue.
            </div>
          </div>
        </div>

        {/* 16. Signature Micro-Animations & 20. Final Principle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase font-mono">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>16. Signature Micro-Animations</span>
            </div>
            <div className="space-y-2 text-xs">
              {DESIGN_SYSTEM_V2_DES02.signatureMicroAnimations.map((anim, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-slate-800 flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✦</span>
                  <span>{anim}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-500/40 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>20. The Final Design Test</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 italic leading-relaxed">
                "{DESIGN_SYSTEM_V2_DES02.finalDesignPrinciple}"
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono text-center">
              ✓ If the answer is yes, it enters the MK Digitalverse experience.
            </div>
          </div>
        </div>

        {/* Conversion Action with 16. Signature Gold Hover Sweep Animation */}
        <div className="text-center">
          <button
            onClick={onOpenAuditModal}
            onMouseEnter={() => setIsHoveredButton(true)}
            onMouseLeave={() => setIsHoveredButton(false)}
            className="relative overflow-hidden inline-flex items-center gap-3 px-9 py-4 rounded-full bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-2xl cursor-pointer border border-amber-500/40 group"
          >
            {/* Gold Sweep Effect */}
            <span
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent transition-transform duration-700 ${
                isHoveredButton ? 'translate-x-full' : '-translate-x-full'
              }`}
            />
            <span className="relative z-10">Request Executive Growth Audit™</span>
            <ArrowRight className="w-4 h-4 text-amber-400 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
