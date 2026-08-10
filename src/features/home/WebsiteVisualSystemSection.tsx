import React, { useState, useEffect } from 'react';
import { WEBSITE_VISUAL_SYSTEM_V1 } from '../../theme/designTokens';
import { Eye, Play, Pause, ChevronRight, CheckCircle2, XCircle, Film, Sparkles, Layers, ArrowRight } from 'lucide-react';

interface VisualSystemProps {
  onOpenAuditModal: () => void;
}

export const WebsiteVisualSystemSection: React.FC<VisualSystemProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'rule603010' | 'standards'>('journey');
  const [journeyStep, setJourneyStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-play the patient acquisition journey step simulation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setJourneyStep((prev) => (prev + 1) % WEBSITE_VISUAL_SYSTEM_V1.patientAcquisitionJourney.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentJourney = WEBSITE_VISUAL_SYSTEM_V1.patientAcquisitionJourney[journeyStep];

  return (
    <section id="visual-system" className="py-20 md:py-28 bg-[#FDFBF7] text-slate-900 border-t border-amber-900/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>Website Visual System v1.0</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Every Visual Has a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">Purpose</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            "{WEBSITE_VISUAL_SYSTEM_V1.philosophy}"
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            We balance layout, imagery, and movement to maintain executive clarity—ensuring a 40% Visual to 60% Content balance across all healthcare touchpoints.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-slate-900 text-white shadow-lg">
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'journey' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Interactive Patient Acquisition Journey
            </button>
            <button
              onClick={() => setActiveTab('rule603010')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rule603010' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              The 60-30-10 Composition Rule
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'standards' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hero Standards & Quality Rules
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Patient Acquisition Journey Animation */}
        {activeTab === 'journey' && (
          <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-slate-900 text-white border border-amber-500/30 space-y-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest">Interactive Visual System</div>
                <h3 className="text-xl font-bold text-white">Patient Acquisition Journey Flow</h3>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Simulation' : 'Play Simulation'}</span>
              </button>
            </div>

            {/* Step Progress Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {WEBSITE_VISUAL_SYSTEM_V1.patientAcquisitionJourney.map((step, idx) => (
                <button
                  key={step.step}
                  onClick={() => { setJourneyStep(idx); setIsPlaying(false); }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    journeyStep === idx
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg scale-105'
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold uppercase text-amber-400">Step {step.step}</div>
                  <div className="text-xs font-bold truncate text-white">{step.title}</div>
                </button>
              ))}
            </div>

            {/* Active Step Showcase Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                  <span>STEP {currentJourney.step} OF 06</span>
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  <span>{currentJourney.metric}</span>
                </div>
                <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">{currentJourney.icon}</span>
                  <span>{currentJourney.title}</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentJourney.desc}
                </p>
              </div>

              <div className="w-full md:w-64 p-5 rounded-2xl bg-slate-950 border border-white/10 text-center space-y-2 shrink-0">
                <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Growth Outcome Metric</div>
                <div className="text-2xl font-extrabold text-amber-300">{currentJourney.metric}</div>
                <p className="text-[11px] text-slate-400">Automated feedback loop in Healthcare Growth System™</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: The 60-30-10 Composition Rule */}
        {activeTab === 'rule603010' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-xl space-y-6">
              <div className="text-center space-y-1">
                <div className="text-xs font-mono text-amber-800 uppercase font-bold">Composition Balance</div>
                <h3 className="text-xl font-bold text-slate-900">The 60-30-10 Executive Layout Rule</h3>
              </div>

              {/* Composition Bar */}
              <div className="w-full h-8 rounded-full bg-slate-100 overflow-hidden flex shadow-inner border border-amber-200">
                <div className="h-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center" style={{ width: '60%' }}>
                  60% Clean Layout
                </div>
                <div className="h-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center" style={{ width: '30%' }}>
                  30% Visuals
                </div>
                <div className="h-full bg-teal-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center" style={{ width: '10%' }}>
                  10% Motion
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">60% Clean White Space</div>
                  <p className="text-slate-600 text-[11px]">{WEBSITE_VISUAL_SYSTEM_V1.rule60_30_10.cleanLayout}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900">30% Glassmorphic Visuals</div>
                  <p className="text-amber-800 text-[11px]">{WEBSITE_VISUAL_SYSTEM_V1.rule60_30_10.premiumImagery}</p>
                </div>
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <div className="font-bold text-teal-900">10% Subtle Looping Motion</div>
                  <p className="text-teal-800 text-[11px]">{WEBSITE_VISUAL_SYSTEM_V1.rule60_30_10.motionAndVideo}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Hero Standards & What to Avoid */}
        {activeTab === 'standards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Hero Section Visual Standards */}
            <div className="p-6 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase font-mono">
                <Film className="w-4 h-4 text-amber-600" />
                <span>Hero Section Visual Standards</span>
              </div>
              <div className="space-y-3">
                {WEBSITE_VISUAL_SYSTEM_V1.heroSectionVisualStandards.map((std, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{std.section}</span>
                      <span className="text-[10px] font-mono text-amber-800">5-8s Loop</span>
                    </div>
                    <p className="text-slate-600 text-[11px]"><strong>Hero Visual:</strong> {std.visual}</p>
                    <p className="text-amber-900 text-[10px] font-mono">🎥 Video: {std.video}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoid List */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-rose-500/30 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase font-mono">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Strictly Banned Visual Clichés</span>
              </div>
              <div className="space-y-2">
                {WEBSITE_VISUAL_SYSTEM_V1.avoidList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-rose-500/20 text-xs text-rose-200 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-2xl cursor-pointer border border-amber-500/30"
          >
            <span>Book Strategic Discovery Call</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
