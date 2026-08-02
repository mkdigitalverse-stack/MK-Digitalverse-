import React, { useState } from 'react';
import { FRAMEWORK_STAGES } from '../data/content';
import { 
  Compass, 
  Layout, 
  Bot, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';

interface FrameworkProps {
  onOpenAuditModal: () => void;
}

export const GrowthFramework: React.FC<FrameworkProps> = ({ onOpenAuditModal }) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const activeStage = FRAMEWORK_STAGES.find(s => s.id === activeStageId) || FRAMEWORK_STAGES[0];

  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Layout': return <Layout className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="framework" className="py-20 md:py-28 bg-[#050505] relative border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Proprietary Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            The 5-Stage Growth Engineering System
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300">
            We don't launch ad-hoc campaigns. We deploy an integrated 5-phase growth system built to attract, qualify, convert, and scale high-value patient and venue revenue in India.
          </p>
        </div>

        {/* Phase Navigation Pipeline Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-10">
          {FRAMEWORK_STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-4 rounded-xl text-left transition-all relative border ${
                  isActive
                    ? 'bg-zinc-900 border-white/30 text-white shadow-xl'
                    : 'bg-zinc-950/80 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                    isActive ? 'text-amber-400' : 'text-zinc-500'
                  }`}>
                    Phase 0{stage.id}
                  </span>
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {getStageIcon(stage.icon)}
                  </div>
                </div>
                <div className="text-xs font-bold truncate">{stage.title.split(':')[1] || stage.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown Panel */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl relative bg-[#09090b]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Phase {activeStage.id} Blueprint
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {activeStage.title}
                </h3>
                <p className="text-sm font-medium text-emerald-400 mt-1">
                  {activeStage.subtitle}
                </p>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {activeStage.description}
              </p>

              {/* Deliverables List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Key System Deliverables:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeStage.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-zinc-200 p-2.5 rounded-lg bg-zinc-900 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  Engine Architecture & Tech:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStage.techStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-md bg-zinc-900 border border-white/10 text-xs font-medium text-amber-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">System Progress</span>
                <span className="text-xs font-bold text-emerald-400">Phase {activeStage.id} of 5 Active</span>
              </div>

              <div className="space-y-3">
                {FRAMEWORK_STAGES.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => setActiveStageId(s.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      s.id === activeStageId 
                        ? 'bg-amber-500/10 border border-amber-500/30 text-white' 
                        : 'hover:bg-white/5 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        s.id === activeStageId ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {s.id}
                      </span>
                      <span className="text-xs font-semibold">{s.subtitle}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${s.id === activeStageId ? 'text-amber-400' : 'text-zinc-600'}`} />
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenAuditModal}
                className="w-full mt-4 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Deploy System For Your Organization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
