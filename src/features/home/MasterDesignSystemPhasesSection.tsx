import React, { useState } from 'react';
import { MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES } from '../../theme/designTokens';
import { ShieldAlert, Layers, FolderTree, Sparkles, CheckSquare, ArrowRight, ShieldCheck, Check, Sliders, Play } from 'lucide-react';

interface MasterPhasesProps {
  onOpenAuditModal: () => void;
}

export const MasterDesignSystemPhasesSection: React.FC<MasterPhasesProps> = ({ onOpenAuditModal }) => {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [checkedAuditItems, setCheckedAuditItems] = useState<{ [key: string]: boolean }>({
    "Same colors?": true,
    "Same typography?": true,
    "Same spacing?": true,
    "Same icon style?": true,
    "Same photography style?": true,
    "Same button style?": true,
    "Same animations?": true,
    "Same shadows?": true,
    "Same cards?": true,
    "Same premium feeling?": true,
  });

  const toggleAudit = (item: string) => {
    setCheckedAuditItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const passCount = Object.values(checkedAuditItems).filter(Boolean).length;

  return (
    <section id="master-design-blueprint" className="py-20 md:py-28 bg-[#FAF8F3] text-slate-900 relative overflow-hidden border-t border-amber-900/10">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sliders className="w-3.5 h-3.5 text-amber-700" />
            <span>Master Design System Implementation Blueprint</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            7-Phase Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">Design System Alignment</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold">
            "{MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES.motto}"
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            From Phase 1 Development Freeze to Phase 7 Signature Experience—eliminating visual entropy and enforcing 100% brand consistency.
          </p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES.phases.map((p) => (
            <button
              key={p.phase}
              onClick={() => setActivePhase(p.phase)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activePhase === p.phase
                  ? 'bg-slate-900 text-amber-300 shadow-xl border border-amber-500/40 scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200/80'
              }`}
            >
              Phase {p.phase}: {p.name}
            </button>
          ))}
        </div>

        {/* Active Phase Showcase Card */}
        {(() => {
          const current = MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES.phases.find(p => p.phase === activePhase);
          return (
            <div className="max-w-5xl mx-auto mb-16 p-8 rounded-3xl bg-slate-900 text-white border border-amber-500/40 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                    0{current?.phase}
                  </span>
                  <div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">EXECUTION PHASE 0{current?.phase}</div>
                    <h3 className="text-xl font-bold text-white">{current?.name}</h3>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                  Rule: {current?.rule}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {current?.desc}
              </p>

              {/* Special Interactive Features based on active phase */}
              {activePhase === 1 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                  <span><strong>Phase 1 Frozen State Active:</strong> All non-system component creations are blocked until master design system tokens are globally enforced.</span>
                </div>
              )}

              {activePhase === 3 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-amber-400" />
                    <span>Phase 3 — Master Visual Asset Directory Architecture</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    {["/Healthcare", "/Doctors", "/Patients", "/Reception", "/Hospital", "/Technology", "/AI", "/Dashboards", "/Reviews", "/WebsiteMockups", "/SEO", "/CRM", "/Automation", "/Videos"].map((folder, i) => (
                      <div key={i} className="p-2 rounded bg-slate-900 border border-white/5 text-amber-200 flex items-center gap-1.5">
                        <span>📁</span>
                        <span>{folder}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePhase === 6 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                      <span>Phase 6 — Pre-Launch Consistency Audit Engine</span>
                    </div>
                    <div className="text-xs font-bold text-amber-300 font-mono">
                      Pass Rate: {passCount}/10 {passCount === 10 ? '✓ READY' : '⚠️ REVISE'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {MASTER_DESIGN_SYSTEM_BLUEPRINT_PHASES.auditChecklistItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleAudit(item)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          checkedAuditItems[item]
                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/50 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {checkedAuditItems[item] ? '✓ PASS' : '❌ FAIL'}: {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Phase 7: Growth Systems > Marketing Services Callout */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-amber-200 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Phase 7 Signature positioning</span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            Growth Systems &gt; Marketing Services
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            "I've never seen a healthcare growth website presented like this." Every touchpoint reinforces that MK Digitalverse constructs predictable, end-to-end digital growth systems for healthcare organizations.
          </p>

          <button
            onClick={onOpenAuditModal}
            className="mt-4 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-2xl cursor-pointer border border-amber-500/30"
          >
            <span>Book Strategic Growth Audit™</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
