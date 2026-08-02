import React from 'react';
import { COMPARISON_MATRIX } from '../data/content';
import { XCircle, CheckCircle2, Zap, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';

interface MatrixProps {
  onOpenAuditModal: () => void;
}

export const DifferentiationMatrix: React.FC<MatrixProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="partner-vs-agency" className="py-20 md:py-28 bg-[#070A0F] relative border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Positioning Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Why MK Digitalverse is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Not An Agency</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Traditional agencies sell billable hours, generic templates, and vanity metrics.
            We build predictable growth systems tied directly to your bottom-line revenue.
          </p>
        </div>

        {/* Comparison Table / Grid */}
        <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-900/90 border-b border-slate-800 text-sm font-bold uppercase tracking-wider">
            <div className="md:col-span-3 p-4 text-slate-400 border-b md:border-b-0 md:border-r border-slate-800 flex items-center gap-2">
              <span>Dimension</span>
            </div>
            <div className="md:col-span-4 p-4 text-rose-400/90 border-b md:border-b-0 md:border-r border-slate-800 flex items-center gap-2 bg-rose-950/20">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Traditional Digital Agency</span>
            </div>
            <div className="md:col-span-5 p-4 text-emerald-400 flex items-center gap-2 bg-emerald-950/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MK Digitalverse Growth Partner</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-800/80">
            {COMPARISON_MATRIX.map((item, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-slate-800/30 transition-colors text-sm"
              >
                {/* Dimension */}
                <div className="md:col-span-3 p-5 font-semibold text-slate-200 border-b md:border-b-0 md:border-r border-slate-800/80 flex items-center bg-slate-900/40">
                  {item.dimension}
                </div>

                {/* Traditional Agency */}
                <div className="md:col-span-4 p-5 text-slate-400 border-b md:border-b-0 md:border-r border-slate-800/80 flex items-start gap-3 bg-slate-900/10">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.traditionalAgency}</span>
                </div>

                {/* MK Digitalverse Partner */}
                <div className="md:col-span-5 p-5 text-slate-100 font-medium flex items-start gap-3 bg-emerald-950/10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.mkGrowthPartner}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Banner inside Matrix Section */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white">Ready to transition from agency vendor to growth partner?</h4>
            <p className="text-sm text-slate-300">Schedule a confidential strategic audit with our growth architects.</p>
          </div>
          <button
            onClick={onOpenAuditModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Schedule Growth Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
