import React, { useState } from 'react';
import { COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING } from '../../theme/designTokens';
import { Layers, Box, Code, Sparkles, FolderTree, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComponentSystemProps {
  onOpenAuditModal: () => void;
}

export const ComponentSystemSection: React.FC<ComponentSystemProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'tokens' | 'preview'>('hierarchy');

  return (
    <section id="component-system" className="py-20 md:py-28 bg-zinc-950 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>WEB-05 Component Engineering</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Component System & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">Design Engineering</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.mission}
          </p>
        </div>

        {/* The 80% Rule Executive Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-zinc-900 to-purple-950/40 border border-violet-500/30 text-left shadow-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0 mt-1">
            <Box className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono text-violet-400 uppercase font-bold tracking-wider">Engineering Principle: The 80% Rule</div>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium">
              "{COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.eightyPercentRule}"
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-zinc-900 border border-white/10">
            <button
              onClick={() => setActiveTab('hierarchy')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hierarchy' ? 'bg-violet-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              System Hierarchy
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tokens' ? 'bg-violet-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Folder & Animations
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-violet-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Live UI Showcase
            </button>
          </div>
        </div>

        {/* Tab 1: Hierarchy */}
        {activeTab === 'hierarchy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.designHierarchy.map((item) => (
              <div key={item.level} className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3 hover:border-violet-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400">LEVEL 0{item.level}</span>
                  <Code className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Folder Structure & Centralized Animations */}
        {activeTab === 'tokens' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Folder Architecture */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold font-mono">
                <FolderTree className="w-4 h-4" />
                <span>Feature-Based Directory Architecture</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.folderStructure.map((path, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-zinc-300 flex items-center gap-2">
                    <span className="text-violet-400">📁</span>
                    <span>{path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Centralized Animations */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Centralized Animation Library</span>
              </div>
              <div className="space-y-2">
                {COMPONENT_SYSTEM_AND_DESIGN_ENGINEERING.centralizedAnimations.map((anim, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-bold">{anim.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{anim.class}</div>
                    </div>
                    <span className="text-violet-400 font-mono text-[11px]">{anim.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live UI Showcase */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-zinc-900 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Internal Component Library (Storybook-style)</h3>
              <span className="text-xs font-mono text-violet-400">Reused across 100% of views</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Buttons Variant Showcase */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-white/5">
                <div className="text-[11px] font-mono text-violet-400 font-bold uppercase">Button Component System</div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 cursor-pointer">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 rounded-full bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-700 cursor-pointer">
                    Secondary
                  </button>
                  <button className="px-4 py-2 rounded-full border border-white/20 text-white font-bold text-xs hover:border-violet-400 cursor-pointer">
                    Outline
                  </button>
                </div>
              </div>

              {/* Badge System */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-white/5">
                <div className="text-[11px] font-mono text-violet-400 font-bold uppercase">Badge System</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold">
                    Healthcare
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    AI Growth System™
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                    Right-Fit Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onOpenAuditModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-violet-600 transition-all cursor-pointer"
              >
                <span>Request Growth Audit with System Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
