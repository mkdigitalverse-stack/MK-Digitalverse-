import React, { useState } from 'react';
import { TWELVE_GLOBAL_MANDATES } from '../../theme/designTokens';
import { Sparkles, CheckCircle, ArrowRight, ShieldCheck, Film, Image as ImageIcon, Eye, MousePointer, Layers, Sliders, Smartphone, Activity, Award } from 'lucide-react';

interface MandatesProps {
  onOpenAuditModal: () => void;
}

export const TwelveMandatesGlobalSection: React.FC<MandatesProps> = ({ onOpenAuditModal }) => {
  const [activeMandate, setActiveMandate] = useState<number>(1);
  const [beforeAfterPos, setBeforeAfterPos] = useState<number>(50);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const currentMandate = TWELVE_GLOBAL_MANDATES.mandates.find(m => m.id === activeMandate);

  return (
    <section id="global-mandates-system" className="py-20 md:py-28 bg-[#FAF8F3] text-slate-900 relative overflow-hidden border-t border-amber-900/10">
      
      {/* 🌟 Mandatory Gold Ribbon Background Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none">
          <path
            d="M-50,200 C400,400 700,0 1100,300 C1350,450 1500,200 1600,350"
            stroke="url(#globalGoldRibbon)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="globalGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#E6C687" stopOpacity="1" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>100% Website-Wide Implementation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            12 Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">Design System Mandates</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold max-w-2xl mx-auto p-4 rounded-2xl bg-white border border-amber-200 shadow-md">
            "{TWELVE_GLOBAL_MANDATES.developerDirective}"
          </p>
        </div>

        {/* Mandate Navigation Grid (12 Items) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {TWELVE_GLOBAL_MANDATES.mandates.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMandate(m.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeMandate === m.id
                  ? 'bg-slate-900 text-amber-300 border-amber-400/80 shadow-xl scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-200/80 shadow-sm'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-600 uppercase">MANDATE 0{m.id}</div>
              <div className="text-xs font-bold truncate mt-0.5">{m.name}</div>
            </button>
          ))}
        </div>

        {/* Active Mandate Showcase Card */}
        <div className="max-w-5xl mx-auto mb-16 p-8 rounded-3xl bg-slate-950 text-white border border-amber-500/40 shadow-2xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                {currentMandate?.id}
              </span>
              <div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">GLOBAL MANDATE #{currentMandate?.id}</div>
                <h3 className="text-xl font-bold text-white">{currentMandate?.name}</h3>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              Applied Across 100% of Website
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {currentMandate?.desc}
          </p>

          {/* Interactive Demonstrations inside active mandate */}
          {activeMandate === 11 && (
            /* Interactive Before/After Healthcare Growth Slider Simulation */
            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                <span>MANDATE 11 DEMO: Interactive Before / After Growth Slider</span>
                <span>{beforeAfterPos}% Before / {100 - beforeAfterPos}% After</span>
              </div>
              
              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-around text-center p-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-rose-400 font-bold">BEFORE (Template Site)</div>
                    <div className="text-lg font-bold text-slate-400">Isolated Text Blocks</div>
                    <div className="text-xs text-slate-500">Unpredictable Patient Enquiries</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-emerald-400 font-bold">AFTER (MK Growth System™)</div>
                    <div className="text-lg font-bold text-amber-300">Connected 80/20 Story System</div>
                    <div className="text-xs text-emerald-300">+145% Qualified Appointments</div>
                  </div>
                </div>

                {/* Slider divider line */}
                <div className="absolute top-0 bottom-0 bg-amber-400 w-1 shadow-2xl" style={{ left: `${beforeAfterPos}%` }} />
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={beforeAfterPos}
                onChange={(e) => setBeforeAfterPos(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          )}

          {activeMandate === 12 && (
            /* Micro-details button sweep preview */
            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-amber-300">MANDATE 12 DEMO: Gold Sweep Hover & 4px Card Lift</div>
                <p className="text-slate-400 text-[11px]">Hover over any button or card across the site to trigger precision micro-interactions.</p>
              </div>
              <div
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  hoveredCard === 1
                    ? 'bg-amber-500/20 border-amber-400 -translate-y-1 shadow-xl text-amber-200'
                    : 'bg-slate-950 border-white/10 text-slate-300'
                }`}
              >
                ✦ Test Card Lift & Gold Glow
              </div>
            </div>
          )}
        </div>

        {/* 100% Section Visual Guarantee Grid */}
        <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-white border border-amber-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono text-amber-800 font-bold uppercase">Guarantee</div>
            <h3 className="text-xl font-bold text-slate-900">Signature Visual Content for Every Section</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            {[
              { section: "Hero", visual: "5-8s Hospital Loop Video" },
              { section: "About", visual: "Founder Strategy Discussion" },
              { section: "Services", visual: "3D Growth System Illustration" },
              { section: "AI Automation", visual: "Automation Workflow Map" },
              { section: "SEO", visual: "'Dentist Near Me' Search Card" },
              { section: "Reviews", visual: "Google Review Authority Phone" },
              { section: "Website Dev", visual: "Multi-Device Responsive Stage" },
              { section: "Performance", visual: "Real-time ROI Dashboard" },
              { section: "Case Studies", visual: "Before vs After Performance" },
              { section: "CTA", visual: "Doctor Handshake & Booking" }
            ].map((v, i) => (
              <div key={i} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1 shadow-sm">
                <div className="font-bold text-slate-900">{v.section}</div>
                <div className="text-[10px] text-amber-800 font-mono">✓ {v.visual}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Conversion Action */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-2xl cursor-pointer border border-amber-500/30"
          >
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
