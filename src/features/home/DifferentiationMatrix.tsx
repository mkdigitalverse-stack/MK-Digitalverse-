import React from 'react';
import { COMPARISON_MATRIX } from '../../data/content';
import { XCircle, CheckCircle2, Zap, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';

interface MatrixProps {
  onOpenAuditModal: () => void;
}

export const DifferentiationMatrix: React.FC<MatrixProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="why-mk" className="py-20 md:py-28 bg-[#050505] relative border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Positioning & Strategy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Why MK Digitalverse is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Not An Agency</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300">
            Traditional agencies sell billable hours, generic templates, and vanity metrics.
            We build predictable revenue systems tied directly to your business ROI.
          </p>
        </div>

        {/* Comparison Table / Grid */}
        <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-[#09090b]">
          
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-zinc-950 border-b border-white/10 text-xs font-bold uppercase tracking-wider">
            <div className="md:col-span-3 p-4 text-zinc-400 border-b md:border-b-0 md:border-r border-white/10 flex items-center gap-2">
              <span>Strategic Dimension</span>
            </div>
            <div className="md:col-span-4 p-4 text-rose-400/90 border-b md:border-b-0 md:border-r border-white/10 flex items-center gap-2 bg-rose-950/20">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Traditional Marketing Agency</span>
            </div>
            <div className="md:col-span-5 p-4 text-emerald-400 flex items-center gap-2 bg-emerald-950/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MK Digitalverse Growth Partner</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {COMPARISON_MATRIX.map((item, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-white/[0.02] transition-colors text-sm"
              >
                {/* Dimension */}
                <div className="md:col-span-3 p-5 font-semibold text-zinc-200 border-b md:border-b-0 md:border-r border-white/5 flex items-center bg-zinc-950/40 text-xs uppercase tracking-wider">
                  {item.dimension}
                </div>

                {/* Traditional Agency */}
                <div className="md:col-span-4 p-5 text-zinc-400 border-b md:border-b-0 md:border-r border-white/5 flex items-start gap-3 bg-rose-950/[0.03]">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-xs">{item.traditionalAgency}</span>
                </div>

                {/* MK Digitalverse Partner */}
                <div className="md:col-span-5 p-5 text-zinc-100 font-medium flex items-start gap-3 bg-emerald-950/[0.05]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-xs">{item.mkGrowthPartner}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Banner inside Matrix Section */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#0d0d14] to-zinc-950 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="hidden sm:block w-24 h-20 rounded-2xl overflow-hidden border border-amber-500/30 shrink-0 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                alt="Healthcare executive growth audit consultation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">Strategic Growth Model</span>
              <h4 className="text-xl font-bold text-white">Ready to transition from traditional agency vendor to growth partner?</h4>
              <p className="text-sm text-zinc-300">Schedule a confidential strategic audit with our healthcare growth architects.</p>
            </div>
          </div>

          <button
            onClick={onOpenAuditModal}
            className="px-7 py-3.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/10 shrink-0 flex items-center gap-2 cursor-pointer relative z-10"
          >
            <Zap className="w-4 h-4 text-black" />
            <span>Book Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
