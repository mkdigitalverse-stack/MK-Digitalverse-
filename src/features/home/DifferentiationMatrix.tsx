import React from 'react';
import { COMPARISON_MATRIX } from '../../data/content';
import { XCircle, CheckCircle2, Zap, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';

interface MatrixProps {
  onOpenAuditModal: () => void;
}

export const DifferentiationMatrix: React.FC<MatrixProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="why-mk" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Positioning & Strategy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Not Another Marketing Agency. <span className="gold-text-gradient">A Growth Partner Built Around Systems.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We replace generic ad vendor tactics with an interconnected growth operating system built around healthcare trust dynamics, doctor authority, and measurable revenue.
          </p>
        </div>

        {/* Comparison Table / Grid */}
        <div className="rounded-3xl border border-[#C5A059]/40 shadow-2xl overflow-hidden bg-[#0B172A]">
          
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#050B18] text-white text-xs font-bold uppercase tracking-wider border-b border-white/10">
            <div className="md:col-span-3 p-4 text-slate-300 border-b md:border-b-0 md:border-r border-white/10 flex items-center gap-2">
              <span>Strategic Dimension</span>
            </div>
            <div className="md:col-span-4 p-4 text-rose-300 border-b md:border-b-0 md:border-r border-white/10 flex items-center gap-2 bg-rose-950/30">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Traditional Marketing Agency</span>
            </div>
            <div className="md:col-span-5 p-4 text-[#D4AF37] flex items-center gap-2 bg-[#C5A059]/20">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>MK Digitalverse Growth Partner</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {COMPARISON_MATRIX.map((item, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-[#0F203C] transition-colors text-sm"
              >
                {/* Dimension */}
                <div className="md:col-span-3 p-5 font-bold text-white border-b md:border-b-0 md:border-r border-white/10 flex items-center bg-[#050B18]/60 text-xs uppercase tracking-wider font-display">
                  {item.dimension}
                </div>

                {/* Traditional Agency */}
                <div className="md:col-span-4 p-5 text-slate-300 border-b md:border-b-0 md:border-r border-white/10 flex items-start gap-3 bg-rose-950/10">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-xs">{item.traditionalAgency}</span>
                </div>

                {/* MK Digitalverse Partner */}
                <div className="md:col-span-5 p-5 text-white font-semibold flex items-start gap-3 bg-[#0B172A]/80">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-xs">{item.mkGrowthPartner}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Banner inside Matrix Section */}
        <div className="mt-12 p-8 rounded-3xl bg-[#0B172A] text-white border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="hidden sm:block w-24 h-20 rounded-2xl overflow-hidden border border-[#C5A059]/30 shrink-0 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                alt="Healthcare executive growth audit consultation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] block">Strategic Growth Model</span>
              <h4 className="text-xl font-bold text-white font-display">Ready to transition from traditional agency vendor to growth partner?</h4>
              <p className="text-sm text-slate-200">Schedule a confidential strategic audit with our healthcare growth architects.</p>
            </div>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="btn-gold-primary px-8 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer relative z-10"
          >
            <Zap className="w-4 h-4 text-[#0A192F]" />
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-[#0A192F]" />
          </button>
        </div>

      </div>
    </section>
  );
};
