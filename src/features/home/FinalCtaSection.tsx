import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FinalCtaProps {
  onOpenAuditModal: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="final-cta" className="py-20 md:py-28 bg-[#050B18] text-white relative border-b border-[#C5A059]/20 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-navy-grid pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Two-Column Card Container */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B172A] text-white border border-[#C5A059]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
          
          {/* Subtle Inner Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050B18] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Next Strategic Step</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
              Your Healthcare Organization Has Growth Potential.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]">
                Let's Build the System Behind It.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
              Tell us where your organization is today, where you want to go, and what's preventing you from getting there.
            </p>

            {/* Core Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-[#050B18] border border-[#C5A059]/30">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>30-Minute Confidential Executive Discovery</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-[#050B18] border border-[#C5A059]/30">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Custom Growth System Roadmap</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenAuditModal}
                className="btn-gold-primary px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#0A192F]" />
                <span>Book Strategic Discovery Call</span>
                <ArrowRight className="w-4 h-4 text-[#0A192F]" />
              </button>

              <button
                onClick={onOpenAuditModal}
                className="px-8 py-4 rounded-xl bg-[#050B18] hover:bg-[#0F203C] text-white font-semibold text-xs uppercase tracking-wider transition-all border border-[#C5A059]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Start With a Growth Assessment</span>
              </button>
            </div>
          </div>

          {/* Right Column: Premium Healthcare Human Visual */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18] group">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                alt="Healthcare leader and doctor discussing growth strategy in modern hospital office"
                className="w-full h-[360px] sm:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md space-y-1 text-xs">
                <span className="font-mono text-[#D4AF37] font-bold uppercase tracking-wider block">Executive Consultation</span>
                <p className="text-slate-200">
                  Direct strategic advisory tailored strictly for healthcare leaders, managing directors, and practice owners.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
