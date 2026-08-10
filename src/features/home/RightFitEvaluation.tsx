import React from 'react';
import { Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { RIGHT_FIT_PRINCIPLE } from '../../theme/designTokens';

interface RightFitProps {
  onOpenAuditModal: () => void;
}

export const RightFitEvaluation: React.FC<RightFitProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="right-fit" className="py-20 md:py-28 bg-zinc-950 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Partnership Philosophy</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Are We the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Right Fit</span>?
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {RIGHT_FIT_PRINCIPLE.partnershipPhilosophy}
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Great Fit Box */}
          <div className="p-8 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">We're a great fit if you:</h3>
            </div>

            <ul className="space-y-4 text-sm text-zinc-200">
              {RIGHT_FIT_PRINCIPLE.fitCriteria.greatFit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Fit Box */}
          <div className="p-8 rounded-3xl bg-zinc-900/90 border border-rose-500/30 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-400" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <X className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">We may not be the right fit if you:</h3>
            </div>

            <ul className="space-y-4 text-sm text-zinc-300">
              {RIGHT_FIT_PRINCIPLE.fitCriteria.notFit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Action Callout Banner */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#0d0d14] to-zinc-950 border border-amber-400/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">Selective Partnership Model</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {RIGHT_FIT_PRINCIPLE.ctaFraming}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              No generic sales pitches. Just an objective strategic conversation to review your clinical growth goals.
            </p>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 cursor-pointer relative z-10"
          >
            <span>Book Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
