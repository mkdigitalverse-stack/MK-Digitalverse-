import React from 'react';
import { CASE_STUDIES } from '../data/content';
import { ShieldCheck, Quote, ArrowRight, TrendingUp } from 'lucide-react';

interface ProofProps {
  onOpenAuditModal: () => void;
}

export const CaseStudyProof: React.FC<ProofProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="proof" className="py-20 md:py-28 bg-[#0A0D14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Client Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Proven Results for Healthcare Leaders & Luxury Venues
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            We measure our success by the growth of our partners. Here is how our growth systems perform in the real world.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {CASE_STUDIES.map((cs) => (
            <div 
              key={cs.id}
              className="glass-panel rounded-2xl p-8 border border-slate-800 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {cs.clientCategory}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    {cs.industry === 'healthcare' ? 'Healthcare' : 'Luxury Venues'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {cs.title}
                </h3>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong className="text-slate-100 font-semibold block text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">The Bottleneck:</strong>
                    {cs.challenge}
                  </p>
                  <p>
                    <strong className="text-slate-100 font-semibold block text-emerald-400 uppercase text-[10px] tracking-wider mb-0.5">The Growth Solution:</strong>
                    {cs.solution}
                  </p>
                </div>

                {/* Results Stats Grid */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  {cs.results.map((res, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-lg sm:text-xl font-display font-extrabold text-amber-400">
                        {res.metric}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-2">
                        {res.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial Quote */}
                {cs.quote && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 italic text-xs text-slate-300 relative">
                    <Quote className="w-6 h-6 text-slate-800 absolute top-2 right-2 -z-0" />
                    <p className="relative z-10">"{cs.quote.text}"</p>
                    <div className="mt-3 not-italic font-bold text-slate-200 text-right">
                      {cs.quote.author} <span className="font-normal text-slate-400 text-[11px]">— {cs.quote.role}</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>

        {/* Audit Callout Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-slate-800 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to become our next success story?
          </h3>
          <p className="text-sm text-slate-300 mb-6">
            We limit active partner onboarding to maintain uncompromised execution quality.
          </p>
          <button
            onClick={onOpenAuditModal}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span>Apply For Partner Qualification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
