import React from 'react';
import { Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { RIGHT_FIT_PRINCIPLE } from '../../theme/designTokens';

interface RightFitProps {
  onOpenAuditModal: () => void;
}

export const RightFitEvaluation: React.FC<RightFitProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="right-fit" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] border-b border-[#0A192F]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Partnership Philosophy</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Are We the <span className="gold-text-gradient">Right Fit</span>?
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {RIGHT_FIT_PRINCIPLE.partnershipPhilosophy}
          </p>

          {/* Feature Image Section directly below heading */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18]">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                alt="Executive Healthcare Leadership Strategic Consultation"
                referrerPolicy="no-referrer"
                className="w-full h-[220px] sm:h-[300px] object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="font-bold text-[#D4AF37] uppercase font-mono">Partnership Mutual Alignment</span>
                  <span className="text-slate-300 hidden sm:inline">• High-Value Clinical Partnerships Only</span>
                </div>
                <span className="text-[11px] font-mono text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
                  Selective Alignment
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Great Fit Box */}
          <div className="p-8 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37]" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050B18] border border-[#C5A059]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">We're a great fit if you:</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              {RIGHT_FIT_PRINCIPLE.fitCriteria.greatFit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#050B18] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Fit Box */}
          <div className="p-8 rounded-3xl bg-[#0B172A] border border-rose-500/30 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-rose-400" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050B18] border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <X className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">We may not be the right fit if you:</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              {RIGHT_FIT_PRINCIPLE.fitCriteria.notFit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#050B18] border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Action Callout Banner */}
        <div className="p-8 md:p-10 rounded-3xl bg-[#0B172A] text-white border border-[#C5A059]/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] block">Selective Partnership Model</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {RIGHT_FIT_PRINCIPLE.ctaFraming}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              No generic sales pitches. Just an objective strategic conversation to review your clinical growth goals.
            </p>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="btn-gold-primary inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer relative z-10"
          >
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-[#0A192F]" />
          </button>
        </div>

      </div>
    </section>
  );
};
