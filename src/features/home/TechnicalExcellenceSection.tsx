import React, { useState } from 'react';
import { TECHNICAL_EXCELLENCE_AND_SEO } from '../../theme/designTokens';
import { Cpu, ShieldCheck, Zap, Globe, Search, Code2, Lock, LayoutGrid, CheckCircle2, Terminal } from 'lucide-react';

interface TechSectionProps {
  onOpenAuditModal: () => void;
}

export const TechnicalExcellenceSection: React.FC<TechSectionProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'pillars' | 'aeo' | 'schema'>('vitals');

  return (
    <section id="technical-excellence" className="py-20 md:py-28 bg-zinc-950 border-t border-white/10 relative overflow-hidden">
      {/* Subtle tech background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            <span>WEB-04 Technical Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            SEO, Performance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Technical Excellence</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {TECHNICAL_EXCELLENCE_AND_SEO.technicalMission}
          </p>
        </div>

        {/* 5-Year Vision Executive Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-teal-950/40 border border-emerald-500/30 text-left shadow-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">The 5-Year Technical Standard</div>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium">
              "{TECHNICAL_EXCELLENCE_AND_SEO.fiveYearVision}"
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-zinc-900 border border-white/10">
            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'vitals' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Core Web Vitals
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pillars' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              10 Technical Pillars
            </button>
            <button
              onClick={() => setActiveTab('aeo')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'aeo' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              AI Search (AEO)
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'schema' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              JSON-LD Schema
            </button>
          </div>
        </div>

        {/* Tab 1: Core Web Vitals */}
        {activeTab === 'vitals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TECHNICAL_EXCELLENCE_AND_SEO.coreWebVitalsTargets.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/90 border border-emerald-500/20 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>TARGET METRIC</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{item.target}</div>
                <div className="text-xs font-semibold text-zinc-300">{item.metric}</div>
                <div className="text-[11px] text-zinc-400 border-t border-white/5 pt-2">{item.priority}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 10 Technical Pillars */}
        {activeTab === 'pillars' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TECHNICAL_EXCELLENCE_AND_SEO.tenPillars.map((p) => (
              <div key={p.num} className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2 hover:border-emerald-500/30 transition-all">
                <div className="text-[10px] font-mono text-emerald-400 font-bold">PILLAR {p.num}</div>
                <div className="text-xs font-bold text-white">{p.name}</div>
                <p className="text-[11px] text-zinc-400 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: AEO AI Search Optimization */}
        {activeTab === 'aeo' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-zinc-300">
              <strong className="text-emerald-400">AI Engine Optimization (AEO):</strong> Optimized for direct natural language queries from ChatGPT, Gemini, and Perplexity with verified structured healthcare answers.
            </div>
            <div className="space-y-4">
              {TECHNICAL_EXCELLENCE_AND_SEO.aeoQuestions.map((q, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Query: "{q.q}"</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pl-6 border-l-2 border-emerald-500/40">
                    <strong className="text-emerald-400 font-mono text-[10px] uppercase block mb-0.5">Structured Answer Engine:</strong>
                    {q.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: JSON-LD Schema */}
        {activeTab === 'schema' && (
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-zinc-900 border border-white/10 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-emerald-400 font-bold pb-2 border-b border-white/10">
              <span>ld+json Schema Entity (MedicalBusiness & Organization)</span>
              <Code2 className="w-4 h-4" />
            </div>
            <pre className="text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "MK Digitalverse",
  "description": "${TECHNICAL_EXCELLENCE_AND_SEO.technicalMission}",
  "url": "https://mkdigitalverse.com",
  "logo": "https://mkdigitalverse.com/logo.png",
  "knowsAbout": [
    "Healthcare Growth Strategy",
    "Patient Acquisition Systems",
    "Medical Brand Positioning",
    "Healthcare Web Architecture"
  ]
}`}
            </pre>
          </div>
        )}

        {/* Section Bottom CTA Banner */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
            Audit your clinic's technical web performance score
          </p>
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-black" />
            <span>Request Technical Web Audit</span>
            <CheckCircle2 className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
