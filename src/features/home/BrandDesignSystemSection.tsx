import React, { useState } from 'react';
import { BRAND_DESIGN_SYSTEM_V1 } from '../../theme/designTokens';
import { Palette, Sparkles, Eye, ShieldCheck, ArrowRight, Layout, Type, Image as ImageIcon, MessageSquare } from 'lucide-react';

interface BrandDesignProps {
  onOpenAuditModal: () => void;
}

export const BrandDesignSystemSection: React.FC<BrandDesignProps> = ({ onOpenAuditModal }) => {
  const [activeTab, setActiveTab] = useState<'personality' | 'storytelling' | 'guidelines'>('personality');

  return (
    <section id="brand-design-system" className="py-20 md:py-28 bg-[#FAF8F5] border-t border-amber-900/10 text-zinc-900 relative overflow-hidden">
      {/* Subtle warm luxury glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Brand Design System v1.0</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Premium Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">Visual Identity</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            "{BRAND_DESIGN_SYSTEM_V1.philosophy}"
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Our visual language communicates 80% of the executive message visually—delivering immediate clarity, authority, and trust before the viewer even reads the text.
          </p>
        </div>

        {/* Brand Personality Pills */}
        <div className="mb-12 p-6 rounded-3xl bg-white/90 border border-amber-200 shadow-xl text-center space-y-4">
          <div className="text-xs font-mono text-amber-800 uppercase font-bold tracking-widest">Brand Personality Matrix</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BRAND_DESIGN_SYSTEM_V1.brandPersonality.map((trait, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-bold shadow-sm">
                ✦ {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-slate-900 text-white shadow-lg">
            <button
              onClick={() => setActiveTab('personality')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'personality' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Colors & Aesthetics
            </button>
            <button
              onClick={() => setActiveTab('storytelling')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'storytelling' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Visual Storytelling (80/20)
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'guidelines' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Text Rules & Consultative CTAs
            </button>
          </div>
        </div>

        {/* Tab 1: Colors & Aesthetics */}
        {activeTab === 'personality' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Warm Backgrounds */}
            <div className="p-6 rounded-2xl bg-white border border-amber-200 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-800">
                <span>BACKGROUND SYSTEM</span>
                <Layout className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Warm & Human Canvas</h3>
              <p className="text-xs text-slate-600">Never pure white. Warm Ivory, Soft Cream, and Light Beige backgrounds create an eye-safe, executive warmth.</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {BRAND_DESIGN_SYSTEM_V1.colors.backgrounds.map((bg, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-slate-800 text-[10px] font-mono">
                    {bg}
                  </span>
                ))}
              </div>
            </div>

            {/* Luxury Gold Primary Accent */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-amber-500/40 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                <span>PRIMARY ACCENT</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-amber-200">Luxury & Champagne Gold</h3>
              <p className="text-xs text-slate-300">Gold symbolizes authority, growth value, and strategic healthcare leadership.</p>
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-xs text-center shadow-inner">
                Metallic Champagne Gradient (#D4AF37)
              </div>
            </div>

            {/* Deep Navy Secondary Accent */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-900">
                <span>SECONDARY ACCENT</span>
                <ShieldCheck className="w-4 h-4 text-blue-900" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Deep Navy & Corporate Blue</h3>
              <p className="text-xs text-slate-600">Deep navy blue grounds headlines, authority icons, and executive navigation elements.</p>
              <div className="p-2.5 rounded-xl bg-slate-900 text-blue-100 font-bold text-xs text-center">
                Executive Deep Navy (#0B192C)
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Visual Storytelling (80/20) */}
        {activeTab === 'storytelling' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase font-mono">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>Visual Concept Mapping (Show the Idea)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BRAND_DESIGN_SYSTEM_V1.visualStorytellingIcons.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                    <div className="text-[10px] font-mono text-amber-800 font-bold uppercase">{item.concept}</div>
                    <div className="text-xs font-bold text-slate-900">→ {item.visual}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infographic Diagrams */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-amber-500/30 space-y-3 shadow-md">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase">Infographic Language System</div>
              <p className="text-xs text-slate-300">We replace plain bullet lists with strategic visual diagrams:</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {BRAND_DESIGN_SYSTEM_V1.infographicDiagrams.map((diag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-slate-800 border border-amber-400/20 text-amber-300 text-xs font-medium">
                    ❖ {diag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Text Rules & Consultative CTAs */}
        {activeTab === 'guidelines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Strict Text Scale Rules */}
            <div className="p-6 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase font-mono">
                <Type className="w-4 h-4 text-amber-600" />
                <span>Strict Executive Text Scale Rules</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Headline Hook:</span>
                  <span className="font-mono text-amber-800 font-bold">{BRAND_DESIGN_SYSTEM_V1.textRules.hook}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Supporting Copy:</span>
                  <span className="font-mono text-amber-800 font-bold">{BRAND_DESIGN_SYSTEM_V1.textRules.supportingStatement}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">CTA Label:</span>
                  <span className="font-mono text-amber-800 font-bold">{BRAND_DESIGN_SYSTEM_V1.textRules.cta}</span>
                </div>
              </div>
            </div>

            {/* Consultative CTAs */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-amber-500/30 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Consultative, Non-Pushy CTAs</span>
              </div>
              <div className="space-y-2">
                {BRAND_DESIGN_SYSTEM_V1.consultativeCTAs.map((cta, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800 border border-amber-400/20 text-xs font-bold text-amber-200 flex items-center justify-between">
                    <span>"{cta}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversion Action */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-2xl cursor-pointer border border-amber-500/30"
          >
            <span>Book a Free Healthcare Growth Audit™</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
