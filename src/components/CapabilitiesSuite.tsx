import React, { useState } from 'react';
import { CAPABILITIES } from '../data/content';
import { CapabilityItem } from '../types';
import { 
  Target, 
  Code2, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CapabilitiesProps {
  onOpenAuditModal: () => void;
}

export const CapabilitiesSuite: React.FC<CapabilitiesProps> = ({ onOpenAuditModal }) => {
  const [selectedCap, setSelectedCap] = useState<CapabilityItem>(CAPABILITIES[0]);

  const getCapIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target': return <Target className="w-6 h-6 text-amber-400" />;
      case 'Code2': return <Code2 className="w-6 h-6 text-emerald-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-cyan-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      default: return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="capabilities" className="py-20 md:py-28 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Technical Solutions Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Full-Stack Digital Growth Solutions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300">
            Every capability is engineered in-house. High-converting Webflow & Next.js platforms, AI qualification logic, technical SEO, and direct CRM integrations.
          </p>
        </div>

        {/* Grid of Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CAPABILITIES.map((cap) => {
            const isSelected = selectedCap.id === cap.id;
            return (
              <div
                key={cap.id}
                onClick={() => setSelectedCap(cap)}
                className={`glass-panel rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between bg-[#09090b] ${
                  isSelected 
                    ? 'border-white/40 bg-zinc-900/90 shadow-2xl' 
                    : 'border-white/10 hover:border-white/20 hover:bg-zinc-900/50'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-5">
                    {getCapIcon(cap.icon)}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {cap.title}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {cap.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                    Expected Outcome:
                  </span>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {cap.businessOutcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Capability Deep Dive Box */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10 bg-[#09090b]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/10">
                  {getCapIcon(selectedCap.icon)}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                    Capability Specifications
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCap.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedCap.fullDesc}
              </p>

              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                  Included Technical Modules:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCap.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-zinc-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-xl bg-zinc-950 border border-white/10 text-center space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Ready to Implement {selectedCap.title}?
              </div>
              <p className="text-xs text-zinc-400">
                Schedule a custom scoping call with our lead growth engineer.
              </p>
              <button
                onClick={onOpenAuditModal}
                className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Request Custom Scope</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
