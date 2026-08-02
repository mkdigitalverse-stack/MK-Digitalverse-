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
    <section id="capabilities" className="py-20 md:py-28 bg-[#0A0D14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Integrated Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Engineered Growth Capabilities
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Every solution is architected in-house. No outsourced work, no cookie-cutter templates.
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
                className={`glass-panel rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-amber-500 bg-slate-900/90 shadow-2xl shadow-amber-500/10' 
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
                    {getCapIcon(cap.icon)}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {cap.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {cap.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                    Expected Outcome:
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {cap.businessOutcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Capability Deep Dive Box */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
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

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedCap.fullDesc}
              </p>

              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Included Technical Modules:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCap.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ready to Implement {selectedCap.title}?
              </div>
              <p className="text-xs text-slate-400">
                Schedule a custom scoping call with our lead technical architect.
              </p>
              <button
                onClick={onOpenAuditModal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
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
