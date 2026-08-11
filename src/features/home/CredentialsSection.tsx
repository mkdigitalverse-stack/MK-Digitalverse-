import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  Sparkles, 
  Activity, 
  Cpu, 
  TrendingUp, 
  ShieldCheck
} from 'lucide-react';

interface CredentialsSectionProps {
  onOpenAuditModal?: () => void;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // 15+ Counter State
  const [count, setCount] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(15);
      setHasCompleted(true);
      return;
    }

    if (isInView && !hasCompleted) {
      let start = 0;
      const duration = 1600; // ms
      const steps = 15;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= 15) {
          clearInterval(timer);
          setHasCompleted(true);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, prefersReducedMotion, hasCompleted]);

  return (
    <section 
      ref={containerRef}
      id="credentials" 
      className="relative py-20 sm:py-28 bg-gradient-to-b from-[#050B18] via-[#0A192F] to-[#050B18] text-white overflow-hidden border-b border-[#C5A059]/20"
    >
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1877F2]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/3 w-[500px] h-[500px] bg-[#C5A059]/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-navy-grid pointer-events-none opacity-40" />

      {/* Connected Gold Line Overlay across section */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25" 
        preserveAspectRatio="none"
        viewBox="0 0 1440 400"
      >
        <defs>
          <linearGradient id="stripGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1877F2" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#C5A059" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1877F2" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 200 Q 360 120 720 200 T 1440 200"
          fill="none"
          stroke="url(#stripGoldGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B172A] border border-[#C5A059]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest shadow-lg mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>INSTITUTIONAL CREDENTIALS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Engineered for Executive Trust &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]">
              Measurable Healthcare Expansion.
            </span>
          </h2>
        </motion.div>

        {/* ONE UNIFIED GLASS CONTAINER / HORIZONTAL EXECUTIVE STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl bg-[#081324]/85 border border-[#C5A059]/35 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle Glare & Inner Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/5 via-transparent to-[#1877F2]/5 pointer-events-none" />

          {/* Unified 4-Column Horizontal Credential Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-[#C5A059]/25">
            
            {/* ========================================================= */}
            {/* ITEM 1: 15+ YEARS                                         */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-[#D4AF37] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30">
                  CREDENTIAL 01
                </span>
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              </div>

              {/* Counter Display */}
              <div className="py-2">
                <div className="flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                    {count}
                  </span>
                  <span className="text-3xl sm:text-4xl font-display font-extrabold text-[#D4AF37] ml-0.5">
                    +
                  </span>
                  <span className="text-sm font-mono font-extrabold text-[#D4AF37] uppercase tracking-wider ml-2">
                    YEARS
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-display mt-2">
                  Digital Marketing Experience
                </h3>
              </div>

              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                Deep specialization in healthcare audience behavior, regional patient acquisition and digital growth strategy.
              </p>
            </div>

            {/* ========================================================= */}
            {/* ITEM 2: HEALTHCARE FOCUSED                                */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-[#D4AF37] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30">
                  CREDENTIAL 02
                </span>
                <Activity className="w-4 h-4 text-[#1877F2]" />
              </div>

              {/* Pulse Line & Icon Visual */}
              <div className="py-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="w-full h-6 relative">
                    <svg className="w-full h-full" viewBox="0 0 140 24" fill="none">
                      <path
                        d="M 0 12 L 35 12 L 45 2 L 55 22 L 65 7 L 75 16 L 85 12 L 140 12"
                        stroke="#1877F2"
                        strokeWidth="1.5"
                        strokeOpacity="0.3"
                      />
                      <motion.path
                        d="M 0 12 L 35 12 L 45 2 L 55 22 L 65 7 L 75 16 L 85 12 L 140 12"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: [0, 1] } : {}}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white font-display">
                  Healthcare Focused
                </h3>
                <p className="text-xs font-semibold text-[#D4AF37]">
                  Growth Strategy & Execution
                </p>
              </div>

              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                Customized for healthcare organizations including hospitals, IVF and fertility institutes, dental networks and specialized clinical practices.
              </p>
            </div>

            {/* ========================================================= */}
            {/* ITEM 3: AI-POWERED                                        */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-[#D4AF37] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30">
                  CREDENTIAL 03
                </span>
                <Cpu className="w-4 h-4 text-[#D4AF37]" />
              </div>

              {/* Connected AI Nodes Visual */}
              <div className="py-2">
                <div className="w-full h-10 mb-1 relative flex items-center">
                  <svg className="w-full h-full" viewBox="0 0 160 36">
                    {/* Connecting lines */}
                    <line x1="15" y1="18" x2="55" y2="10" stroke="#1877F2" strokeWidth="1.5" opacity="0.5" />
                    <line x1="15" y1="18" x2="55" y2="28" stroke="#1877F2" strokeWidth="1.5" opacity="0.5" />
                    <line x1="55" y1="10" x2="105" y2="18" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
                    <line x1="55" y1="28" x2="105" y2="18" stroke="#1877F2" strokeWidth="1.5" opacity="0.5" />
                    <line x1="105" y1="18" x2="145" y2="18" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />

                    {/* Nodes */}
                    <circle cx="15" cy="18" r="4" fill="#1877F2" />
                    <circle cx="55" cy="10" r="4" fill="#3B82F6" />
                    <circle cx="55" cy="28" r="4" fill="#1877F2" />
                    <circle cx="105" cy="18" r="6" fill="#D4AF37" className="animate-pulse" />
                    <circle cx="145" cy="18" r="4" fill="#D4AF37" />

                    {/* Travelling Data Signal Dot */}
                    <motion.circle
                      cx="15"
                      cy="18"
                      r="2.5"
                      fill="#FFFFFF"
                      animate={{
                        cx: [15, 55, 105, 145],
                        cy: [18, 10, 18, 18]
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </div>

                <h3 className="text-base font-bold text-white font-display">
                  AI-Powered
                </h3>
                <p className="text-xs font-semibold text-[#D4AF37]">
                  Systems & Automation
                </p>
              </div>

              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                AI-assisted workflows for enquiry qualification, follow-up and operational efficiency.
              </p>
            </div>

            {/* ========================================================= */}
            {/* ITEM 4: PERFORMANCE DRIVEN                                */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-[#D4AF37] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30">
                  CREDENTIAL 04
                </span>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>

              {/* Upward Trajectory Curve Visual */}
              <div className="py-2">
                <div className="w-full h-10 mb-1 relative flex items-center">
                  <svg className="w-full h-full" viewBox="0 0 160 36">
                    <defs>
                      <linearGradient id="stripCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 32 C 40 30, 80 18, 120 10 L 155 4 L 155 36 L 0 36 Z"
                      fill="url(#stripCurveGrad)"
                    />
                    <motion.path
                      d="M 0 32 C 40 30, 80 18, 120 10 L 155 4"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                    />
                    <circle cx="155" cy="4" r="3.5" fill="#D4AF37" className="animate-pulse" />
                  </svg>
                </div>

                <h3 className="text-base font-bold text-white font-display">
                  Performance Driven
                </h3>
                <p className="text-xs font-semibold text-[#D4AF37]">
                  Built Around Measurable Growth
                </p>
              </div>

              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                A business-first approach connecting marketing activity with measurable growth outcomes.
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
