import React, { useState } from 'react';
import { IndustryType } from '../../types';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Play,
  X,
  Activity,
  Building2,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  activeIndustry?: IndustryType;
  onSelectIndustry?: (ind: IndustryType) => void;
  onOpenAuditModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAuditModal
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#050B18] text-white border-b border-[#C5A059]/20">
      
      {/* Background Radial Glow Effects & Gold Ribbon SVG */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#1877F2]/15 via-[#C5A059]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-navy-grid pointer-events-none opacity-40" />

      {/* Signature Animated Gold Connection Ribbon / Path */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30" 
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
      >
        <defs>
          <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1877F2" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -100 250 Q 350 100 720 380 T 1540 200"
          fill="none"
          stroke="url(#goldRibbonGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 8"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M -50 450 Q 500 650 900 300 T 1500 550"
          fill="none"
          stroke="url(#goldRibbonGrad)"
          strokeWidth="1.5"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0B172A] border border-[#C5A059]/40 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              DIGITAL GROWTH PARTNER FOR HEALTHCARE
            </span>
          </div>
        </motion.div>

        {/* Two-Column Desktop Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center mb-16">
          
          {/* Left Column: Headline, Narrative & Primary CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Primary H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
              Build a healthcare organization people trust—
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] underline decoration-[#C5A059]/40 underline-offset-8">
                and choose.
              </span>
            </h1>

            {/* Strategic Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              We help ambitious healthcare organizations build measurable, long-term growth through strategy, brand positioning, conversion-focused websites, AI-powered business systems, and performance marketing.
            </p>

            {/* Core Outcome Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-[#0B172A]/90 border border-[#C5A059]/30 shadow-xs hover:border-[#D4AF37]/60 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Healthcare Growth Strategy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-[#0B172A]/90 border border-[#C5A059]/30 shadow-xs hover:border-[#D4AF37]/60 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Brand Positioning & Authority</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-[#0B172A]/90 border border-[#C5A059]/30 shadow-xs hover:border-[#D4AF37]/60 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Conversion-Focused Websites</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-[#0B172A]/90 border border-[#C5A059]/30 shadow-xs hover:border-[#D4AF37]/60 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>AI Systems & Performance Marketing</span>
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenAuditModal}
                className="btn-gold-primary px-8 py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#0A192F]" />
                <span>Book Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#growth-system"
                className="px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-[#0B172A] text-white border border-[#C5A059]/40 hover:bg-[#102240] hover:border-[#D4AF37] hover:scale-[1.01] transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Explore Growth System™</span>
              </a>
            </div>

            {/* Video Preview Trigger / Executive Note */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#D4AF37] group-hover:scale-110 transition-transform flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span className="underline decoration-slate-400 underline-offset-4 group-hover:decoration-white">
                  Watch 15s Executive Overview
                </span>
              </button>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">Confidential Discovery Process</span>
            </div>

          </motion.div>

          {/* Right Column: Premium Healthcare Visual with Animated Floating Growth Indicator */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            
            {/* Primary Healthcare Environment Visual */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl group bg-[#0B172A]">
              <motion.img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                alt="Executive Healthcare Leadership & Clinical Excellence Environment"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

              {/* Top Video Preview Badge Overlay */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-[#050B18]/90 backdrop-blur-md border border-[#C5A059]/40 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0B172A] transition-all cursor-pointer shadow-lg"
                >
                  <Play className="w-3 h-3 text-[#D4AF37] fill-current" />
                  <span>Executive Briefing</span>
                </button>
              </div>

              {/* Bottom Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0A192F]/90 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Strategic Growth Partner</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Powering clinical authority, patient trust, and predictable business expansion for leading healthcare institutions.
                </p>
              </div>
            </div>

            {/* Subtle Floating Healthcare Growth Index™ Indicator Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -8, 0], opacity: 1 }}
              transition={{ 
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.8, delay: 0.4 }
              }}
              className="absolute -bottom-6 -left-4 sm:-left-6 p-5 rounded-2xl bg-[#0A192F]/95 border border-[#C5A059]/40 shadow-2xl backdrop-blur-xl w-[280px] sm:w-[320px] space-y-3 z-20"
            >
              
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Healthcare Growth Index™
                    </span>
                  </div>
                  <span className="text-[9px] text-amber-300/80 font-mono ml-6">[System Benchmark]</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C5A059]/20 border border-[#C5A059]/30 text-amber-300 font-mono text-xs font-extrabold">
                  <span>78</span>
                  <span className="text-xs">→</span>
                  <span className="text-emerald-400">91</span>
                </div>
              </div>

              {/* Gentle Graph SVG Movement */}
              <div className="h-10 w-full relative pt-1">
                <svg className="w-full h-full" viewBox="0 0 280 40">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 35 Q 70 25 140 18 T 280 5 L 280 40 L 0 40 Z"
                    fill="url(#chartGrad)"
                  />
                  <motion.path
                    d="M 0 35 Q 70 25 140 18 T 280 5"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-slate-300">Qualified Enquiries</span>
                  <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                    <span>↑ 142%</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-slate-300">Appointment Conversion</span>
                  <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                    <span>↑ 38%</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-slate-300">Patient Trust Index</span>
                  <span className="text-amber-300 font-bold font-mono flex items-center gap-1">
                    <span>↑ 96%</span>
                  </span>
                </div>
              </div>

            </motion.div>

          </motion.div>

        </div>

      </div>

      {/* Video Modal Placeholder */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A192F] border border-[#C5A059]/40 rounded-2xl max-w-2xl w-full p-6 text-white relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              aria-label="Close Video Modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-mono">
              <Play className="w-4 h-4 fill-current" />
              <span>Executive Briefing Video Preview</span>
            </div>

            <h3 className="text-xl font-bold text-white">
              Healthcare Growth System™ — 15s Executive Overview
            </h3>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-white/10 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Healthcare Video Preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#0A192F] flex items-center justify-center shadow-2xl mb-3 animate-pulse font-bold">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <div className="text-sm font-bold text-white">Cinematic Healthcare Footage</div>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  10-15s muted cinematic video loop ready for custom client production.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Duration: 0:15 • Confidential Executive Briefing</span>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onOpenAuditModal();
                }}
                className="btn-gold-primary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Book Discovery Call
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
