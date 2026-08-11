import React from 'react';
import { Award, ShieldCheck, ArrowRight, Sparkles, User, CheckCircle2, TrendingUp } from 'lucide-react';

interface FounderSectionProps {
  onOpenAuditModal: () => void;
}

export const FounderLeadershipSection: React.FC<FounderSectionProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="leadership" className="py-20 md:py-28 bg-[#FDFBF7] text-[#0A192F] relative border-b border-[#0A192F]/10 overflow-hidden">
      
      {/* Light Grid Background */}
      <div className="absolute inset-0 bg-cream-grid pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 text-[#8B6B23] text-xs font-bold uppercase tracking-widest shadow-xs">
            <User className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Strategic Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
            Built by Experience. Designed for the Next Generation of <span className="gold-text-gradient">Healthcare Growth.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Strategic leadership bridging 15+ years of digital marketing, healthcare brand transformation, and AI-driven business systems.
          </p>
        </div>

        {/* Two-Column Founder Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B172A] border border-[#C5A059]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          
          {/* Left Column: Founder Editorial Portrait Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#050B18] group">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Muid Khan - Founder & Strategic Growth Director at MK Digitalverse"
                className="w-full h-[400px] sm:h-[480px] object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#050B18]/90 border border-[#C5A059]/40 backdrop-blur-md space-y-1 text-white">
                <div className="text-xl font-extrabold font-display">Muid Khan</div>
                <div className="text-xs font-mono font-semibold text-[#D4AF37] uppercase tracking-wider">
                  Founder & Strategic Growth Partner
                </div>
                <div className="text-[11px] text-slate-300 pt-1">
                  MK Digitalverse • Healthcare Growth Advisory
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Strategic Leadership Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                Executive Vision
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Muid Khan
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Over the last 15+ years, Muid Khan has advised and built digital growth systems for high-trust organizations. Driven by the philosophy that healthcare marketing requires deep empathy, medical authority, and rigorous unit economics, Muid founded MK Digitalverse as a specialized Healthcare Growth Consultancy.
              </p>
            </div>

            {/* Strategic Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>15+ Years Digital Expertise</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deep track record across search acquisition, positioning, and digital platform engineering.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Healthcare Specialization</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Dedicated focus on hospitals, specialty clinics, IVF centres, and medical organizations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Systems Thinking</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Integrating brand positioning, web engineering, CRM, and AI into one seamless growth engine.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 space-y-1 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Business Transformation</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deploying intelligent patient triage and automated follow-up workflows for zero lead leakage.
                </p>
              </div>
            </div>

            {/* Strategic Quote Callout */}
            <blockquote className="p-4 rounded-xl bg-[#050B18] border border-[#C5A059]/30 text-slate-200 text-xs font-semibold italic">
              "In healthcare, trust is the ultimate currency. Our job is to bridge clinical doctor excellence with modern digital accessibility so patients find the care they need."
            </blockquote>

            <div className="pt-2">
              <button
                onClick={onOpenAuditModal}
                className="btn-gold-primary px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Request Executive Growth Audit</span>
                <ArrowRight className="w-4 h-4 text-[#0A192F]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
